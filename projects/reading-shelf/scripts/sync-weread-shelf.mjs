import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const repoRoot = process.cwd();
const projectRoot = path.join(repoRoot, "projects/reading-shelf");
const booksDataPath = path.join(projectRoot, "data/books-data.js");
const obsidianReadingDir = path.resolve(repoRoot, "../obsidian/阅读");

const WEREAD_COOKIE = process.env.WEREAD_COOKIE || "";
const REQUEST_HEADERS = {
    accept: "application/json, text/plain, */*",
    cookie: WEREAD_COOKIE,
    "user-agent": "Mozilla/5.0"
};

const THEME_PALETTE = [
    ["#f2e8d9", "#d7cab5"],
    ["#335db6", "#1f2f6a"],
    ["#fff3e6", "#eb7a4d"],
    ["#98806b", "#dccba6"],
    ["#fff3df", "#e6ad52"],
    ["#f8fbff", "#7aa5d9"],
    ["#f7f1e7", "#d0b27c"],
    ["#50736f", "#be996d"],
    ["#5e88c8", "#9db9de"],
    ["#7fc8e9", "#d9f0f7"],
    ["#131313", "#7f694f"],
    ["#f9f6ee", "#d9c49d"],
    ["#d7edf4", "#95b8c8"],
    ["#f5f5f5", "#aaaaaa"],
    ["#f4ebd5", "#d9c18d"],
    ["#f6f9f4", "#8ac39c"]
];

function normalize(value) {
    return String(value || "")
        .toLowerCase()
        .replace(/[·:：()（）\[\]【】《》“”"'\-—\s]/g, "")
        .replace(/[.,/\\]/g, "");
}

function normalizeAuthor(value) {
    return normalize(value).replace(/\[[^\]]+\]/g, "");
}

function tokenizeAuthor(value) {
    return normalizeAuthor(value)
        .split(/[\/、,&，]/)
        .map((item) => item.trim())
        .filter(Boolean);
}

function hasMeaningfulText(value) {
    const text = String(value || "").trim();
    return Boolean(text && !["待补", "待开始", "待迁移"].includes(text));
}

function hashString(value) {
    let hash = 0;
    for (const char of String(value || "")) {
        hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
    }
    return hash;
}

function makeTheme(title) {
    return THEME_PALETTE[hashString(title) % THEME_PALETTE.length];
}

function upgradeCover(url) {
    if (!url) {
        return "";
    }
    return url.replace("/t6_", "/t9_").replace("/s_", "/t9_");
}

function formatTimestamp(timestamp) {
    if (!timestamp) {
        return "";
    }
    const date = new Date(timestamp * 1000);
    if (Number.isNaN(date.getTime())) {
        return "";
    }
    return date.toISOString().slice(0, 10);
}

function extractSection(raw, heading) {
    const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const match = raw.match(new RegExp(`^## ${escaped}\\n([\\s\\S]*?)(?=^## |^---$|\\Z)`, "m"));
    if (!match) {
        return "";
    }
    return match[1].trim();
}

function simplifyParagraph(value) {
    return String(value || "")
        .replace(/^>\s?/gm, "")
        .replace(/\n{2,}/g, "\n")
        .trim();
}

function extractCollisions(raw) {
    const upgradedMatch = raw.match(/^### 升级后的洞见卡\n([\s\S]*?)$/m);
    if (!upgradedMatch) {
        return [];
    }
    return upgradedMatch[1]
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => /^\d+\./.test(line))
        .map((line) => line.replace(/^\d+\.\s*/, "").trim());
}

async function loadExistingBooks() {
    const raw = await fs.readFile(booksDataPath, "utf8");
    const sandbox = { window: {} };
    vm.createContext(sandbox);
    vm.runInContext(raw, sandbox);
    return sandbox.window.READING_SHELF_BOOKS || [];
}

async function loadObsidianNotes() {
    const entries = await fs.readdir(obsidianReadingDir, { withFileTypes: true });
    const notes = [];
    for (const entry of entries) {
        if (!entry.isFile() || !entry.name.endsWith(".md")) {
            continue;
        }
        const fullPath = path.join(obsidianReadingDir, entry.name);
        const raw = await fs.readFile(fullPath, "utf8");
        const frontmatterMatch = raw.match(/^---\n([\s\S]*?)\n---/);
        const frontmatter = frontmatterMatch ? frontmatterMatch[1] : "";
        const fields = {};
        for (const line of frontmatter.split("\n")) {
            const separatorIndex = line.indexOf("：");
            if (separatorIndex === -1) {
                continue;
            }
            const key = line.slice(0, separatorIndex).trim();
            const value = line.slice(separatorIndex + 1).trim();
            fields[key] = value;
        }
        const title = fields["书名"] || entry.name.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/\.md$/, "");
        const thesis = simplifyParagraph(extractSection(raw, "核心主张"));
        const reader = simplifyParagraph(extractSection(raw, "预设读者"));
        const distance = simplifyParagraph(extractSection(raw, "与我的距离"));
        const collisions = extractCollisions(raw);
        notes.push({
            title,
            author: fields["作者"] || "",
            status: fields["状态"] || "",
            finishedDate: fields["读完日期"] || "",
            detail: {
                summary: collisions.length
                    ? `Obsidian 已有阅读快照和 ${collisions.length} 张碰撞记录。`
                    : "Obsidian 已有阅读快照，碰撞记录待补。",
                thesis: thesis || "待补",
                reader: reader || "待补",
                distance: distance || "待补",
                collisions,
                obsidianFile: `~/Documents/codeStore/obsidian/阅读/${entry.name}`
            }
        });
    }
    return notes;
}

