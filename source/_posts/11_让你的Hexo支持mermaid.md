---
title: 让你的hexo支持mermaid
date: 2019-05-26 16:56:24
tags: hexo
---

#### mermaid配置方法
1. npm安装插件
2. blog根目录config文件中添加配置
3. 主题文件中添加过滤标签
4. 补充：blog根目录中package.json文件中添加依赖（参考文章中没有提到）

<!--more-->

参考文章：

    https://www.liuyude.com/How_to_make_your_HEXO_blog_support_handwriting_flowchart.html
    https://github.com/webappdevelp/hexo-filter-mermaid-diagrams

####  hexo绘制脑图

参考文章：

    https://qsli.github.io/2017/01/01/markdown-mindmap/
    https://github.com/HunterXuan/hexo-simple-mindmap


#### 配置完成后，使用mermaid语法

##### 流程图

```mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
```

##### 时序图

```mermaid
sequenceDiagram
    participant Alice
    participant Bob
    Alice->John: Hello John, how are you?
    loop Healthcheck
        John->John: Fight against hypochondria
    end
    Note right of John: Rational thoughts <br/>prevail...
    John-->Alice: Great!
    John->Bob: How about you?
    Bob-->John: Jolly good!
```

##### 甘特图

```mermaid
gantt
        dateFormat  YYYY-MM-DD
        title Adding GANTT diagram functionality to mermaid
        section A section
        Completed task            :done,    des1, 2014-01-06,2014-01-08
        Active task               :active,  des2, 2014-01-09, 3d
        Future task               :         des3, after des2, 5d
        Future task2               :         des4, after des3, 5d
        section Critical tasks
        Completed task in the critical line :crit, done, 2014-01-06,24h
        Implement parser and jison          :crit, done, after des1, 2d
        Create tests for parser             :crit, active, 3d
        Future task in critical line        :crit, 5d
        Create tests for renderer           :2d
        Add to mermaid                      :1d
```

##### 脑图
{% pullquote mindmap mindmap-md %}
- [在 Hexo 中使用思维导图](https://hunterx.xyz/use-mindmap-in-hexo.html)
  - 前言
  - 操作指南
    - 准备需要的文件
    - 为主题添加 CSS/JS 文件
  - 使用方法
{% endpullquote %}