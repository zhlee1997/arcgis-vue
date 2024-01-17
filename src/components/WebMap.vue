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

import * as urlUtils from "@arcgis/core/core/urlUtils.js";

const mapdiv = ref();

onMounted(() => {
  //please add these 2 lines of code to by pass the credential checking
  let proxyURL = "https://gisdevportal.tnt.sarawak.gov.my/proxy/proxy.ashx";
  let urlPrefix =
    "https://gisdevportal.tnt.sarawak.gov.my/arcgis/rest/services";

  urlUtils.addProxyRule({
    proxyUrl: proxyURL,
    urlPrefix,
  });
  // esriConfig.apiKey =
  //   "AAPKcf332ae954ed41ea901d68daa179cb5538NZdMqVXnlzctrUZ7FaXZr9TwNk6-9DPgsmoShPq8unPMgIe0kJVc_5NMO9snmd";

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

  // Define a pop-up for Trailheads
  const popupTemplate = {
    title: "{device_name}",
    content: "<b>Council:</b> {device_council}<br>",
  };

  //Trailheads feature layer (points)
  const cctvLayer = new FeatureLayer({
    url: "https://gisdevportal.tnt.sarawak.gov.my/arcgis/rest/services/sioc/sioc_cctv/FeatureServer/0",
    outFields: ["device_name", "device_council"],
    popupTemplate: popupTemplate,
  });

  webmap.add(cctvLayer);

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
