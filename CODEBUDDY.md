# CLAUDE.md / CODEBUDDY.md

本文件同时为 Claude Code 和 CodeBuddy 提供项目指引。双向同步，内容一致。

---

## 项目概述

reGeorge 的个人作品集 & 知识展示站，纯静态 HTML + CSS + JS，基于 GitHub Pages 部署，无构建工具。全部中文（zh-CN）。

> **协作者**：本仓库由 Re（仓库主）和「龙虾」共同使用。规则对两人一视同仁，不做身份区分。

## 本地预览

```
python -m http.server
```

或直接打开 HTML 文件。

## 部署

推送 `master` → GitHub Actions（`.github/workflows/deploy.yml`）自动将 `.deploy_git/` 同步到 `gh-pages` 分支。

## 架构

```
index.html                    ← 站点主页 / 四维飞轮导航入口
projects/
  [project-name]/
    index.html                ← 各项目独立页面（CSS/JS 全部内联，无共享框架）
    sources/                  ← Markdown 源文件（Obsidian 笔记）
    data/                     ← 数据层 JS 文件（被 index.html 运行时读取）
assets/img/[project-name]/    ← 压缩后的图片资源
resume/index.html             ← 简历页
```

每个 `projects/` 子目录是自包含的单页应用，各有独立视觉风格（暖纸白底色调，移动端响应式）。无跨项目共享的 CSS 或 JS。

### 关键项目清单

| 项目 | 入口 | 说明 |
|------|------|------|
| Knowledge Atlas | `projects/philosophy-flywheel/index.html` | 哲学数据飞轮，四层 UI 读取 `data/knowledge-graph.js` |
| 阅读书架 | `projects/reading-shelf/reading-roadmap.html` | 阅读入口（唯一），`reading-study.html` 为单书深读页 |
| 自动化工作站 | `projects/autoTestStation/index.html` | 工程架构展示 |
| 投资笔记 | `projects/invest-journal/index.html` | 买/持/卖观点时间线 |
| 乒乓技术图谱 | `projects/project-table-tennis/index.html` | 乒乓球技术体系 |
| 花园池塘 | `projects/gardenForLilis/index.html` | 亲子互动页 |
| 磁贴成长 | `projects/stickergotaro/index.html` | 亲子习惯系统 |

### Knowledge Atlas 数据流

```
sources/*.md             ← 原始 Obsidian 笔记（唯一事实来源）
data/knowledge-graph.js  ← 视图 Schema（唯一内容写入目标）
index.html               ← 四层 UI（只读取 knowledge-graph.js，不直接嵌内容）
```

**规则**：所有增量内容只写 `knowledge-graph.js`，不动 `index.html`。

---

## 对话契约（最高优先级）

### 起手三动作（任何"写笔记 / 发卡片"指令都必须做）

1. **grep 查重**：先在对应数据文件搜关键词，确认没有重复条目
2. **quote 原话**：用 `> ` 引用块把用户原话贴出来
3. **等确认**：等用户点头才动笔，不要先写完再问

### 导师式对话

- 宁可追问 3 次锁定原意，也不要自行补全
- 不确定时直接问：「你说的 X 是指 A 还是 B？」
- 用户说不清楚时，可以引导但不能替他下结论

### 用词锁定

- 用户说「焦急」就**不要**改成「焦虑」「焦灼」「急躁」
- 「碰撞」≠「碰撞融合」「思想碰撞」——不要加修饰词
- 短句不合并、口语不整理、错别字之外的"瑕疵"不修
- 节奏即风格，用户没分点就不要替他分点

### AI 腔禁用清单

禁止以下句式/词汇出现在写给用户的笔记和卡片正文中：
- 「在这个瞬息万变的世界里」「让我们一起」「值得我们深思」
- 「不仅…而且…」「无论…还是…」这类对仗排比
- 自行生成的「例如」「比如」「想象一下」（除非用户明确给了案例）
- 任何形式的虚构案例、虚构数据、虚构对话

### Stop-and-ask 硬触发（必须停下问，不准继续）

- 找不到对应的原始 `.md` 来源 → 标准回复：

  > 我没在 `sources/` 下检索到关于「XXX」的原始记录。请提供：(a) 原话片段、(b) 笔记路径、或 (c) 明确指示"按你理解先起草，标注 status: draft"。

