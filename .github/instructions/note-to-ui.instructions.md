---
description: "Use when converting Obsidian notes to portfolio HTML pages, processing images for GitHub Pages, or creating new project pages. Covers image compression, path conversion, and navigation sync."
applyTo: "projects/**/index.html"
---

# Obsidian 笔记转作品集工作流

**适用场景**：将 Obsidian 仓库中的笔记（带图片）转换为可视化交互作品页。

## 核心操作规范

### 1. 内容迁移与解析
- 从 Obsidian 目录提取 `.md`，识别 `![alt](path)` 或 `[[img.jpg]]` 图片链接
- 确保迁移后的图片与文章建立逻辑关联

### 2. 图片压缩
- **严禁**直接上传原始照片（通常数 MB）
- 格式：优先 `.webp`，备选高压 `.jpg`
- 宽度上限 `1920px`，体积 ≤ `200KB`
- 存放：`assets/img/[project-name]/`

### 3. HTML 生成
- 将 Markdown 转换为带 Obsidian 风格的 HTML
- `img` 标签自动指向 `assets/img/` 下的压缩版

### 4. 脚本调用
建议封装为 `publish-note.py`：
1. 读取指定 MD 文件
2. 用 Pillow 批量处理图片并输出至 `assets/`
3. 生成 HTML 并更新 `index.html` 导航项

## 视觉语言要求

- **Alt 文本**：必须保留 Markdown 中的 Alt 描述
- **占位符**：大图优先生成 Base64 模糊占位
- **响应式**：图片容器必须 `max-width: 100%; height: auto;`

## 目录结构

```
assets/img/[project-name]/   ← 压缩图
projects/[project-name]/
  index.html                 ← 作品展示页
  data/                      ← 数据层 JS（如 knowledge-graph.js）
  sources/                   ← 原始 Markdown 源文件
```

> **Knowledge Atlas 例外**：`projects/philosophy-flywheel/` 使用 `data/knowledge-graph.js` 作为唯一内容数据源，增量内容写入该文件而非直接修改 `index.html`。详见 `.github/skills/knowledge-atlas-update/SKILL.md`。
