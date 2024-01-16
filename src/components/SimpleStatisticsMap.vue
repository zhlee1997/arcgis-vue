<template>
  <div class="mapdiv" ref="mapdiv"></div>
  <div class="stats-panel">
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

import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

const mapdiv = ref();

let totalFeatures = 12;
let averageValue = 5.6675;

onMounted(() => {
  esriConfig.apiKey =
    "AAPK72621c47770b426798758730c48b8adeCpiJMaMF6zlMpNvLuvmd4H_yHgohLv9Jf0AAgDEbdZ1oVfvmLibxDgwZYfPgFIZf";

  const map = new Map({
    basemap: "arcgis/topographic",
  });

  const view = new MapView({
    container: mapdiv.value,
    map: map,
    center: [-118.805, 34.027], //Longitude, latitude
    zoom: 13,
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
