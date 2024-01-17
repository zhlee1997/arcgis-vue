<template>
  <div class="mapdiv" ref="mapdiv"></div>
  <div class="stats-panel" @click="toggleMarkers">
    <h2>Statistics Panel</h2>
    <p>Total Features: {{ totalFeatures }}</p>
    <p>Average Value: {{ averageValue.toFixed(2) }}</p>
    <!-- Add more statistics as needed -->
  </div>
</template>

<script lang="ts" setup>
import MapView from "@arcgis/core/views/MapView";
import { onMounted, ref } from "vue";
import Map from "@arcgis/core/Map";
import esriConfig from "@arcgis/core/config";

import Graphic from "@arcgis/core/Graphic";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Point from "@arcgis/core/geometry/Point";

const mapdiv = ref();

let totalFeatures = 12;
let averageValue = 5.6675;

let layerView;

const toggleMarkers = () => {
  layerView.queryGraphics().then((results) => {
    console.log(results);

    results.items.forEach((item) => {
      console.log(item.attributes);

      if (item.attributes.alert === "alertA")
        item.visible = item.visible ? false : true;
    });
  });
};

onMounted(() => {
  esriConfig.apiKey =
    "AAPK72621c47770b426798758730c48b8adeCpiJMaMF6zlMpNvLuvmd4H_yHgohLv9Jf0AAgDEbdZ1oVfvmLibxDgwZYfPgFIZf";

  const map = new Map({
    basemap: "arcgis/topographic",
  });

  const view = new MapView({
    container: mapdiv.value,
    map: map,
    center: [110.343814, 1.557104], //Longitude, latitude
    zoom: 13,
  });

  const graphicsLayer = new GraphicsLayer();
  map.add(graphicsLayer);

  function addPointGraphics() {
    // Sample data for point locations
    const pointData1 = [
      { longitude: 110.359291, latitude: 1.553504 },
      { longitude: 110.343814, latitude: 1.554359 },
      { longitude: 110.350685, latitude: 1.544063 },
      { longitude: 110.343127, latitude: 1.568086 },
      { longitude: 110.354121, latitude: 1.563968 },
    ];

    const pointData2 = [
      { longitude: 110.334539, latitude: 1.549897 },
      { longitude: 110.364771, latitude: 1.544406 },
      { longitude: 110.351029, latitude: 1.552299 },
      { longitude: 110.362022, latitude: 1.562252 },
      { longitude: 110.336256, latitude: 1.571175 },
    ];

    const simpleMarkerSymbol1 = {
      type: "simple-marker",
      color: [255, 0, 0], // Red
      size: 10,
      outline: {
        color: [255, 255, 255],
        width: 1,
      },
    };

    const simpleMarkerSymbol2 = {
      type: "simple-marker",
      color: [255, 255, 0], // Red
      size: 10,
      outline: {
        color: [255, 255, 255],
        width: 1,
      },
    };

    // Create and add point graphics to the GraphicsLayer
    pointData1.forEach((pointCoordinates) => {
      const point = new Point(pointCoordinates);

      const graphic = new Graphic({
        geometry: point,
        symbol: simpleMarkerSymbol1,
        attributes: {
          alert: "alertA",
        },
      });

      graphicsLayer.add(graphic);
    });

    pointData2.forEach((pointCoordinates) => {
      const point = new Point(pointCoordinates);

      const graphic = new Graphic({
        geometry: point,
        symbol: simpleMarkerSymbol2,
        attributes: {
          alert: "alertB",
        },
      });

      graphicsLayer.add(graphic);
    });
  }

  addPointGraphics();

  view.whenLayerView(graphicsLayer).then((lv) => {
    layerView = lv;
  });

  view.when(() => {
    console.log("view ready");
  });
});
</script>

<style scoped>
.mapdiv {
  padding: 0;
  margin: 0;
  height: 100vh;
  position: relative;
}
.stats-panel {
  position: absolute;
  bottom: 30px;
  right: 300px;
  width: 30%;
  padding: 10px;
  box-sizing: border-box;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
