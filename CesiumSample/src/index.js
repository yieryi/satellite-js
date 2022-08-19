// require( "./styles.css");
import "./styles.css";
import "cesium/Widgets/widgets.css";
// require('cesium/Widgets/widgets.css');

import * as Cesium from "cesium/Cesium.js";

Cesium.Ion.defaultAccessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3MzAxMTQwMC1jYzMzLTQyYjMtOWIwYi03OTlkODMxMWY3OTMiLCJpZCI6NDg3OCwiaWF0IjoxNjU3NzA0MjcxfQ.Z5zUcdtKlHIeKKvqrpL4qQn2bu2pveOAdeS_oyFa3yY`;
Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
  53.560705,
  3.40787,
  135.094757,
  73.502655
);

console.log("hello world!");

const clock = new Cesium.Clock({
  startTime: Cesium.JulianDate.fromIso8601("2017-07-11T00:00:00Z"),
  stopTime: Cesium.JulianDate.fromIso8601("2017-07-11T24:00:00Z"),
  currentTime: Cesium.JulianDate.fromIso8601("2017-07-11T10:00:00Z"),
  clockRange: Cesium.ClockRange.LOOP_STOP,
  clockStep: Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER,
  multiplier: 1000,
  shouldAnimate: true,
});
const viewer = new Cesium.Viewer("cesiumContainer", {
  clockViewModel: new Cesium.ClockViewModel(clock),
  terrainProvider: new Cesium.EllipsoidTerrainProvider(),
  imageryProvider: new Cesium.TileMapServiceImageryProvider({
    url: Cesium.buildModuleUrl("Assets/Textures/NaturalEarthII"),
  }),
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
  const icrfToFixed = Cesium.Transforms.computeIcrfToFixedMatrix(time);
  if (Cesium.defined(icrfToFixed)) {
    const camera = scene.camera;
    const offset = Cesium.Cartesian3.clone(camera.position),
      transform = Cesium.Matrix4.fromRotationTranslation(icrfToFixed);
    camera.lookAtTransform(transform, offset);
  }
});
const onceTilesLoaded = scene.postRender.addEventListener(function () {
  if (scene.globe.tilesLoaded) {
    onceTilesLoaded();
  }
});
