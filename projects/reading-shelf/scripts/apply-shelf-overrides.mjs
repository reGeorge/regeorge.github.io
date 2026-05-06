import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const repoRoot = process.cwd();
const projectRoot = path.join(repoRoot, "projects/reading-shelf");
const booksDataPath = path.join(projectRoot, "data/books-data.js");

function printUsage() {
    console.log("Usage: node projects/reading-shelf/scripts/apply-shelf-overrides.mjs <progress-export.json> [--write] [--output <file>]");
    console.log("Default mode prints a summary only. Add --write to update data/books-data.js or the file passed via --output.");
}

function clampProgress(value) {
    return Math.max(0, Math.min(100, Number(value) || 0));
}

function deriveStatus(progress) {
    if (progress >= 100) {
        return "已读";
    }
    if (progress <= 0) {
        return "未读";
    }
    return "在读";
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
        unchanged: 0,
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
        const progress = clampProgress(typeof override === "number" ? override : override.progress);
        const baseProgress = clampProgress(book.progress);
        if (progress === baseProgress) {
            summary.unchanged += 1;
            result.push(book);
            continue;
        }

        const nextBook = {
            ...book,
            status: deriveStatus(progress),
            progress
        };

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
    console.log(`- books unchanged: ${summary.unchanged}`);
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