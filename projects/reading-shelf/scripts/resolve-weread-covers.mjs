import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const rootDir = path.resolve(process.cwd(), "projects/reading-shelf");
const dataPath = path.join(rootDir, "data/books-data.js");
const outputPath = path.join(rootDir, "data/cover-candidates.js");

function normalize(value) {
    return String(value || "")
        .toLowerCase()
        .replace(/[·:：()（）\[\]【】《》“”"'\-—\s]/g, "")
        .replace(/[.,/\\]/g, "");
}

function scoreCandidate(book, candidate) {
    const targetTitle = normalize(book.title);
    const targetAuthor = normalize(book.author);
    const candidateTitle = normalize(candidate.title);
    const candidateAuthor = normalize(candidate.author);

    let score = 0;
    if (candidateTitle === targetTitle) {
        score += 8;
    }
    if (candidateTitle.includes(targetTitle) || targetTitle.includes(candidateTitle)) {
        score += 5;
    }
    const authorTokens = targetAuthor.split(/[\/、]/).map((item) => item.trim()).filter(Boolean);
    for (const token of authorTokens) {
        if (token && candidateAuthor.includes(token)) {
            score += 3;
            break;
        }
    }
    if (normalize(book.publisher) && normalize(String(candidate.publisher || "")).includes(normalize(book.publisher))) {
        score += 2;
    }
    return score;
}

function upgradeCover(url) {
    if (!url) {
        return "";
    }
    return url.replace("/s_", "/t9_");
}

async function loadBooks() {
    const raw = await fs.readFile(dataPath, "utf8");
    const sandbox = { window: {} };
    vm.createContext(sandbox);
    vm.runInContext(raw, sandbox);
    return sandbox.window.READING_SHELF_BOOKS || [];
}

async function searchWeread(book) {
    const url = `https://weread.qq.com/api/store/search?keyword=${encodeURIComponent(book.title)}`;
    const response = await fetch(url, {
        headers: { "user-agent": "Mozilla/5.0" }
    });
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }
    const payload = await response.json();
    const matches = (payload.results || [])
        .flatMap((result) => result.books || [])
        .map((item) => ({
            bookId: item.bookInfo?.bookId || "",
            title: item.bookInfo?.title || "",
            author: item.bookInfo?.author || "",
            publisher: item.bookInfo?.publisher || "",
            cover: item.bookInfo?.cover || "",
            readingCount: item.readingCount || 0
        }))
        .filter((item) => item.cover);

    if (!matches.length) {
        return null;
    }

    const ranked = matches
        .map((item) => ({ item, score: scoreCandidate(book, item) }))
        .sort((left, right) => {
            if (right.score !== left.score) {
                return right.score - left.score;
            }
            return (right.item.readingCount || 0) - (left.item.readingCount || 0);
        });

    const best = ranked[0];
    if (!best || best.score < 5) {
        return null;
    }

    return {
        source: "weread-search",
        bookId: best.item.bookId,
        title: best.item.title,
        author: best.item.author,
        cover: upgradeCover(best.item.cover),
        fallbackCover: best.item.cover,
        score: best.score
    };
}

async function main() {
    const books = await loadBooks();
    const results = {};

    for (const book of books) {
        try {
            const candidate = await searchWeread(book);
            if (candidate) {
                results[book.title] = candidate;
                console.log(`resolved: ${book.title} -> ${candidate.title}`);
            } else {
                console.log(`miss: ${book.title}`);
            }
        } catch (error) {
            console.log(`error: ${book.title} -> ${error.message}`);
        }
    }

    await fs.writeFile(outputPath, `window.READING_SHELF_COVERS = ${JSON.stringify(results, null, 4)};\n`, "utf8");
    console.log(`wrote ${outputPath}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});