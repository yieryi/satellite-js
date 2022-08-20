# cesium-plugin-x-sample

用于构建Cesium扩展的各类插件、组件和相关示例模板

## Building and running on localhost

First install dependencies:

```sh
npm install
```

To create a production build:

```sh
npm run build-prod
```

To create a development build:

```sh
npm run build-dev
```

 启动 start

```sh
npm run start
```



代码配置：

在`plugin.js`文件可以直接`import * as Cesium from "cesium/Cesium.js";`在`webpack`配置中在`externals`节点配置`cesium`避免将`Cesium.js`有关代码打包进去插件。

以插件命名为`CesiumXPlugin`,在`webpack`配置`entry`节点，优先配置该插件为库，其他示例中直接使用该插件即可.其中main.js为示例示例程序入口

```json
{
  "entry": {
    "CesiumXPlugin": {
      "import": "./src/plugin.js",
      "library": {
        "name": "CesiumXPlugin",
        "type": "umd",
        "export": "default"
      }
    },
    "main": {
      "import": "./src/main.js"
    }
  }
}
```

在`main.js`示例程序运行文件中,直接调用`CesiumXPlugin.SpaceCatalogDataSource`即可

或者在`main.js`中添加`import CesiumXPlugin from "./plugin.js"; `以从ES6源码环境直接加载调试。编译后则从生成打包后的`CesiumXPlugin.js`加载

## Running

```sh
node dist/bundle.js
```

## Credits

Made with [createapp.dev](https://createapp.dev/)

参考： https://webpack.docschina.org/configuration/

// 输出库参考 https://webpack.docschina.org/configuration/output/#outputlibrary