---
description: "Use when publishing content to the philosophy flywheel page, creating flywheel cards, managing tag/filter interactions, or any data-driven content that requires source anchoring. Covers dual-anchor constraint and tag rules."
applyTo: "projects/philosophy-flywheel/**"
---

# 数据飞轮发布规范

## 强限制：双重锚定
任何记录在飞轮页面的条目必须同时满足：
1. **来源锚定**：提供明确的来源文件链接（如 `灵感/xxx.md`）或对话历史锚点
2. **原话锚定**：引用用户原话片段，只能对原意升华，不得偏离或捏造

### Stop-and-ask 硬触发
**找不到原始 `.md` 来源时，必须停下询问，不允许继续生成卡片。** 标准回复模板：
> 我没在 `dailyNote/` 和 `projects/philosophy-flywheel/sources/` 下检索到关于「XXX」的原始记录。
> 请提供：(a) 原话片段、(b) 笔记路径、或 (c) 明确指示"按你理解先起草，标注 Draft"。

### 用词锁定
卡片正文引用用户原话部分，**一字不改**。结构化的「关联」段落可以用书面语，但不能替换用户使用过的关键词。

## 阶段锁定
前端开发处于观察期。完成 Obsidian 库批量迁移和内容深度润色前，不允许非必要的 UI 开发。

## 发布流程

1. **检索**：在工作区中定位原始素材
2. **提取**：摘录原话（Quote），记录原始路径（Path）
3. **构造**：
   - `观察`：直接引用的用户原话
   - `关联`：基于原文的逻辑推演或哲学范式映射
   - `来源`：指向具体的本地文件路径

## 标签规则

### 书籍碰撞卡
- 书籍来源用 `book-badge` 显示在卡片头部
- `book-badge` 即筛选入口，**不要**在正文前再注入同名标签
- 多书碰撞卡可并列多个 `book-badge`

### 灵感 / 原生洞见卡
- 头部保留一个主题标签，视觉风格与书籍标签一致
- 必须支持筛选

### 筛选交互
- 所有标签点击后触发统一筛选
- 再次点击取消筛选，恢复 `all`
- 筛选状态文案明确显示命中卡片数

### 避免重复
- 同一语义标签在同一卡片中只展示一次
- 头部已有标签时，不要额外生成重复 chip

## 禁止事项
- **不准** 在无对应 `.md` 或对话记录时自行联想细节
- **不准** 用虚构案例填充交互卡片
- **不准** 忽略用户「贴近原话」的要求