function findExactNote(notesByTitle, title) {
    return notesByTitle.get(normalize(title));
}

function computeTitleOverlap(left, right) {
    const a = normalize(left);
    const b = normalize(right);
    if (!a || !b) {
        return 0;
    }
    if (a === b) {
        return 1;
    }
    if (a.includes(b) || b.includes(a)) {
        return Math.min(a.length, b.length) / Math.max(a.length, b.length);
    }
    return 0;
}

function authorsRoughlyMatch(left, right) {
    const leftTokens = tokenizeAuthor(left);
    const rightTokens = tokenizeAuthor(right);
    if (!leftTokens.length || !rightTokens.length) {
        return false;
    }
    return leftTokens.some((token) => rightTokens.some((candidate) => candidate.includes(token) || token.includes(candidate)));
}

function findExistingMatch(remoteBook, existingBooks, usedTitles) {
    const exact = existingBooks.find((book) => normalize(book.title) === normalize(remoteBook.title) && !usedTitles.has(book.title));
    if (exact) {
        return exact;
    }

    const candidates = existingBooks
        .filter((book) => !usedTitles.has(book.title))
        .map((book) => ({
            book,
            overlap: computeTitleOverlap(book.title, remoteBook.title),
            authorMatch: authorsRoughlyMatch(book.author, remoteBook.author)
        }))
        .filter((item) => item.overlap >= 0.82 && item.authorMatch)
        .sort((left, right) => right.overlap - left.overlap);

    return candidates[0]?.book || null;
}

async function fetchJson(url) {
    const response = await fetch(url, { headers: REQUEST_HEADERS });
    if (!response.ok) {
        throw new Error(`HTTP ${response.status} for ${url}`);
    }
    return response.json();
}

async function mapWithConcurrency(items, limit, worker) {
    const results = new Array(items.length);
    let index = 0;

    async function runNext() {
        while (index < items.length) {
            const current = index;
            index += 1;
            results[current] = await worker(items[current], current);
        }
    }

    await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => runNext()));
    return results;
}

function statusFromWeread(remoteEntry, progressInfo) {
    if (progressInfo?.book?.finishTime || remoteEntry.book?.finished === 1) {
        return "已读";
    }
    const progress = Number(progressInfo?.book?.progress ?? 0);
    if (progress > 0 || progressInfo?.book?.isStartReading === 1) {
        return "在读";
    }
    return "未读";
}

