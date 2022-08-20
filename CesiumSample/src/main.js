// package.json部分不能指定 type:"module",或者type:"commonjs",因为webpack脚本用的commonjs,此处脚本引入使用的import
import "./styles.css";
import "cesium/Widgets/widgets.css";
// import * as Cesium from "cesium/Cesium.js";

window.Cesium=Cesium;
//import CesiumXPlugin from "./plugin.js"; // 从ES6源码环境直接加载调试，注释掉则从生成打包后的CesiumXPlugin.js加载

Cesium.Ion.defaultAccessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3MzAxMTQwMC1jYzMzLTQyYjMtOWIwYi03OTlkODMxMWY3OTMiLCJpZCI6NDg3OCwiaWF0IjoxNjU3NzA0MjcxfQ.Z5zUcdtKlHIeKKvqrpL4qQn2bu2pveOAdeS_oyFa3yY`;
Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
  53.560705,
  3.40787,
  135.094757,
  73.502655
);

console.log("hello world!");

const clock = new Cesium.Clock({
  startTime: Cesium.JulianDate.fromIso8601("2022-07-11T00:00:00Z"),
  stopTime: Cesium.JulianDate.fromIso8601("2022-07-11T24:00:00Z"),
  currentTime: Cesium.JulianDate.fromIso8601("2022-07-11T10:00:00Z"),
  clockRange: Cesium.ClockRange.LOOP_STOP,
  clockStep: Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER,
  multiplier: 1500,
  shouldAnimate: true,
});
const viewer = new Cesium.Viewer("cesiumContainer", {
  clockViewModel: new Cesium.ClockViewModel(clock),
  terrainProvider: new Cesium.EllipsoidTerrainProvider(),
  imageryProvider: new Cesium.TileMapServiceImageryProvider({
    url: Cesium.buildModuleUrl("Assets/Textures/NaturalEarthII"),
  }),
  clockStep: Cesium.ClockRange.LOOP_STOP,
  useDefaultRenderLoop: true,
  targetFrameRate: 60,
  showRenderLoopErrors: true,

  requestRenderMode: true,
});
window.viewer = viewer;
const nightLightImageryLayer = viewer.imageryLayers.addImageryProvider(
  new Cesium.IonImageryProvider({ assetId: 3812 })
);
nightLightImageryLayer.dayAlpha = 0;
const scene = viewer.scene;
scene.backgroundColor = Cesium.Color.fromCssColorString("#0E1422");
scene.globe.enableLighting = true;
scene.globe.nightFadeOutDistance = 1e8;

scene.postUpdate.addEventListener(function (scene, time) {
  // 相机坐标为地心地固坐标系Earth-Centered,Earth-Fixed,时间变化，相机与地球相对位置不变,恒星系变化（星空旋转) Cesium.ReferenceFrame.INERTIAL
  const icrfToFixed = Cesium.Transforms.computeIcrfToFixedMatrix(time);
  if (Cesium.defined(icrfToFixed)) {
    const camera = scene.camera;
    const offset = Cesium.Cartesian3.clone(camera.position),
      transform = Cesium.Matrix4.fromRotationTranslation(icrfToFixed);
    //  地心惯性坐标系 Earth-centered inertial (ECI) coordinates 恒星系.相机与恒星位置保持不变，地球旋转  Cesium.ReferenceFrame.FIXED
    camera.lookAtTransform(transform, offset);
  }
});
const onceTilesLoaded = scene.postRender.addEventListener(function () {
  if (scene.globe.tilesLoaded) {
    onceTilesLoaded();
  }
});


const spaceCatalogDataSource=new CesiumXPlugin.SpaceCatalogDataSource("TLE卫星轨道数据",{
  temeToECEF: true,
  default: {
    path: {
      material: Cesium.Color.WHITE,
      width: 1.25,
      leadTime: 5e3,
      trailTime: 5e3,
      resolution: 120,
      show: !1,
    },
    point: {
      position: new Cesium.Cartesian3(0, 0, 0),
      color: Cesium.Color.WHITE,
      outlineColor: Cesium.Color.BLACK.withAlpha(0.3),
      outlineWidth: 1,
      pixelSize: 4,
      scaleByDistance: new Cesium.NearFarScalar(1, 1.4, 5e7, 0.4),
      translucencyByDistance: new Cesium.NearFarScalar(1, 1, 5e7, 0.78),
    },
  },
})