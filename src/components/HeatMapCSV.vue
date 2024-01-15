<template>
  <div class="mapdiv" ref="mapdiv"></div>
</template>

<script lang="ts" setup>
import MapView from "@arcgis/core/views/MapView";
import { onMounted, ref } from "vue";
import Map from "@arcgis/core/Map";
import esriConfig from "@arcgis/core/config";

import CSVLayer from "@arcgis/core/layers/CSVLayer";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import Legend from "@arcgis/core/widgets/Legend";

const mapdiv = ref();

onMounted(() => {
  esriConfig.apiKey =
    "AAPK72621c47770b426798758730c48b8adeCpiJMaMF6zlMpNvLuvmd4H_yHgohLv9Jf0AAgDEbdZ1oVfvmLibxDgwZYfPgFIZf";

  const url =
    "https://raw.githubusercontent.com/zhlee1997/csv_file/main/srwk_heatmap_3.csv";
  // "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.csv";

  // Paste the url into a browser's address bar to download and view the attributes
  // in the CSV file. These attributes include:
  // * mag - magnitude
  // * type - earthquake or other event such as nuclear test
  // * place - location of the event
  // * time - the time of the event

  const template = {
    title: "{place}",
    content: "Magnitude {mag} {type} hit {place} on {time}.",
  };

  // The heatmap renderer assigns each pixel in the view with
  // an intensity value. The ratio of that intensity value
  // to the maxPixel intensity is used to assign a color
  // from the continuous color ramp in the colorStops property

  const renderer = {
    type: "heatmap",
    colorStops: [
      { color: "rgba(63, 40, 102, 0)", ratio: 0 },
      { color: "#472b77", ratio: 0.083 },
      { color: "#4e2d87", ratio: 0.166 },
      { color: "#563098", ratio: 0.249 },
      { color: "#5d32a8", ratio: 0.332 },
      { color: "#6735be", ratio: 0.415 },
      { color: "#7139d4", ratio: 0.498 },
      { color: "#7b3ce9", ratio: 0.581 },
      { color: "#853fff", ratio: 0.664 },
      { color: "#a46fbf", ratio: 0.747 },
      { color: "#c29f80", ratio: 0.83 },
      { color: "#e0cf40", ratio: 0.913 },
      { color: "#ffff00", ratio: 1 },
    ],
    maxDensity: 0.01,
    minDensity: 0,
  };

  // const geolayer = new GeoJSONLayer({
  //   url: "",
  //   // json: "{123:abc}"
  //   renderer,
  // });

  const layer = new CSVLayer({
    url: url,
    title: "Magnitude 2.5+ earthquakes from the last week",
    copyright: "USGS Earthquakes",
    popupTemplate: template,
    renderer: renderer,
    labelsVisible: true,
    labelingInfo: [
      {
        symbol: {
          type: "text", // autocasts as new TextSymbol()
          color: "white",
          font: {
            family: "Noto Sans",
            size: 8,
          },
          haloColor: "#472b77",
          haloSize: 0.75,
        },
        labelPlacement: "center-center",
        labelExpressionInfo: {
          expression: "Text($feature.mag, '#.0')",
        },
        where: "mag > 5",
      },
    ],
  });

  const map = new Map({
    basemap: "arcgis/topographic",
    layers: [layer],
  });

  const view = new MapView({
    container: mapdiv.value,
    center: [-138, 30],
    zoom: 2,
    map: map,
  });

  view.ui.add(
    new Legend({
      view: view,
    }),
    "bottom-left"
  );
});
</script>

<style scoped>
html,
body,
.mapdiv {
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
}
</style>
