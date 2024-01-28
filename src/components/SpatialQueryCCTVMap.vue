<template>
  <div class="mapdiv" ref="mapdiv"></div>
</template>

<script lang="ts" setup>
import MapView from "@arcgis/core/views/MapView";
import { onMounted, ref } from "vue";
import Map from "@arcgis/core/Map";
import esriConfig from "@arcgis/core/config";

import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

import * as urlUtils from "@arcgis/core/core/urlUtils.js";

import Sketch from "@arcgis/core/widgets/Sketch";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";

const mapdiv = ref();

onMounted(() => {
  let proxyURL = "https://gisdevportal.tnt.sarawak.gov.my/proxy/proxy.ashx";
  let urlPrefix =
    "https://gisdevportal.tnt.sarawak.gov.my/arcgis/rest/services";

  urlUtils.addProxyRule({
    proxyUrl: proxyURL,
    urlPrefix,
  });

  esriConfig.apiKey =
    "AAPK72621c47770b426798758730c48b8adeCpiJMaMF6zlMpNvLuvmd4H_yHgohLv9Jf0AAgDEbdZ1oVfvmLibxDgwZYfPgFIZf";

  const map = new Map({
    basemap: "arcgis/topographic",
  });

  const view = new MapView({
    container: mapdiv.value,
    map: map,
    center: [110.358639, 1.530446], //Longitude, latitude
    zoom: 12,
  });

  // Add sketch widget
  const graphicsLayerSketch = new GraphicsLayer();
  map.add(graphicsLayerSketch);

  const sketch = new Sketch({
    layer: graphicsLayerSketch,
    view: view,
    creationMode: "update", // Auto-select
  });

  view.ui.add(sketch, "top-right");

  // Add sketch events to listen for and execute query
  sketch.on("update", (event) => {
    // Create
    if (event.state === "start") {
      queryFeaturelayer(event.graphics[0].geometry);
    }
    if (event.state === "complete") {
      graphicsLayerSketch.remove(event.graphics[0]); // Clear the graphic when a user clicks off of it or sketches new one
    }
    // Change
    if (
      event.toolEventInfo &&
      (event.toolEventInfo.type === "scale-stop" ||
        event.toolEventInfo.type === "reshape-stop" ||
        event.toolEventInfo.type === "move-stop")
    ) {
      queryFeaturelayer(event.graphics[0].geometry);
    }
  });

  // Reference query layer
  const parcelLayer = new FeatureLayer({
    url: "https://services7.arcgis.com/jSIZ4REzVWEnNWX4/arcgis/rest/services/sioc_cctv_list/FeatureServer/0",
  });

  map.add(parcelLayer);

  function queryFeaturelayer(geometry) {
    const parcelQuery = {
      spatialRelationship: "intersects", // Relationship operation to apply
      geometry: geometry, // The sketch feature geometry
      outFields: ["DEVICE_NAME"], // Attributes to return
      returnGeometry: true,
    };

    parcelLayer
      .queryFeatures(parcelQuery)
      .then((results) => {
        console.log("Feature count: " + results.features.length);

        displayResults(results);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Show features (graphics)
  function displayResults(results) {
    // Create a blue polygon
    const symbol = {
      type: "simple-marker",
      color: [226, 119, 40], // Orange
      outline: {
        color: [255, 255, 255], // White
        width: 1,
      },
    };

    const popupTemplate = {
      title: "CCTV",
      content: "CCTV NAME: {DEVICE_NAME} <br>",
    };

    // Set symbol and popup
    results.features.map((feature) => {
      feature.symbol = symbol;
      feature.popupTemplate = popupTemplate;
      return feature;
    });

    // Clear display
    view.closePopup();
    view.graphics.removeAll();
    // Add features to graphics layer
    view.graphics.addMany(results.features);
  }

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
