<script lang="ts" setup>
import MapView from "@arcgis/core/views/MapView";
import { onMounted, ref } from "vue";
import Map from "@arcgis/core/Map";
import esriConfig from "@arcgis/core/config";

import "@esri/calcite-components/dist/components/calcite-label";
import "@esri/calcite-components/dist/components/calcite-combobox";
import "@esri/calcite-components/dist/components/calcite-combobox-item";

const mapdiv = ref();

onMounted(() => {
  esriConfig.apiKey =
    "AAPK72621c47770b426798758730c48b8adeCpiJMaMF6zlMpNvLuvmd4H_yHgohLv9Jf0AAgDEbdZ1oVfvmLibxDgwZYfPgFIZf";

  const map = new Map({
    basemap: "arcgis/topographic",
  });

  const updateBasemapStyle = (basemapId) => {
    view.map.basemap = basemapId;
  };

  const styleCombobox = document.getElementById("styleCombobox");
  styleCombobox?.addEventListener("calciteComboboxChange", (event) => {
    updateBasemapStyle(event.target.value);
  });

  const view = new MapView({
    container: mapdiv.value,
    map: map,
    center: [-118.805, 34.027], //Longitude, latitude
    zoom: 13,
  });

  const basemapStylesDiv = document.getElementById("basemapStyles");
  view.ui.add(basemapStylesDiv, "top-right");

  view.when(() => {
    console.log("view ready");
  });
});
</script>

<!-- src="@esri/calcite-components/dist/calcite/calcite.css" -->
<style scoped>
.mapdiv {
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
}
#basemapStyles {
  width: 250px;
  padding: 10px;
}
</style>

<template>
  <div class="mapdiv" ref="mapdiv"></div>

  <div id="basemapStyles" class="esri-widget">
    <calcite-label>Basemap style</calcite-label>
    <calcite-combobox id="styleCombobox" selection-mode="single" clear-disabled>
      <calcite-combobox-item
        value="arcgis/navigation"
        text-label="arcgis/navigation"
      ></calcite-combobox-item>
      <calcite-combobox-item
        value="arcgis/navigation-night"
        text-label="arcgis/navigation-night"
      ></calcite-combobox-item>
      <calcite-combobox-item
        value="arcgis/streets"
        text-label="arcgis/streets"
      ></calcite-combobox-item>
      <calcite-combobox-item
        value="arcgis/streets-relief"
        text-label="arcgis/streets-relief"
      ></calcite-combobox-item>
      <calcite-combobox-item
        value="arcgis/streets-night"
        text-label="arcgis/streets-night"
      ></calcite-combobox-item>
      <calcite-combobox-item
        value="arcgis/outdoor"
        text-label="arcgis/outdoor"
      ></calcite-combobox-item>
      <calcite-combobox-item
        value="arcgis/imagery"
        text-label="arcgis/imagery"
      ></calcite-combobox-item>
      <calcite-combobox-item
        value="arcgis/topographic"
        text-label="arcgis/topographic"
        selected
      ></calcite-combobox-item>
      <calcite-combobox-item
        value="arcgis/terrain"
        text-label="arcgis/terrain"
      ></calcite-combobox-item>
      <calcite-combobox-item
        value="arcgis/oceans"
        text-label="arcgis/oceans"
      ></calcite-combobox-item>
      <calcite-combobox-item
        value="arcgis/light-gray"
        text-label="arcgis/light-gray"
      ></calcite-combobox-item>
      <calcite-combobox-item
        value="arcgis/dark-gray"
        text-label="arcgis/dark-gray"
      ></calcite-combobox-item>
      <calcite-combobox-item
        value="arcgis/human-geography"
        text-label="arcgis/human-geography"
      ></calcite-combobox-item>
      <calcite-combobox-item
        value="arcgis/human-geography-dark"
        text-label="arcgis/human-geography-dark"
      ></calcite-combobox-item>
      <calcite-combobox-item
        value="arcgis/charted-territory"
        text-label="arcgis/charted-territory"
      ></calcite-combobox-item>
      <calcite-combobox-item
        value="arcgis/colored-pencil"
        text-label="arcgis/colored-pencil"
      ></calcite-combobox-item>
      <calcite-combobox-item
        value="arcgis/nova"
        text-label="arcgis/nova"
      ></calcite-combobox-item>
      <calcite-combobox-item
        value="arcgis/modern-antique"
        text-label="arcgis/modern-antique"
      ></calcite-combobox-item>
      <calcite-combobox-item
        value="arcgis/midcentury"
        text-label="arcgis/midcentury"
      ></calcite-combobox-item>
      <calcite-combobox-item
        value="arcgis/newspaper"
        text-label="arcgis/newspaper"
      ></calcite-combobox-item>
      <calcite-combobox-item
        value="osm/standard"
        text-label="osm/standard"
      ></calcite-combobox-item>
      <calcite-combobox-item
        value="osm/standard-relief"
        text-label="osm/standard-relief"
      ></calcite-combobox-item>
      <calcite-combobox-item
        value="osm/navigation"
        text-label="osm/navigation"
      ></calcite-combobox-item>
      <calcite-combobox-item
        value="osm/navigation-dark"
        text-label="osm/navigation-dark"
      ></calcite-combobox-item>
      <calcite-combobox-item
        value="osm/streets"
        text-label="osm/streets"
      ></calcite-combobox-item>
      <calcite-combobox-item
        value="osm/hybrid"
        text-label="osm/hybrid"
      ></calcite-combobox-item>
      <calcite-combobox-item
        value="osm/light-gray"
        text-label="osm/light-gray"
      ></calcite-combobox-item>
      <calcite-combobox-item
        value="osm/dark-gray"
        text-label="osm/dark-gray"
      ></calcite-combobox-item>
      <calcite-combobox-item
        value="osm/blueprint"
        text-label="osm/blueprint"
      ></calcite-combobox-item>
    </calcite-combobox>
  </div>
</template>
