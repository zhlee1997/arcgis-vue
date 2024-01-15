<template>
  <div class="mapdiv" ref="mapdiv"></div>
</template>

<script lang="ts" setup>
import MapView from "@arcgis/core/views/MapView";
import { onMounted, ref } from "vue";
import WebMap from "@arcgis/core/WebMap";
import esriConfig from "@arcgis/core/config";

import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

import Graphic from "@arcgis/core/Graphic";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Point from "@arcgis/core/geometry/Point";

import ScaleBar from "@arcgis/core/widgets/ScaleBar";
import Legend from "@arcgis/core/widgets/Legend";

const mapdiv = ref();

onMounted(() => {
  esriConfig.apiKey =
    "AAPKcf332ae954ed41ea901d68daa179cb5538NZdMqVXnlzctrUZ7FaXZr9TwNk6-9DPgsmoShPq8unPMgIe0kJVc_5NMO9snmd";

  const webmap = new WebMap({
    portalItem: {
      id: "41281c51f9de45edaf1c8ed44bb10e30",
    },
  });

  const view = new MapView({
    container: mapdiv.value,
    map: webmap,
  });

  const scalebar = new ScaleBar({
    view: view,
  });
  view.ui.add(scalebar, "bottom-left");

  const legend = new Legend({
    view: view,
  });
  view.ui.add(legend, "top-right");

  //Trailheads feature layer (points)
  const trailheadsLayer = new FeatureLayer({
    url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0",
  });

  // map.add(trailheadsLayer);

  // const graphicsLayer = new GraphicsLayer();
  // map.add(graphicsLayer);

  const point = new Point({
    //Create a point
    longitude: -118.80657463861,
    latitude: 34.0005930608889,
  });
  const simpleMarkerSymbol = {
    type: "simple-marker",
    color: [226, 119, 40], // Orange
    outline: {
      color: [255, 255, 255], // White
      width: 1,
    },
  };

  const pointGraphic = new Graphic({
    geometry: point,
    symbol: simpleMarkerSymbol,
  });
  // graphicsLayer.add(pointGraphic);

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
}
</style>
