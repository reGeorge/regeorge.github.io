import re
import os

path = '/Users/regeorge/Documents/codeStore/regeorge.github.io/projects/project-table-tennis/index.html'

def update_html():
    if not os.path.exists(path):
        print(f"File not found: {path}")
        return

    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # JS 注入 (插入到 const details = { 之后)
    data_js = """        errors: {
            title: '⚠️ 逆向提醒：错题集 (芒格思维)',
            source: '来自 2026-03-22 训练反思',
            content: '<blockquote><strong>1. 对下旋处理的错题：核心是重心和引拍。</strong><br>× 常见错误：在大腿右侧下方引拍，导致容易撞网。<br>√ 逆向纠正：要把球拍引到大腿外侧斜后方，重心要下降到球的高度，这样才有空间做向上的摩擦。</blockquote><blockquote><strong>2. 对上旋/不转处理的错题：核心是压拍和借力。</strong><br>× 常见错误：看到快球就想发力抡，导致动作变形失误。<br>√ 逆向纠正：用身体框架撑住，球拍微微压住，撞击之后的一瞬间才发力磨。</blockquote><blockquote><strong>3. 步法与节奏的错题：核心是先位后手。</strong><br>× 常见错误：球到了手才动，或者手比脚快。<br>√ 逆向纠正：通过预判提前移动，脚先站稳了，手才开始引拍。</blockquote><blockquote><strong>4. 手肘与躯干的错题：核心是合力。</strong><br>× 常见错误：肘部乱晃，或者肘部贴得太死。<br>√ 逆向纠正：肘部作为支点要稳定，带动大臂和躯干一起转动合力，不是单纯靠小臂甩。</blockquote>'
        },
"""
    if 'errors:' not in content:
        content = re.sub(r'const details = \{', f"const details = {{\\n{data_js}", content)

    # 2. 注入 HTML 卡片 (插入到 <h2>时机与系统进化</h2> 之前)
    card_html = """
    <h2 id="error-section">⚠️ 逆向提醒：错题集</h2>
    <div class="methodology">
        <div class="method-card" onclick="showDetail('errors')" style="border-left: 4px solid #c0392b;">
            <div class="method-title">🧠 芒格思维：逆向训练日志</div>
            <div style="font-size: 0.9rem; color: var(--claude-sub);">
                <p><strong>反过来想，总是反过来想。</strong> 如果你要学会处理下旋，先看自己是怎么把球打下网的。记错题集是为了不重蹈覆辙。</p>
            </div>
        </div>
    </div>
"""
    if 'error-section' not in content:
        content = content.replace('<h2>时机与系统进化</h2>', card_html + '        <h2>时机与系统进化</h2>')
        print("Inserted HTML card.")

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("File saved successfully.")

if __name__ == "__main__":
    update_html()
