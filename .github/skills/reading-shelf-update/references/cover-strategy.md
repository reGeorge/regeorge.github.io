# Cover Strategy

Use this exact fallback ladder when deciding how to populate book covers.

## L1: Google Books API
- Query by `isbn:` when ISBN is known.
- If ISBN is unknown, query by `intitle:` + `inauthor:` and compare title / author / publisher.
- Store returned metadata locally instead of depending on live search results every render.
- Good for: title matching, publisher metadata, imageLinks.
- Risk: requires API key; Chinese editions and exact domestic cover variants are not always stable.

## L2: Open Library Covers API
- Use ISBN or OLID to request a cover from `https://covers.openlibrary.org/b/...`.
- Append `?default=false` so missing covers return 404 instead of a blank placeholder.
- Respect the documented rate limit for non-OLID / non-CoverID access.
- Good for: stable public cover URLs on public pages.
- Risk: Chinese title coverage is uneven.

## L3: Generated Typographic Covers
- Build a local cover from title + author + publisher + theme colors.
- This is the default static-safe fallback when L1 and L2 fail.
- Good for: zero external dependency, zero copyright ambiguity in the page render.
- Risk: it is not the real commercial edition cover.

## Experimental Risky Sources

### WeRead Non-official Search
- Endpoint seen working in practice: `https://weread.qq.com/api/store/search?keyword=...`
- Often returns `bookInfo.cover` without login for store search results.
- Good for: Chinese commercial editions and domestic cover variants.
- Risk: non-official, subject to field changes and anti-crawl controls. Use only as a personal-tool enrichment layer.

### Douban Legacy / Third-party Access
- Useful mainly for ISBN, publisher, summary, ratings, and sometimes cover URLs.
- Good for: metadata enrichment when ISBN is known.
- Risk: official public API stability is poor, and many surviving solutions are wrappers or crawlers.

## Practical Ordering
- Stable path: Google Books API -> Open Library Covers API -> generated placeholder cover.
- Personal-tool enrichment path: WeRead search -> Douban-derived metadata -> generated placeholder cover.
- Never assume WeRead or Douban can safely serve as a long-term production dependency without caching and manual review.

## Manual Override
- If the user provides a licensed or personally owned cover asset, save it locally and override the generated cover.
- Prefer local assets under `assets/img/reading-shelf/` if this becomes a real cover workflow later.