- 批量改动 ≥3 个文件前 → 先列 diff 计划等用户确认

---

## Knowledge Atlas 操作规范

### 核心约束：双重锚定

任何节点写入 `knowledge-graph.js` 前必须同时满足：
1. **来源锚定**：`source` 字段指向明确的 `sources/YYYY-MM-DD-标题.md` 路径
2. **原话锚定**：`oneLiner` / `philosophyNote` / `keyTakeaways` 必须锚定用户原话

找不到原始 `.md` 来源 → Stop-and-ask。

### Node Schema

```js
{
  id: 'kebab-case-unique-id',
  topicId: '对应 topics 中的 id',
  title: '卡片标题',
  bookBadge: '书名' | null,
  oneLiner: '一句话核心洞见',           // 用户原话，一字不改
  philosophyNote: '哲学笔记正文',       // 可为 null
  status: 'reviewed' | 'draft',
  updatedAt: 'YYYY-MM-DD',
  source: 'sources/YYYY-MM-DD-标题.md',
  keyTakeaways: ['要点1', '要点2'],    // reviewed 节点至少 2 条
  relations: [
    {
      type: 'belongs-to' | 'related' | 'extends' | 'contrasts',
      targetId: 'other-node-id',
      label: '关联描述'
    }
  ]
}
```

### 分类规则

| categoryId | 适用内容 |
|------------|----------|
| `ai-workflow` | 人机协作、工具流、自动化、认知升级 |
| `thinking` | 清晰思考、决策框架、快思考觉察 |
| `mental-models` | 书籍提炼的跨域认知框架 |
| `growth` | 方向·状态·执行，认知管理 |
| `life-philosophy` | 焦急与平静、当下体验、万物相通 |
| `sports` | 乒乓球技术（外链至 project-table-tennis，不在 Atlas 内管理节点） |
| `output` | 页面实验、工具构建（外链至其他项目） |

新节点若找不到合适 topic → 优先扩展现有 topic，其次新建 topic，最后新建 category。

### 操作流程

**新增节点**：
1. 确认 `.md` 源文件存在于 `sources/`
2. 读取 `knowledge-graph.js`，确认所属 topicId
3. 查重：搜索现有 nodes 中是否有相同 title 或相似 oneLiner
4. 按 Schema 起草节点，`oneLiner` 和 `philosophyNote` 引用用户原话
5. 将节点插入 `nodes` 数组（按 topicId 分组）
6. 更新 `meta.updatedAt` 和 `meta.totalNodes`

**更新节点**：
1. 按 `id` 查找节点
2. 只改需要改的字段，永不覆盖 `source` 和 `id`
3. 更新 `updatedAt`
4. 状态改为 `reviewed` 时，确保 `keyTakeaways` ≥ 2 条

**数据完整性检查**：
- 无重复 `id`
- 每个 `topicId` 引用已存在的 topic
- 每个 `relations[].targetId` 引用已存在的 node
- `meta.totalNodes` 等于 `nodes` 数组实际长度

---

## 阅读书架操作规范

### 数据文件

- 页面：`projects/reading-shelf/reading-roadmap.html`（入口）、`reading-study.html`（单书深读）
- 数据：`projects/reading-shelf/data/books-data.js`
- Obsidian 阅读快照：`~/Documents/codeStore/obsidian/阅读/*.md`

### Book 数据结构

```js
{
  title: '书名',
  author: '作者',
  status: '已读' | '在读' | '想读' | '放弃',
  source: '截图整理' | 'obsidian' | ...,
  notes: N,                              // 需与 detail.collisions 实际条目数一致
  detail: {
    summary: '一句话总结',
    thesis: '核心主张',
    reader: '预设读者',
    distance: '与我的距离',
    collisions: [...]
  }
}
```

字段宁可留空（填 `待补`）也不删除，保持结构一致。

### 封面获取三级回退

| 层级 | 来源 | 说明 |
|------|------|------|
| L1 | Google Books API | 按 ISBN 查询，中文版覆盖不稳定 |
| L2 | Open Library Covers API | 稳定公开 URL，中文书名覆盖不均 |
| L3 | 排版占位封面 | 本地生成，零外部依赖，兜底方案 |

高风险源（仅个人工具富集用，不作为稳定依赖）：WeRead 非官方搜索、Douban 衍生接口。

