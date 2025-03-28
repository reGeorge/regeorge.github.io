---
title: git常用命令
date: 2017-01-14 01:21:22
tags: git
---

#### 创建本地仓库

`git init`
.git所在文件夹便是git对应的一个本地仓库

<!--more-->

#### 创建本地分支
    git branch master

#### 查看本地分支
    git branch

#### 设置远程仓库地址
	git remote add github git@github.com:regeorge/blog.git

#### 查看已配置的远程仓库
    git remote

#### 从远程仓库更新到本地分支
	git pull github master

#### 在未加入缓存区时回滚
    git checkout -- .

#### 将本文件夹内所有改动加入缓存区
	git add .

#### 在加入缓存区时回滚
    git reset HEAD

#### 将暂存区的改动提交到本地仓库
	git commit -m "add all files"

#### 在提交仓库后回滚
    git log #查看提交记录（带有唯一标识commitid）
    git revert %commitid%

#### 将本地分支推送到远程仓库
	git push github master

#### .gitignore文件中写入不需要同步的文件夹路径

#### hexo deploy 命令
在使用hexo搭建博客时，blog目录下有一个.git文件夹，而.deploy_git文件夹内的.git文件夹又对应了另一个仓库,hexo d命令正是将此目录下的仓库推送到远程仓库从而实现更新博客的

#### FAQ

- Q1：在github上创建仓库，在本地新建仓库并push产生冲突
	

- A1：先pull后push
		git push -u origin master -f

参考：http://wuchong.me/blog/2014/01/17/use-github-to-manage-hexo-source/
	  http://blog.csdn.net/shiren1118/article/details/7761203

#### 查看提交历史
    git log

#### 查看简洁的提交历史
    git log --oneline

#### 查看文件的修改历史
    git blame <file>

#### 查看工作目录状态
    git status

#### 比较工作目录和暂存区的差异
    git diff

#### 比较暂存区和最后一次提交的差异
    git diff --cached

#### 创建并切换到新分支
    git checkout -b <branch_name>

#### 合并分支
    git merge <branch_name>

#### 删除本地分支
    git branch -d <branch_name>

#### 删除远程分支
    git push origin --delete <branch_name>

#### 暂存当前更改以便切换分支
    git stash

#### 恢复暂存的更改
    git stash pop

#### 查看所有暂存的更改
    git stash list

#### 清除所有暂存的更改
    git stash clear