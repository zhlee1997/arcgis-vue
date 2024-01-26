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
