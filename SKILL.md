# SKILL: 极简 GitHub Pages 交互内容管理 (Minimalist Static Content Management)

**适用场景**：已按照“三步工作法”改造后的 regeorge.github.io 仓库。
**核心理念**：零构建步骤（No Build Process）、文件夹即路由（Folder as URL）、即推即连（Push to Publish）。

---

## 🛠️ 操作流程 (Workflow)

### 1. 挂载新的交互作品
当你使用 Claude/Gemini 生成了一个新的 HTML 交互页（如：一个 UI 组件、一个小游戏或酷炫的动效）：

1.  **新建文件夹**：在仓库根目录创建一个语义化的文件夹（如 `project-xiaomi-ui`）。
2.  **存入文件**：将生成的交互代码保存为该文件夹下的 `index.html`。
3.  **处理资源**：如果该交互页有配套的图片或 JS 文件，也一并丢入该文件夹，并使用相对路径引用。

### 2. 更新主入口 (index.html)
为了让别人看到这个新作品，你需要将其添加到主页的列表中。

1.  打开根目录的 [index.html](index.html)。
2.  在 `<section class="project-list">` 内添加一个新的 `<div class="project-item">` 区块。
3.  **代码模板**：
    ```html
    <div class="project-item">
        <a href="/文件夹名/">项目标题</a>
        <p class="project-description">一句简短的描述，概括这个交互的核心价值。</p>
        <div class="project-meta">
            <span>202X.MM.DD</span>
        </div>
    </div>
    ```

### 3. 推送上线
直接执行 Git 命令完成发布：
```bash
git add .
git commit -m "Add new interactive project: xxx"
git push
```

---

## 🎨 视觉语言维护 (Claude Style)

为了保持站点呈现出一致的 **Claude 风格**：

-   **配色**：主页背景颜色 `var(--claude-beige)` (#F9F8F6) 应保持一致。
-   **简洁**：不要为每个项目添加复杂的封面图，通过高质量的标题和描述来传达内容。
-   **链接**：所有内部链接（如跳转回主页）优先使用绝对路径 `/`。

---

## 📂 遗产文件管理 (Legacy Maintenance)

-   **旧文章**：如果需要引用以前的 Hexo 文章，它们现在位于 `/backup/posts/`。
-   **简历更新**：直接编辑 [backup/cv/resume.html](backup/cv/resume.html) 即可，由于它已经是静态 HTML，主页上的链接会自动指向最新版本。