function resolveProgress(remoteEntry, progressInfo) {
    const progress = progressInfo?.book?.progress;
    if (typeof progress === "number") {
        return Math.max(0, Math.min(100, Math.round(progress)));
    }
    if (remoteEntry.book?.finished === 1) {
        return 100;
    }
    return 0;
}

function formatEdition(existingBook, detailInfo) {
    if (existingBook?.edition) {
        return existingBook.edition;
    }
    if (detailInfo?.translator) {
        return `译者：${detailInfo.translator}`;
    }
    if (detailInfo?.category) {
        return detailInfo.category;
    }
    return "微信读书";
}

function mergeDetail(existingBook, note) {
    const existingDetail = existingBook?.detail || {};
    const noteDetail = note?.detail || {};
    const collisions = Array.isArray(existingDetail.collisions) && existingDetail.collisions.length
        ? existingDetail.collisions
        : noteDetail.collisions || [];

    return {
        summary: hasMeaningfulText(existingDetail.summary)
            ? existingDetail.summary
            : (noteDetail.summary || "微信读书已同步，读书快照待补。"),
        thesis: hasMeaningfulText(existingDetail.thesis)
            ? existingDetail.thesis
            : (noteDetail.thesis || "待补"),
        reader: hasMeaningfulText(existingDetail.reader)
            ? existingDetail.reader
            : (noteDetail.reader || "待补"),
        distance: hasMeaningfulText(existingDetail.distance)
            ? existingDetail.distance
            : (noteDetail.distance || "待补"),
        collisions,
        ...(existingDetail.obsidianFile ? { obsidianFile: existingDetail.obsidianFile } : {}),
        ...(!existingDetail.obsidianFile && noteDetail.obsidianFile ? { obsidianFile: noteDetail.obsidianFile } : {})
    };
}

function buildSource(existingBook, note) {
    if (existingBook?.source && existingBook.source.includes("Obsidian")) {
        return existingBook.source;
    }
    if (note) {
        return "微信读书 + Obsidian";
    }
    if (existingBook?.source) {
        return existingBook.source.includes("微信读书")
            ? existingBook.source
            : `${existingBook.source} + 微信读书`;
    }
    return "微信读书同步";
}

function buildBook(remoteEntry, detailInfo, progressInfo, existingBook, note) {
    const detail = mergeDetail(existingBook, note);
    const title = remoteEntry.book?.title || existingBook?.title || "未命名书籍";
    const status = statusFromWeread(remoteEntry, progressInfo);
    const lastReadDate = formatTimestamp(progressInfo?.book?.finishTime || progressInfo?.book?.startReadingTime || 0);
    return {
        bookId: remoteEntry.bookId,
        title,
        coverTitle: existingBook?.coverTitle || title,
        author: detailInfo?.author || remoteEntry.book?.author || existingBook?.author || note?.author || "待补",
        publisher: detailInfo?.publisher || existingBook?.publisher || "微信读书",
        status,
        progress: resolveProgress(remoteEntry, progressInfo),
        notes: Array.isArray(detail.collisions) ? detail.collisions.length : 0,
        edition: formatEdition(existingBook, detailInfo),
        theme: Array.isArray(existingBook?.theme) ? existingBook.theme : makeTheme(title),
        source: buildSource(existingBook, note),
        cover: upgradeCover(detailInfo?.cover || remoteEntry.book?.cover || existingBook?.cover || ""),
        lastReadDate,
        readingTime: progressInfo?.book?.readingTime || 0,
        detail
    };
}

function hasPreferredPublisher(book) {
    return Boolean(book.publisher && book.publisher !== "微信读书");
}

function scoreBook(book) {
    return (book.progress || 0) * 10
        + Math.min((book.readingTime || 0) / 60, 200)
        + (hasPreferredPublisher(book) ? 15 : 0)
        + (book.cover ? 5 : 0)
        + ((book.notes || 0) * 20);
}

