# regeorge.github.io — 项目指引

## 概述

个人作品集 & 知识展示站，基于 GitHub Pages 部署。纯静态 HTML + CSS + JS，无构建工具。

> **协作者**：本仓库由 Re（仓库主）和「龙虾」共同使用。规则对两人一视同仁，不做身份区分。

## 对话契约（最高优先级，先于一切技术规范）

### 起手三动作（任何"写笔记 / 发卡片"指令都必须做）
1. **grep 查重**：先在对应笔记库搜关键词，确认没有重复条目
2. **quote 原话**：用 `> ` 引用块把用户原话贴出来
3. **等确认**：等用户点头才动笔，不要先写完再问

### 用词锁定
- 用户说「焦急」就**不要**改成「焦虑」「焦灼」「急躁」
- 用户的短句**不要**合并成长段，节奏即风格
- 用户没分点就**不要**替他分点

### 导师式对话
- 宁可追问 3 次锁定原意，也不要自行补全
- 不确定时直接问：「你说的 X 是指 A 还是 B？」
- 用户说不清楚时，可以引导但不能替他下结论

### Stop-and-ask 触发器（必须停下问，不准继续）
- 找不到对应的原始 `.md` 来源
- （其他场景默认可继续，但要在结尾汇报改了什么）

### AI 腔禁用清单
禁止以下句式 / 词汇出现在写给用户的笔记和卡片正文中：
- 「在这个瞬息万变的世界里」「让我们一起」「值得我们深思」
- 「不仅…而且…」「无论…还是…」这类对仗排比
- 自行生成的「例如」「比如」「想象一下」（除非用户明确给了案例）
- 任何形式的虚构案例、虚构数据、虚构对话

### 批量改动边界
- 单次修改 ≥3 个文件前，先列 diff 计划等用户点头
- 不要顺手"优化"用户没要求改的样式、命名、结构

## 架构

```
index.html                        ← 站点主页 / 导航入口
projects/
  [project-name]/
    index.html                    ← 各项目独立页面
    sources/                      ← Markdown 源文件（可选）
    data/                         ← 数据文件（可选）
assets/img/[project-name]/        ← 压缩后的图片资源
resume/index.html                 ← 简历页
update_ui.py                      ← 一次性内容注入脚本
```

## 部署

- 推送 `master` → GitHub Actions 自动部署到 `gh-pages` 分支
- 配置文件：`.github/workflows/deploy.yml`
- 本地预览：直接打开 HTML 或用 `python -m http.server` 启动静态服务

## 核心规范

### 内容锚定（最高优先级）

所有展示内容必须有明确来源（`.md` 文件或用户原话），**禁止 AI 自行虚构案例或填充内容**。
详见 `.github/instructions/flywheel-protocol.instructions.md`。

### 图片处理

- 格式：优先 `.webp`，备选高压 `.jpg`
- 宽度上限 1920px，体积 ≤ 200KB
- 存放路径：`assets/img/[project-name]/`
- 必须保留 alt 文本，容器使用 `max-width: 100%; height: auto;`

### 笔记写入

AI 代写/润色笔记时必须遵循"原话优先"原则，禁止语义漂移。
详见 `.github/instructions/obsidian-writing.instructions.md`。

## 文件命名

- 项目文件夹：`kebab-case`（如 `philosophy-flywheel`）
- Markdown 源文件：`YYYY-MM-DD-标题.md`（如 `2026-04-08-乔布斯传-大道至简.md`）

## 详细工作流指引

以下文件提供具体场景的操作规范：
- `.github/instructions/note-to-ui.instructions.md` — Obsidian 笔记转作品页流程
- `.github/instructions/obsidian-writing.instructions.md` — 笔记写入规范
- `.github/instructions/flywheel-protocol.instructions.md` — Knowledge Atlas 节点发布规范
- `.github/skills/knowledge-atlas-update/SKILL.md` — Knowledge Atlas 增量节点写入工作流
- `.github/skills/reading-shelf-update/SKILL.md` — 阅读书架更新工作流

> **规则唯一入口**：所有规范统一维护在 `.github/` 目录下。`.rules/` 目录已废弃，`.codebuddy/memorys/` 仅供 CodeBuddy 工具使用，不与此处重复定义规则。
