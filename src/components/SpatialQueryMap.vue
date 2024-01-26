a
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
    center: [-118.80543, 34.03], //Longitude, latitude
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
    url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/LA_County_Parcels/FeatureServer/0",
  });

  function queryFeaturelayer(geometry) {
    const parcelQuery = {
      spatialRelationship: "intersects", // Relationship operation to apply
      geometry: geometry, // The sketch feature geometry
      outFields: ["APN", "UseType", "TaxRateCity", "Roll_LandValue"], // Attributes to return
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
      type: "simple-fill",
      color: [20, 130, 200, 0.5],
      outline: {
        color: "white",
        width: 0.5,
      },
    };

    const popupTemplate = {
      title: "Parcel {APN}",
      content:
        "Type: {UseType} <br> Land value: {Roll_LandValue} <br> Tax Rate City: {TaxRateCity}",
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

  // Define a pop-up for Trailheads
  const popupPoints = {
    title: "{name}",
    content: "<b>Rating:</b> {rating}<br>",
  };

  //Trailheads feature layer (points)
  const adminLayer = new FeatureLayer({
    url: "https://gisdevportal.tnt.sarawak.gov.my/arcgis/rest/services/sioc/Local_Council_Boundary/FeatureServer/0",
    // outFields: ["name", "rating"],
    // popupTemplate: popupPoints,
  });

  map.add(adminLayer);

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