function mergeDuplicateBookGroup(primary, alternative) {
    const merged = { ...primary };
    if (!hasPreferredPublisher(merged) && hasPreferredPublisher(alternative)) {
        merged.publisher = alternative.publisher;
    }
    if ((!merged.edition || merged.edition === "微信读书") && alternative.edition && alternative.edition !== "微信读书") {
        merged.edition = alternative.edition;
    }
    if (!merged.lastReadDate && alternative.lastReadDate) {
        merged.lastReadDate = alternative.lastReadDate;
    }
    if ((!merged.cover || merged.cover.includes("parsecover")) && alternative.cover) {
        merged.cover = alternative.cover;
    }
    if ((!merged.detail || !hasMeaningfulText(merged.detail.summary)) && alternative.detail) {
        merged.detail = alternative.detail;
        merged.notes = alternative.notes;
    }
    return merged;
}

function dedupeBooks(books) {
    const groups = new Map();
    for (const book of books) {
        const key = `${normalize(book.title)}|${normalizeAuthor(book.author)}`;
        const list = groups.get(key) || [];
        list.push(book);
        groups.set(key, list);
    }

    const deduped = [];
    for (const group of groups.values()) {
        const ranked = group.slice().sort((left, right) => scoreBook(right) - scoreBook(left));
        const [first, ...rest] = ranked;
        deduped.push(rest.reduce((current, candidate) => mergeDuplicateBookGroup(current, candidate), first));
    }
    return deduped;
}

function normalizeExistingOnlyBook(book) {
    return {
        ...book,
        status: book.status === "想读" ? "未读" : book.status,
        cover: book.cover || "",
        lastReadDate: book.lastReadDate || "",
        readingTime: book.readingTime || 0,
        notes: Array.isArray(book.detail?.collisions) ? book.detail.collisions.length : (book.notes || 0)
    };
}

async function main() {
    if (!WEREAD_COOKIE) {
        throw new Error("Missing WEREAD_COOKIE environment variable.");
    }

    const [existingBooks, obsidianNotes, shelfResponse] = await Promise.all([
        loadExistingBooks(),
        loadObsidianNotes(),
        fetchJson("https://weread.qq.com/api/user/notebook")
    ]);

    const notesByTitle = new Map(obsidianNotes.map((note) => [normalize(note.title), note]));
    const usedExistingTitles = new Set();
    const remoteBooks = Array.isArray(shelfResponse.books) ? shelfResponse.books : [];

    const enrichedBooks = await mapWithConcurrency(remoteBooks, 4, async (remoteEntry) => {
        const [detailInfo, progressInfo] = await Promise.all([
            fetchJson(`https://weread.qq.com/web/book/info?bookId=${remoteEntry.bookId}`),
            fetchJson(`https://weread.qq.com/web/book/getProgress?bookId=${remoteEntry.bookId}`)
        ]);

        const remoteBook = {
            title: detailInfo?.title || remoteEntry.book?.title || "",
            author: detailInfo?.author || remoteEntry.book?.author || ""
        };
        const existingBook = findExistingMatch(remoteBook, existingBooks, usedExistingTitles);
        if (existingBook) {
            usedExistingTitles.add(existingBook.title);
        }

        const note = findExactNote(notesByTitle, remoteBook.title) || findExactNote(notesByTitle, existingBook?.title || "");
        return buildBook(remoteEntry, detailInfo, progressInfo, existingBook, note);
    });

    const preservedBooks = existingBooks
        .filter((book) => !usedExistingTitles.has(book.title))
        .map((book) => normalizeExistingOnlyBook(book));

    const outputBooks = dedupeBooks([...enrichedBooks, ...preservedBooks]);
    const output = `window.READING_SHELF_BOOKS = ${JSON.stringify(outputBooks, null, 4)};\n`;
    await fs.writeFile(booksDataPath, output, "utf8");

    const statusCount = outputBooks.reduce((accumulator, book) => {
        accumulator[book.status] = (accumulator[book.status] || 0) + 1;
        return accumulator;
    }, {});
    console.log(`synced ${enrichedBooks.length} remote books, preserved ${preservedBooks.length} local books`);
    console.log(`status summary: ${JSON.stringify(statusCount)}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});