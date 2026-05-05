#!/usr/bin/env python3
import json
import re
from collections import defaultdict
from pathlib import Path

DATA_FILE = Path(__file__).resolve().parents[1] / 'data' / 'books-data.js'
OUT_FILE = DATA_FILE.with_name('books-data.deduped.js')

def load_books(path):
    txt = path.read_text(encoding='utf-8')
    # extract the array between the first '[' after '=' and the last '];'
    m = re.search(r"=\s*(\[.*\])\s*;", txt, flags=re.S)
    if not m:
        raise ValueError('cannot find array in books-data.js')
    arr_text = m.group(1)
    data = json.loads(arr_text)
    return data, txt

def normalize(s: str) -> str:
    if not s:
        return ''
    s = s.lower()
    s = re.sub(r"[\s\u3000]+", ' ', s)
    # remove common punctuation and whitespace
    s = re.sub(r"[,:。！，·\-—()\[\]{}'\"_。？、·]", '', s)
    return s.strip()

def key_of(book):
    title = book.get('title') or ''
    author = book.get('author') or ''
    return normalize(title) + '||' + normalize(author)

def merge_group(items):
    # pick first as canonical, but merge useful fields
    base = dict(items[0])
    for other in items[1:]:
        # prefer non-empty fields
        for k, v in other.items():
            if not base.get(k) and v:
                base[k] = v
        # merge notes count
        try:
            if isinstance(base.get('notes'), int) and isinstance(other.get('notes'), int):
                base['notes'] = max(base.get('notes', 0), other.get('notes', 0))
        except Exception:
            pass
    return base

def main():
    data, raw = load_books(DATA_FILE)
    groups = defaultdict(list)
    title_groups = defaultdict(list)
    for b in data:
        groups[key_of(b)].append(b)
        title = b.get('title') or ''
        title_groups[normalize(title)].append(b)

    dup_groups = {k: v for k, v in groups.items() if len(v) > 1}
    dup_title_only = {k: v for k, v in title_groups.items() if len(v) > 1}

    if not dup_groups and not dup_title_only:
        print('No duplicates found.')
        return

    if dup_groups:
        print(f'Found {len(dup_groups)} duplicate groups by title+author:')
        for k, items in dup_groups.items():
            print('\n---')
            for it in items:
                print('-', it.get('title'), ' / ', it.get('author'), ' (id=', it.get('bookId', ''))

    if dup_title_only:
        print(f'\nFound {len(dup_title_only)} duplicate groups by title only:')
        for k, items in dup_title_only.items():
            print('\n=== Title:', k)
            for it in items:
                print('-', it.get('title'), ' / ', it.get('author'), ' (id=', it.get('bookId', ''))

    # produce merged list using title+author groups first, then for title-only groups merge conservatively
    new_list = []
    handled = set()
    for k, items in groups.items():
        if len(items) == 1:
            new_list.append(items[0])
            handled.add(id(items[0]))
        else:
            merged = merge_group(items)
            new_list.append(merged)
            for it in items:
                handled.add(id(it))
    # add any remaining items not handled (should be none)
    for items in title_groups.values():
        for it in items:
            if id(it) not in handled:
                new_list.append(it)
                handled.add(id(it))

    # write out deduped file (not overwriting original)
    out_text = 'window.READING_SHELF_BOOKS = ' + json.dumps(new_list, ensure_ascii=False, indent=4) + ';\n'
    OUT_FILE.write_text(out_text, encoding='utf-8')
    print('\nWrote deduped data to', OUT_FILE)

if __name__ == '__main__':
    main()
