---
description: "Use when publishing content to the Knowledge Atlas page, adding new knowledge nodes, updating knowledge-graph.js, or any data-driven content that requires source anchoring. Covers dual-anchor constraint, node structure, and category/topic assignment rules."
applyTo: "projects/philosophy-flywheel/**"
---

# Knowledge Atlas 发布规范

## 架构速览

```
sources/*.md             ← 原始 Obsidian 笔记（单一事实来源）
data/knowledge-graph.js  ← 视图 Schema（唯一写入目标）
index.html               ← 四层 UI（只读取 knowledge-graph.js，不直接嵌内容）
```

增量内容**只写 `knowledge-graph.js`**，不直接修改 `index.html`。
详细操作流程见 `.github/skills/knowledge-atlas-update/SKILL.md`。

## 强限制：双重锚定
任何节点写入 `knowledge-graph.js` 前，必须同时满足：
1. **来源锚定**：`source` 字段指向明确的 `sources/YYYY-MM-DD-标题.md` 路径
2. **原话锚定**：`oneLiner` / `philosophyNote` / `keyTakeaways` 必须锚定用户原话，只能对原意升华，不得偏离或捏造

### Stop-and-ask 硬触发
**找不到原始 `.md` 来源时，必须停下询问，不允许继续写入节点。** 标准回复模板：
> 我没在 `dailyNote/` 和 `projects/philosophy-flywheel/sources/` 下检索到关于「XXX」的原始记录。
> 请提供：(a) 原话片段、(b) 笔记路径、或 (c) 明确指示"按你理解先起草，标注 status: draft"。

### 用词锁定
节点的 `oneLiner` 和 `philosophyNote` 引用用户原话部分，**一字不改**。`keyTakeaways` 可用书面语整理，但不能替换用户使用过的关键词。

## 节点结构（Node Schema）

```js
{
  id: 'kebab-case-unique-id',
  topicId: '对应 topics 中的 id',
  title: '卡片标题',
  bookBadge: '书名 或 null',          // 书籍来源标签
  oneLiner: '一句话核心洞见',
  philosophyNote: '哲学笔记正文',
  status: 'reviewed | draft',
  updatedAt: 'YYYY-MM-DD',
  source: 'sources/YYYY-MM-DD-标题.md',
  keyTakeaways: ['要点1', '要点2', '要点3'],
  relations: [
    { type: 'belongs-to | related | extends | contrasts', targetId: 'node-id', label: '关联描述' }
  ]
}
```

## 分类规则

| category | 适用内容 |
|----------|----------|
| `ai-workflow` | 人机协作、工具流、认知升级 |
| `thinking` | 清晰思考、决策框架、快思考觉察 |
| `mental-models` | 书籍提炼的跨域认知框架 |
| `growth` | 方向·状态·执行，认知管理 |
| `life-philosophy` | 焦急与平静、当下体验、万物相通 |
| `sports` | 乒乓球技术（外链至 project-table-tennis） |
| `output` | 页面实验、工具构建（外链至其他项目） |

新节点的 topic 若找不到合适归属，优先扩展现有 topic，其次新建 topic 后再新建 category。

## 禁止事项
- **不准** 在无对应 `.md` 或对话记录时自行联想细节
- **不准** 直接修改 `index.html` 来嵌入内容，必须走 `knowledge-graph.js`
- **不准** 忽略用户「贴近原话」的要求
