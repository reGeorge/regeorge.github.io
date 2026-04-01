# 洞见卡模板 (Insight Card Template)

本文件定义了哲学飞轮页面中每张洞见卡的完整 HTML 结构和内容约束。

---

## 📐 卡片 HTML 模板

```html
<div class="insight-card" style="border-color: var(--accent); background: rgba(217, 119, 87, 0.02);">
    <!-- 1. 标签 -->
    <div class="card-header">
        <span class="tag">{分类}：{标题}</span>
    </div>

    <!-- 2. 折叠区域 -->
    <details>
        <summary data-hint="（点击展开推导过程）">
            <span class="core-text">{核心陈述，一两句话，折叠时可见}</span>
        </summary>
        <hr class="divider">
        <div class="process-content">

            <!-- A. 核心淬炼（必填） -->
            <div class="process-section">
                <h4>核心淬炼</h4>
                <p><strong>一句话真知：</strong>{用一句话把洞察说透}</p>
                <p><strong>类比/模型：</strong>{用一个类比或模型让洞察可迁移}</p>
            </div>

            <!-- B. 身体感悟（推荐） -->
            <div class="process-section">
                <h4>身体感悟</h4>
                <div class="aha-block">
                    <p>{用自己的身体感觉描述这个洞察，而非纯逻辑。让读者"感觉"到而非"理解"到}</p>
                </div>
            </div>

            <!-- C. 对话还原（必填） -->
            <div class="process-section">
                <h4>对话还原</h4>
                <div class="dialogue-block">
                    <span class="q">问：{自问}</span><br>
                    <span class="a">{自答，推进一层思考}</span><br><br>
                    <span class="q">问：{追问}</span><br>
                    <span class="a">{再答，切入另一个角度}</span>
                </div>
            </div>

            <!-- D. 冗余过滤器（必填） -->
            <div class="process-section">
                <h4>冗余过滤器</h4>
                <div class="redundancy-section">
                    <h4>已过滤的噪音</h4>
                    <span class="noise">"{常见的陈词滥调1}"</span>
                    <span class="noise">"{常见的陈词滥调2}"</span>
                    <span class="noise">"{常见的陈词滥调3}"</span>
                    <div class="focus-lens">
                        <strong>聚焦透镜：</strong>{用一句话说明这个洞察的独特切入角度，与噪音形成对比}
                    </div>
                </div>
            </div>

            <!-- E. 最小化行动实验（必填） -->
            <div class="process-section actionable-section">
                <h4>最小化行动实验</h4>
                <div class="action-item">
                    <div class="checkbox"></div>
                    <span><span class="action-label">今天的最小实验：</span>{一件今天就能做的事，验证这个洞察}</span>
                </div>
                <div class="action-item">
                    <div class="checkbox"></div>
                    <span><span class="action-label">{可选标签}：</span>{第二个行动项}</span>
                </div>
            </div>

            <!-- F. 可迁移场景（必填） -->
            <div class="process-section migration-section">
                <h4>可迁移场景</h4>
                <div class="migration-item">{场景1：跨领域的具体应用}</div>
                <div class="migration-item">{场景2}</div>
                <div class="migration-item">{场景3}</div>
            </div>

        </div>
    </details>

    <!-- 3. 哲学笔记（必填，始终可见） -->
    <div class="philosophy-note">
        <strong>{模型名称}</strong>：{一句话总结}
    </div>

    <!-- 4. 来源链接（推荐） -->
    <div class="source-link">
        来源：<a href="sources/{日期}-{标题}.md">[{来源类型}/{日期}-{标题}.md]</a>
    </div>
</div>
```

---

## 🏷️ 标签分类体系

| 前缀 | 含义 | 示例 |
|------|------|------|
| `核心定义：` | 基础概念的定义 | 核心定义：万物相通 |
| `观察：` | 对具体现象的记录 | 观察：小满洗冷水澡 |
| `认知：` | 认知层面的突破 | 认知：知识管理的觉醒 |
| `哲学洞见：` | 哲学层面的洞察 | 哲学洞见：焦急=宇宙相变 |
| `工作洞见：` | 工作相关的洞察 | 工作洞见：测试=自我审计 |

---

## ✅ 字段约束

| 字段 | 必填 | 说明 |
|------|------|------|
| 标签 | 是 | 必须从分类体系中选取 |
| 核心陈述 | 是 | 一两句话，折叠时可见 |
| 核心淬炼 | 是 | 一句话真知 + 类比/模型 |
| 身体感悟 | 推荐 | 用身体感觉描述，不是纯逻辑 |
| 对话还原 | 是 | 至少 2 组 Q&A |
| 冗余过滤器 | 是 | 至少 3 个噪音 + 聚焦透镜 |
| 最小化行动实验 | 是 | 至少 1 个，可操作 |
| 可迁移场景 | 是 | 至少 2 个跨领域场景 |
| 哲学笔记 | 是 | 模型名称 + 一句话总结 |
| 来源链接 | 推荐 | 指向 sources/ 下的 md 文件 |

---

## 🚫 负面约束

1. **不准**凭空捏造洞察内容，必须有用户原话或笔记作为来源
2. **不准**使用 AI 风格的修辞（"在这个瞬息万变的世界里..."）
3. **不准**在冗余过滤器中使用真实洞察作为噪音（噪音必须是陈词滥调）
4. **不准**最小化行动实验写成宏大的计划（必须今天就能做）
5. **不准**可迁移场景写成空泛的建议（必须具体、跨领域）

---

## 📂 插入位置

新卡片插入到 `philosophy-flywheel/index.html` 中最后一个 `</div>`（insight-card 的闭合标签）与 `<!-- ==================== 待填充 ==================== -->` 之间。

## 📂 来源文件

对应的原始洞察笔记存放在 `philosophy-flywheel/sources/{日期}-{标题}.md`。
