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

const mapdiv = ref();

function getRandomLatitude() {
  // Define the latitude range for Sarawak
  const minLatitude = 0.853;
  const maxLatitude = 4.263;

  // Generate a random latitude within the range
  const randomLatitude =
    Math.random() * (maxLatitude - minLatitude) + minLatitude;

  // Return the random latitude
  return randomLatitude;
}

function getRandomLongitude() {
  // Define the latitude range for Sarawak
  const minLatitude = 109.663;
  const maxLatitude = 115.385;

  // Generate a random latitude within the range
  const randomLatitude =
    Math.random() * (maxLatitude - minLatitude) + minLatitude;

  // Return the random latitude
  return randomLatitude;
}

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

  // Define a pop-up for Trailheads
  const popupPoints = {
    title: "{name}",
    content: "<b>Rating:</b> {rating}<br>",
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
    color: [255, 0, 0], // Red
    outline: {
      color: [255, 255, 255], // White
      width: 1,
    },
  };

  const template = {
    title: "Alert Information",
    content: "<p>Alert Content</p>",
  };

  const pointGraphic = new Graphic({
    geometry: point,
    symbol: simpleMarkerSymbol,
    popupTemplate: template,
  });
  graphicsLayer.add(pointGraphic);

  setInterval(() => {
    const point = new Point({
      //Create a point
      longitude: getRandomLongitude(),
      latitude: getRandomLatitude(),
    });

    const simpleMarkerSymbol = {
      type: "simple-marker",
      color: [255, 0, 0], // Red
      outline: {
        color: [255, 255, 255], // White
        width: 1,
      },
    };

    const template = {
      title: "Alert Information",
      content: "<p>Alert Content</p>",
    };

    const pointGraphic = new Graphic({
      geometry: point,
      symbol: simpleMarkerSymbol,
      popupTemplate: template,
    });
    graphicsLayer.add(pointGraphic);
  }, 5000);

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
