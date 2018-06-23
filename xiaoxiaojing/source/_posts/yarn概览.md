---
title: yarn概览
date: 2017-11-15 14:03:33
tags: yarn
categories: 项目构建
---

## yarn
### yarn是什么 —— JavaScript package manager
* yarn是Facebook，Google，Exponent和Tilde开发的新的JavaScript包管理工具

### yarn解决了什么 —— 解决使用npm面对的少数问题
1. 安装的时候无法保证速度和一致性（fast/consistent）
2. 安全问题（security ），the npm client executes code from some of those dependencies automatically

## yarn vs npm
1. **yarn.lock文件** vs **npm-shrinkwrap.json**
  * 相同点：都是为了避免包版本的不一致，一个确定的安装版本被固定在这个个锁文件中，文件会在添加、更新、删除依赖时，自动更新。
  * 不同点：yarn.lock是无损的，可重现的（即两次创建结果一致）。npm-shrinkwrap.json是有损的，不可重现的（有损的原因：npm采用non-deterministic algorithms）
2. yarn是并行的执行安装任务的，npm是顺序执行的。yarn比npm快。

## yarn的使用
1. 安装
  ```
  brew install yarn //默认安装node.js
  brew install yarn --without-node
  ```
2. CLI
  ```
  yarn --version // 查看版本
  yarn init // 初始化
  yarn add [package] // 添加
  yarn upgrad [package] // 更新
  yarn remove [package] // 删除
  yarn install // install package.json中定义的全部的依赖
  yarn publish // 发布package
  ```

### yarn的workspace
1. 了解[Monorepo](https://github.com/pigcan/blog/issues/3)
> Monorepo is a unified source code repository used by an organisation to host as much of its code as possible.

  * `Monorepo`是一种管理organisation代码的方法。在这种方法下会摒弃原先一个module一个repo的方式（`Multirepos`），取而代之的是把所有的modules都放在一个repo内来管理

2. [Lerna](https://lernajs.io/)
> Lerna is a tool that optimizes the workflow around managing multi-package repositories with git and npm.

  * Lerna是基于Monorepo理念在工具端的实现。

3. use `Yarn Workspace`
  * 配置根节点的`package.json`
    ```
    {
        "private": true,
        "workspaces": [
            "packages/*"
        ]
    }
    ```
  * 在packages目录下创建项目
    ```
    // packages/workspace-a
    {
        "name": "workspace-a",
        "version": "1.0.0",
        "dependencies": {
            "cross-env": "5.0.5"
        }
    }
    // packages/workspace-b
    {
        "name": "workspace-b",
        "version": "1.0.0",
        "dependencies": {
            "cross-env": "5.0.5",
            "workspace-a": "1.0.0"  // 会使用packages下的workspace-a
        }
    }
    ```
  * 在根目录或者在工作目录下运行`yarn install`

---
* 参考链接
  - [Yarn vs npm: Everything You Need to Know](https://www.sitepoint.com/yarn-vs-npm/)
  - [Yarn: A new package manager for JavaScript](https://code.facebook.com/posts/1840075619545360/yarn-a-new-package-manager-for-javascript/)
  - [the difference between yarn.lock and npm-shrinkwrap.json](https://stackoverflow.com/questions/40057469/what-is-the-difference-between-yarn-lock-and-npm-shrinkwrap)
  - [workspaces](https://yarnpkg.com/en/docs/workspaces)
  - [workspaces in Yarn](https://yarnpkg.com/blog/2017/08/02/introducing-workspaces/)
