# SKILL: Obsidian 笔记转作品集工作流 (Obsidian Note-to-Portfolio Workflow)

**适用场景**：将 Obsidian 仓库中的笔记（带图片）转换为 `regeorge.github.io` 仓库中的可视化交互作品。
**核心价值**：自动化处理过程中的图片压缩、路径转换与导航同步。

---

## 🛠️ 核心操作规范 (SOP)

### 1. 内容迁移与解析 (Source Processing)
-   **提取逻辑**：从 Obsidian 目录提取 `[Title].md`，识别其中的 Markdown 图片链接 `![alt](path/to/img)` 或 Obsidian 语法 `[[img.jpg]]`。
-   **关联性**：确保迁移后的图片能够与文章建立逻辑关联。

### 2. 自动化资产压缩 (Auto-Compression)
-   **原则**：原始照片通常在数 MB 以上，严禁直接上传至 GitHub Pages。
-   **处理目标**：
    -   **格式转换**：优先转换为 `.webp` 或高压 `.jpg`。
    -   **尺寸限制**：宽度最大宽度设为 `1920px`。
    -   **体积控制**：单张图片控制在 `200KB` 以内。
-   **存放位置**：统一维护在 `regeorge.github.io/assets/img/[project-name]/`。

### 3. 作品转换模版 (HTML Generation)
-   **结构转换**：将 Markdown 转换为带 Claude/Obsidian 风格的 HTML 入口。
-   **路径动态化**：将 HTML 中的 `img` 标签自动指向 `assets/img/` 下的压缩版。

### 4. 自动化脚本调用 (Command Runner)
-   建议封装为 `publish-note.py` 脚本，执行以下逻辑：
    1.  读取 `obsidian/` 路径下的指定 MD。
    2.  利用 Python 库 (如 `Pillow`) 批量处理图片并输出至 `assets/`。
    3.  生成 HTML 文件夹并更新 `regeorge.github.io/index.html` 的导航项。

---

## 🎨 视觉语言强制要求

-   **Alt 文本**：所有压缩后的图片必须保留 Markdown 中的 Alt 描述以增强 SEO。
-   **占位符**：对于大图，优先生成一个小尺寸的 Base64 模糊占位符。
-   **响应式**：图片容器必须支持 `max-width: 100%; height: auto;`。

---

## 📂 目录结构约束

```text
regeorge.github.io/
├── assets/
│   └── img/
│       └── [project-name]/  <-- 所有该文章的压缩图存放在此
├── [project-name]/
│   └── index.html           <-- 作品展示页
```