### 操作流程

1. 读取 `books-data.js`，保留现有排序和字段
2. 搜索 Obsidian vault 中的匹配快照，取 `书名`/`作者`/`状态`/`核心主张`/`预设读者`/`与我的距离` 等事实字段
3. 无快照则标记 `source` 为 `截图整理`，详情字段填 `待补`
4. 封面按三级回退处理，禁止直接热链电商封面
5. 编辑后验证页面渲染和筛选功能

---

## 书籍碰撞流程

当用户发书名 + 读后感/摘录片段时触发。**不要**在用户仅提书名、或明确说"只是记录读过"时主动碰撞。

### Step 1 — 生成快照卡

提炼三项（不多不少）：核心主张、预设读者、与你的距离。写入 `~/Documents/codeStore/obsidian/阅读/{日期}-{书名}.md`，保留用户原始感受原文。

### Step 2 — 碰撞扫描

将快照与现有洞见库对比，输出三类碰撞：
- **强共鸣**：已有洞见 + 书给了更清晰的语言/论据
- **互补**：你和书各占一半，合并后产生新认知
- **张力**：实质分歧（逻辑方向相反），不是表达风格差异

禁止把表达差异判为张力，禁止凭空捏造碰撞。

### Step 3 — 人工裁决门禁（必须停下）

呈现碰撞结果，等用户确认哪些升级为洞见卡。**不要在确认前自动生成洞见卡。**

### Step 4 — 升级洞见卡（按需）

仅对用户确认的碰撞点执行。来源字段必须同时标注书籍来源和原始洞见来源。

### Step 5 — 精准推荐（按需）

基于洞见库空白推荐，必须说明"填哪个空白"，不准基于风格相似推荐，不准一次超过 3 本。

> 全局禁止：不把书的观点直接写入洞见卡、不用书的语言覆盖用户原话、不生成书评式总结。

---

## 乒乓碰撞流程

当用户发送乒乓球训练体会/技术要点/比赛感悟时执行：

1. **记录 Obsidian**：保存到 `~/Documents/codeStore/obsidian/乒乓球/YYYY-MM-DD-乒乓球练习复盘.md`
2. **更新要点汇总**：在 `乒乓球/2026-03-22-乒乓球技术要点汇总.md` 中新增条目
3. **碰撞技术图谱**：与 `projects/project-table-tennis/index.html` 现有卡片比对
4. **补充图谱**：碰撞发现新洞察时，用现有卡片格式（card-header → details → core-text → process-content）新增卡片
5. **推送部署**：git push

> 乒乓球内容对应 Knowledge Atlas 的 `sports` 分类（外链），**不要把乒乓球节点写入 `knowledge-graph.js`**。

---

## 笔记写入规范

### 原话优先原则

严防语义漂移。笔记内容必须深度锚定用户的原始输入。

### 写入三阶段

1. **捕获**：识别指令中的原子化观察，不做整理
2. **镜像**：在草稿中重现原话，确保核心逻辑无损
3. **塑形**（仅当用户要求）：
   - `观察`：直接引用原话
   - `元数据`：自动加 Tags 和 Links
   - `思考`：可进行哲学关联，但需与原话明确区分

### 禁止事项

- 不准在用户未提供案例时自行生成「例如」「比如」
- 不准使用戏剧性 AI 语气
- 不准忽略用户的特定表达风格

---

## 笔记转页面规范

适用场景：将 Obsidian 笔记（带图片）转为作品页。

### 图片处理

- 格式：优先 `.webp`，备选高压 `.jpg`
- 宽度上限 1920px，体积 ≤ 200KB
- 存放：`assets/img/[project-name]/`
- 保留原 Markdown 中的 Alt 文本
- 大图优先生成 Base64 模糊占位
- 图片容器必须 `max-width: 100%; height: auto;`
- **严禁**直接上传原始照片（数 MB）

### Markdown → HTML

- 识别 `![alt](path)` 和 `[[img.jpg]]` 链接
- `img` 标签自动指向 `assets/img/` 下的压缩版
- 保持 Obsidian 风格视觉

---

## 文件命名

- 项目文件夹：`kebab-case`（如 `philosophy-flywheel`）
- Markdown 源文件：`YYYY-MM-DD-标题.md`（如 `2026-04-08-乔布斯传-大道至简.md`）
