import * as Cesium from "cesium/Cesium.js";
import * as satellite from "../../src/index.js"; // 引入插件

// 假定Cesium已经全局定义
class SpaceCatalogDataSource extends Cesium.CustomDataSource {
  constructor(name, options) {
    super(name);
    console.dir(options);
  }

}

export default { SpaceCatalogDataSource, satellite };
