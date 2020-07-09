---
title: 遇到乱码问题的解决方案
date: 2017-03-29 22:25:23
tags: java
---

#### 编码的概念

- GBK编码：是指中国的中文字符，其它它包含了简体中文与繁体中文字符，另外还有一种字符“gb2312”，这种字符仅能存储简体中文字符。

- UTF-8编码：它是一种全国家通过的一种编码，如果你的网站涉及到多个国家的语言，那么建议你选择UTF-8编码。

<!--more-->

#### GBK和UTF8有什么区别？

- UTF8编码格式很强大，支持所有国家的语言，正是因为它的强大，才会导致它占用的空间大小要比GBK大，对于网站打开速度而言，也是有一定影响的。

- GBK编码格式，它的功能少，仅限于中文字符，当然它所占用的空间大小会随着它的功能而减少，打开网页的速度比较快。

#### 如何在sublime中添加对中文的支持

- 首先安装Package control工具：在Sublime Text里，按ctrl+`，打开Console，一次性输入如下代码：

```
import urllib.request,os; pf = 'Package Control.sublime-package'; ipp = sublime.installed_packages_path(); urllib.request.install_opener( urllib.request.build_opener( urllib.request.ProxyHandler()) ); open(os.path.join(ipp, pf), 'wb').write(urllib.request.urlopen( 'http://sublime.wbond.net/' + pf.replace(' ','%20')).read())
```

- 然后按ctrl shift p 打开命令行模式：输入Install Package关键字，然后点击自动出现的下拉菜单里的第一项：Package Control: Install Package(回车无效)

PS：执行上述步骤不要急，左下角会有一个等于号来回动，看着它也许你会安静点。。

- 稍等一会，会再次在命令行下弹出一个下拉菜单。输入“ConvertToUTF8”或者“GBK Encoding Support”，选择匹配项。中文字符就可以正常显示了。

#### Tips：
  
- 养成将手敲的代码存为 UTF-8 编码格式的习惯
- 遇到乱码首先尝试转 UTF-8
- 切忌一看到乱码先乱删一通，然后气急败坏地把代码文件全删了