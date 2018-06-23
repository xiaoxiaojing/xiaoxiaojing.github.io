---
title: 使用Hexo + Github Pages 搭建Blog
date: 2017-09-14 22:13:37
tags: hexo
categories: 其他
---

## 快速搭建
### Github Pages的配置
* 参考链接:
    - [Websites for you and your projects](https://pages.github.com/)
* 创建步骤
    1. 创建仓库(Create a repository)，仓库命名必须是`username.github.io`
    2. 克隆仓库到本地(Clone the repository)：`git clone [仓库地址]`
    3. 添加一个测试文件 `index.html`, 访问 `https://username.github.io` 就可以看到网站

### 将Hexo部署到Github
1. 在有node和git环境的情况下，安装Hexo
```
npm install -g hexo-cli
```
2. 初始化Hexo
```
cd username.github.io //进入本地目录
git checkout -b hexo //创建一个名为hexo的分支
//以下操作都是在hexo分支下进行的
hexo init <folder> //folder可以任意命名，用于存放Hexo的相关目录
cd <folder>
npm install
npm install hexo-deployer-git --save //用于推送生成的文章到github仓库的
```
3. 部署Hexo
    * 需要配置`_config.yml`文件
    ```
    // 配置deploy
    deploy:
        type: git
        repo: <repository url> //就是仓库地址
        branch: master //一定要设置为master
    ```
4. blog生成与发布
```
hexo g -d //生成并发布
```
5. 再次打开访问 `https://username.github.io`。就可以看到一个blog了
6. 保存分支hexo
```
git add .
git commit -am "some message"
git push origin hexo
```
7. 再次编辑或者新增文章后，只需要重复4，6步就可以了

## 原理
1. 访问`https://username.github.io`，会自动读取仓库`username.github.io`的`master`分支下的`index.html`文件
    * 仓库名为`username.github.io`的仓库, 在`setting>options>Github Pages>Source`这个配置项是不可以更改的，只能为`master`([参考链接](https://help.github.com/articles/configuring-a-publishing-source-for-github-pages/))。这就是为什么配置`_config.yml`时，branch只能为master
2. Hexo会把你写的Markdown文件编译成html文件。
    * 开发目录如下：
        ```
        - _config.html
        - package.json
        + scaffolds
        - source
            + _posts //所有的文章放在这里
        + themes
        ```
    * 编译后的文件目录如下：
        ```
        ...
        + css
        + js
        - index.html
        ```
3. 执行`hexo g -d`命令会将编译后的文件push到master分支下，这样访问`https://username.github.io`时，就是一个通过Hexo生成的blog页面了

## 代码分支hexo
1. 为什么要创建分支hexo?
    * 因为使用`hexo g -d`只会把编译后的文件push到master分支下。如果你有多台电脑，你不能在其他电脑上编辑文章。所以创建一个分支用来保存开发文件。
2. [参考链接](https://www.zhihu.com/question/21193762)

### hexo分支下的文件操作
1. 添加文章
    ```
    hexo new [layout] <title>
    ```
2. 更新修改到远程仓库的hexo分支
    ```
    git add .
    git commit -am "提交信息"
    git push origin hexo
    ```
- - -
* 参考链接：
    - [创建Github Pages](https://pages.github.com/)
    - [hexo 官网](https://hexo.io/)
    - [备份hexo开发文件](https://www.zhihu.com/question/21193762)
