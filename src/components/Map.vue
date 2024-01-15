<template>
  <div class="mapdiv" ref="mapdiv"></div>
</template>

<script lang="ts" setup>
import MapView from "@arcgis/core/views/MapView";
import { onMounted, ref } from "vue";
import Map from "@arcgis/core/Map";
import esriConfig from "@arcgis/core/config";

import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

import Graphic from "@arcgis/core/Graphic";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Point from "@arcgis/core/geometry/Point";

import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer";

// import Renderer from "@arcgis/core/renderers/Renderer.js";
// import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer.js";
// import PictureMarkerSymbol from "@arcgis/core/symbols/PictureMarkerSymbol.js";

const mapdiv = ref();

onMounted(() => {
  esriConfig.apiKey =
    "AAPK72621c47770b426798758730c48b8adeCpiJMaMF6zlMpNvLuvmd4H_yHgohLv9Jf0AAgDEbdZ1oVfvmLibxDgwZYfPgFIZf";

  const vtlLayer = new VectorTileLayer({
    url: "https://vectortileservices3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_Mountains_Parcels_VTL/VectorTileServer/",
  });

  const map = new Map({
    basemap: "arcgis/topographic",
    layers: [vtlLayer],
  });

  const view = new MapView({
    container: mapdiv.value,
    map: map,
    center: [-118.805, 34.027], //Longitude, latitude
    zoom: 13,
  });

  // Define a pop-up for Trailheads
  const popupPoints = {
    title: "{name}",
    content: "<b>Rating:</b> {rating}<br>",
  };

  const trailheadsRenderer = {
    type: "simple",
    symbol: {
      type: "picture-marker",
      url: "http://static.arcgis.com/images/Symbols/NPS/npsPictograph_0231b.png",
      width: "18px",
      height: "18px",
    },
  };

  const trailheadsLabels = {
    symbol: {
      type: "text",
      color: "#FFFFFF",
      haloColor: "#5E8D74",
      haloSize: "2px",
      font: {
        size: "12px",
        family: "Noto Sans",
        style: "italic",
        weight: "normal",
      },
    },

    labelPlacement: "above-center",
    labelExpressionInfo: {
      expression: "$feature.name",
    },
  };

  //Trailheads feature layer (points)
  const trailheadsLayer = new FeatureLayer({
    // url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0",
    portalItem: {
      id: "8ffdd4b9cbeb4ed8bba91d05e2b4fbbe",
    },
    outFields: ["name", "rating"],
    popupTemplate: popupPoints,
  });

  map.add(trailheadsLayer);

  const graphicsLayer = new GraphicsLayer();
  map.add(graphicsLayer);

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
  graphicsLayer.add(pointGraphic);

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
