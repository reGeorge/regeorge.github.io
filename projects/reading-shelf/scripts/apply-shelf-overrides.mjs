import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const repoRoot = process.cwd();
const projectRoot = path.join(repoRoot, "projects/reading-shelf");
const booksDataPath = path.join(projectRoot, "data/books-data.js");

function printUsage() {
    console.log("Usage: node projects/reading-shelf/scripts/apply-shelf-overrides.mjs <overrides.json> [--write] [--output <file>]");
    console.log("Default mode prints a summary only. Add --write to update data/books-data.js or the file passed via --output.");
}

function normalizeStatus(status) {
    if (status === "想读" || status === "放弃") {
        return "未读";
    }
    return ["已读", "在读", "未读"].includes(status) ? status : "未读";
}

function getBookKey(book) {
    return book.bookId || [book.title, book.author].filter(Boolean).join("__");
}

async function loadBooks() {
    const raw = await fs.readFile(booksDataPath, "utf8");
    const sandbox = { window: {} };
    vm.createContext(sandbox);
    vm.runInContext(raw, sandbox);
    return sandbox.window.READING_SHELF_BOOKS || [];
}

async function loadOverrides(overridesPath) {
    const raw = await fs.readFile(overridesPath, "utf8");
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || !parsed.books || typeof parsed.books !== "object") {
        throw new Error("Override file must contain a top-level books object.");
    }
    return parsed;
}

function applyOverrides(books, overrides) {
    const result = [];
    const summary = {
        updated: 0,
        removed: 0,
        quickNotes: 0,
        missingKeys: []
    };

    const overrideMap = new Map(Object.entries(overrides.books));
    const seenKeys = new Set();

    for (const book of books) {
        const bookKey = getBookKey(book);
        const override = overrideMap.get(bookKey);
        if (!override) {
            result.push(book);
            continue;
        }

        seenKeys.add(bookKey);
        if (override.removed) {
            summary.removed += 1;
            continue;
        }

        const progress = Math.max(0, Math.min(100, Number(override.progress)));
        const quickNote = String(override.quickNote || "").trim();
        const nextBook = {
            ...book,
            status: normalizeStatus(override.status || book.status),
            progress: Number.isFinite(progress) ? progress : (Number.isFinite(book.progress) ? book.progress : 0),
            detail: {
                ...(book.detail || {})
            }
        };

        if (quickNote) {
            nextBook.detail.quickNote = quickNote;
            summary.quickNotes += 1;
        } else if (nextBook.detail && Object.prototype.hasOwnProperty.call(nextBook.detail, "quickNote")) {
            delete nextBook.detail.quickNote;
        }

        result.push(nextBook);
        summary.updated += 1;
    }

    for (const bookKey of overrideMap.keys()) {
        if (!seenKeys.has(bookKey)) {
            summary.missingKeys.push(bookKey);
        }
    }

    return { result, summary };
}

async function writeBooks(books, targetPath) {
    const output = "window.READING_SHELF_BOOKS = " + JSON.stringify(books, null, 4) + ";\n";
    await fs.writeFile(targetPath, output, "utf8");
}

async function main() {
    const args = process.argv.slice(2);
    if (!args.length || args.includes("--help") || args.includes("-h")) {
        printUsage();
        process.exit(args.length ? 0 : 1);
    }

    const writeMode = args.includes("--write");
    const outputIndex = args.indexOf("--output");
    const outputPath = outputIndex >= 0 && args[outputIndex + 1]
        ? path.resolve(repoRoot, args[outputIndex + 1])
        : booksDataPath;
    const inputArg = args.find((arg) => !arg.startsWith("--"));
    if (!inputArg) {
        printUsage();
        process.exit(1);
    }

    const overridesPath = path.resolve(repoRoot, inputArg);
    const [books, overrides] = await Promise.all([
        loadBooks(),
        loadOverrides(overridesPath)
    ]);

    const { result, summary } = applyOverrides(books, overrides);

    console.log("Override summary:");
    console.log(`- export time: ${overrides.exportedAt || "unknown"}`);
    console.log(`- books updated: ${summary.updated}`);
    console.log(`- books removed: ${summary.removed}`);
    console.log(`- quick notes merged: ${summary.quickNotes}`);
    if (summary.missingKeys.length) {
        console.log(`- missing keys: ${summary.missingKeys.length}`);
        summary.missingKeys.forEach((key) => console.log(`  - ${key}`));
    }

    if (!writeMode) {
        console.log("Dry run only. Re-run with --write to update data/books-data.js.");
        return;
    }

    await writeBooks(result, outputPath);
    console.log(`Updated ${path.relative(repoRoot, outputPath)}`);
}

main().catch((error) => {
    console.error(error.message || error);
    process.exit(1);
});