---
name: knowledge-atlas-update
description: 'Use when adding new knowledge nodes to the Knowledge Atlas, syncing Obsidian notes into knowledge-graph.js, updating existing nodes, or managing categories and topics. Keywords: Knowledge Atlas, knowledge-graph.js, 知识节点, 新增节点, 更新节点, 哲学飞轮, atlas, topic, category.'
argument-hint: 'Describe the new node content, its source .md file, and the target category/topic.'
user-invocable: true
disable-model-invocation: false
---

# Knowledge Atlas Update

## When To Use
- Add a new knowledge node from an Obsidian source note.
- Update an existing node's content, status, or relations.
- Add a new topic under an existing category.
- Sync a batch of notes into the Atlas after a writing session.

## Architecture

```
sources/YYYY-MM-DD-标题.md   ← Source of truth (Obsidian note)
data/knowledge-graph.js      ← Only write target (view schema)
index.html                   ← Read-only UI, never edit directly for content
```

**Rule**: All content changes go into `knowledge-graph.js`. The UI reads from it automatically.

## Source Of Truth
- Knowledge graph data: `projects/philosophy-flywheel/data/knowledge-graph.js`
- Source notes: `projects/philosophy-flywheel/sources/*.md`
- Category/topic definitions: top of `knowledge-graph.js` under `KNOWLEDGE_GRAPH.categories` and `KNOWLEDGE_GRAPH.topics`

## Required Workflow

### Adding a New Node

1. **Verify source**: Confirm the `.md` file exists in `sources/`. If not → Stop-and-ask.
2. **Read knowledge-graph.js**: Check existing categories/topics to find the right `topicId`.
3. **Draft node object** following the Node Schema (see below). Quote user's original phrasing verbatim in `oneLiner` and `philosophyNote`.
4. **Check for duplicates**: Search existing `nodes` array for same title or similar `oneLiner`.
5. **Insert node** into the correct position in the `nodes` array (group by topicId for readability).
6. **Update `meta.updatedAt`** to today's date.
7. **Update `meta.totalNodes`** count.
8. **Validate**: Open the Atlas page locally to confirm the new card appears in the correct category.

### Updating an Existing Node

1. Find the node by `id` in `knowledge-graph.js`.
2. Edit only the fields that changed. Never overwrite `source` or `id`.
3. Update `updatedAt` to today.
4. If status changes to `reviewed`, ensure `keyTakeaways` has ≥ 2 items.

### Adding a New Topic

Only if no existing topic fits. Add to `KNOWLEDGE_GRAPH.topics` array:
```js
{
  id: 'kebab-case-topic-id',
  categoryId: 'existing-category-id',
  label: '中文主题名',
  description: '一句话描述'
}
```

## Node Schema

```js
{
  id: 'kebab-case-unique-id',          // URL-safe, globally unique
  topicId: 'existing-topic-id',
  title: '卡片标题',
  bookBadge: '书名' | null,            // null for non-book nodes
  oneLiner: '一句话核心洞见',           // verbatim from user or source note
  philosophyNote: '哲学笔记正文',       // may be null if not yet written
  status: 'reviewed' | 'draft',
  updatedAt: 'YYYY-MM-DD',
  source: 'sources/YYYY-MM-DD-标题.md',
  keyTakeaways: ['要点1', '要点2'],    // min 2 for reviewed nodes
  relations: [
    {
      type: 'belongs-to' | 'related' | 'extends' | 'contrasts',
      targetId: 'other-node-id',
      label: '关联描述'
    }
  ]
}
```

## Category Assignment Guide

| categoryId | 适用内容 |
|------------|----------|
| `ai-workflow` | 人机协作、工具流、自动化、认知升级 |
| `thinking` | 清晰思考、决策、快思考觉察、信息不对称 |
| `mental-models` | 书籍提炼的跨域认知框架（乔布斯传、纳瓦尔、复利等） |
| `growth` | 方向·状态·执行操作系统、认知管理、知识工作 |
| `life-philosophy` | 焦急与平静、当下体验、正念、万物相通 |
| `sports` | 乒乓球技术体系（外链页面，不在此 Atlas 内） |
| `output` | 页面实验、工具构建（外链页面，不在此 Atlas 内） |

## Dual-Anchor Constraint
Every node must satisfy:
1. `source` points to a real `.md` file in `sources/`
2. `oneLiner` is traceable to user's original words or the source note

If either anchor is missing → Stop and ask before writing.

## Data Integrity Checks
- No duplicate `id` values
- Every `topicId` references an existing topic
- Every `relations[].targetId` references an existing node id
- `meta.totalNodes` equals actual `nodes` array length

## Output Expectations
- `knowledge-graph.js` remains valid JS (wrapped in `const KNOWLEDGE_GRAPH = {...}`)
- Atlas page renders new card in correct category without any changes to `index.html`
- `meta.updatedAt` reflects today's date after any write
