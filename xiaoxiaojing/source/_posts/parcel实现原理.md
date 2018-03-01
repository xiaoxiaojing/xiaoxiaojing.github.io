---
title: parcel实现原理
date: 2018-03-01 09:57:52
tags: other
categories: Other
---

## 项目入口
### `package.json`
由`package.json`文件可知
  - 项目的文件入口：`index.js`
  - 命令行：parcel
```
{
  "main": "index.js",
  "bin": {
    "parcel": "bin/cli.js"
  }
}
```

### `bin/cli.js`
使用`commander`包来处理命令行，有以下命令
```
serve [options] [input]
watch [options] [input]
build [options] [input]
help [options] [input]
```
解析命令后，执行构建流程
```
// 初始化 (其中main对应参数[input]，command对应参数[options])
const bundler = new Bundler(main, command);

// 如果命令是serve，调用bundler.serve就启动一个本地服务器；否则调用bundler.bundle进行构建
if (command.name() === 'serve') {
  const server = await bundler.serve(command.port || 1234, command.https);
  if (command.open) {
    require('opn')(
      `${command.https ? 'https' : 'http'}://localhost:${
        server.address().port
      }`
    );
  }
} else {
  bundler.bundle();
}
```

## `Bundler.js`
The Bundler is the main entry point. It resolves and loads assets, creates the bundle tree, and manages the worker farm, cache, and file watcher.

### 构造函数：`constructor`
```
// 解析文件路径
this.mainFile = Path.resolve(main || '');
// 格式化参数
this.options = this.normalizeOptions(options);
// This Resolver implements a modified version of the node_modules resolution algorithm
this.resolver = new Resolver(this.options);
this.parser = new Parser(this.options);
this.packagers = new PackagerRegistry();
this.cache = this.options.cache ? new FSCache(this.options) : null;
this.delegate = options.delegate || {};
this.bundleLoaders = {};

// 给bundleLoaders设置默认值：wasm，css，js
this.addBundleLoader(...)
```

源码有点难度，以后再看。。。/(ㄒoㄒ)/~~

---
参考：
- [Parcel源码解读](https://github.com/blackLearning/blackLearning.github.io/blob/master/parcel%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB.md)
- [Parcel](https://en.parceljs.org/getting_started.html)
