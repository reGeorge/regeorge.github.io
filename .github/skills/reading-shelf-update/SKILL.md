---
name: reading-shelf-update
description: 'Use when updating the reading shelf, adding books, syncing reading history from the Obsidian vault, attaching reading collision notes under books, refreshing progress, or deciding how to fetch book covers safely. Keywords: 阅读书架, 书架更新, 读书历史, 读书卡片, 封面获取, reading shelf, book covers, Obsidian 阅读.'
argument-hint: 'Describe the new books, progress changes, or reading notes to sync into the shelf.'
user-invocable: true
disable-model-invocation: false
---

# Reading Shelf Update

## When To Use
- Add new books to the reading shelf.
- Update reading progress, status, author, or publisher.
- Sync details from the Obsidian vault under `~/Documents/codeStore/obsidian/阅读/`.
- Attach or refresh collision-note counts and snapshot summaries beneath a book.
- Decide the safest available cover strategy without relying on fragile hotlinks.

## Source Of Truth
- Shelf UI: `projects/reading-shelf/index.html`
- Shelf data: `projects/reading-shelf/data/books-data.js`
- Obsidian reading snapshots: `~/Documents/codeStore/obsidian/阅读/*.md`
- Book collision rules: `.rules/book-collision-protocol.md`

## Required Workflow
1. Read `projects/reading-shelf/data/books-data.js` before editing so you preserve existing ordering and fields.
2. Search the Obsidian vault under `~/Documents/codeStore/obsidian/阅读/` for matching book snapshots.
3. If a matching snapshot exists, copy only factual metadata and concise summary fields from that note:
   `书名` / `作者` / `读完日期` / `状态` / `核心主张` / `预设读者` / `与我的距离` / upgraded collision titles.
4. If no snapshot exists, still add the book to the shelf, but set `source` to `截图整理` or another explicit source label and keep detail fields as `待补`.
5. Keep cover handling on the 3-level fallback path described in [cover strategy](./references/cover-strategy.md). Treat WeRead and Douban only as risky enrichment fallbacks, not as the primary stable layer.
6. Update the homepage entry only if the page location changes. Normal book updates should not touch the homepage.
7. After edits, validate the touched HTML file and open the shelf page to verify rendering and filter behavior.

## Data Rules
- Keep each book object flat at the top level and nest long-form content inside `detail`.
- Preserve fields even when empty: `source`, `detail.summary`, `detail.thesis`, `detail.reader`, `detail.distance`, `detail.collisions`.
- `notes` must equal the number of collision items actually shown in `detail.collisions`, unless there is an explicit manual override reason.
- Prefer explicit Chinese status values: `已读`, `在读`, `想读`, `放弃`.

## Cover Rules
- Do not hotlink e-commerce covers directly.
- Do not scrape covers blindly from search results.
- Prefer API-based lookup, then stable public cover endpoints, then generated placeholder covers.
- WeRead and Douban can be used for personal-tool enrichment, but only with explicit fallbacks and without assuming long-term stability.
- If the user provides licensed cover assets, treat those as the highest-priority override.

## Output Expectations
- The shelf should remain directly openable as a static file.
- Book cards should still render without network access.
- Folded sections should degrade gracefully when Obsidian details are missing.

## References
- [Cover strategy](./references/cover-strategy.md)
- [Update checklist](./references/update-checklist.md)
- [Book collision protocol](./references/book-collision-protocol.md)