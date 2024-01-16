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
import LayerList from "@arcgis/core/widgets/LayerList";

const mapdiv = ref();

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
  const popupTrailheads = {
    title: "Trailhead",
    content:
      "<b>Trail:</b> {TRL_NAME}<br><b>City:</b> {CITY_JUR}<br><b>Cross Street:</b> {X_STREET}<br><b>Parking:</b> {PARKING}<br><b>Elevation:</b> {ELEV_FT} ft",
  };

  //Trailheads feature layer (points)
  const trailheadsLayer = new FeatureLayer({
    url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0",
    outFields: ["TRL_NAME", "CITY_JUR", "X_STREET", "PARKING", "ELEV_FT"],
    popupTemplate: popupTrailheads,
  });

  map.add(trailheadsLayer);

  // Define a popup for Trails
  const popupTrails = {
    title: "Trail Information",
    content: [
      {
        type: "media",
        mediaInfos: [
          {
            type: "column-chart",
            caption: "",
            value: {
              fields: ["ELEV_MIN", "ELEV_MAX"],
              normalizeField: null,
              tooltipField: "Min and max elevation values",
            },
          },
        ],
      },
    ],
  };

  //Trails feature layer (lines)
  const trailsLayer = new FeatureLayer({
    url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0",
    outFields: ["TRL_NAME", "ELEV_GAIN"],
    popupTemplate: popupTrails,
  });

  map.add(trailsLayer, 0);

  // Define popup for Parks and Open Spaces
  const popupOpenspaces = {
    title: "{PARK_NAME}",
    content: [
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: "AGNCY_NAME",
            label: "Agency",
            isEditable: true,
            tooltip: "",
            visible: true,
            format: null,
            stringFieldOption: "text-box",
          },
          {
            fieldName: "TYPE",
            label: "Type",
            isEditable: true,
            tooltip: "",
            visible: true,
            format: null,
            stringFieldOption: "text-box",
          },
          {
            fieldName: "ACCESS_TYP",
            label: "Access",
            isEditable: true,
            tooltip: "",
            visible: true,
            format: null,
            stringFieldOption: "text-box",
          },

          {
            fieldName: "GIS_ACRES",
            label: "Acres",
            isEditable: true,
            tooltip: "",
            visible: true,
            format: {
              places: 2,
              digitSeparator: true,
            },

            stringFieldOption: "text-box",
          },
        ],
      },
    ],
  };

  // Parks and open spaces (polygons)
  const parksLayer = new FeatureLayer({
    url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Parks_and_Open_Space/FeatureServer/0",
    outFields: [
      "TYPE",
      "PARK_NAME",
      "AGNCY_NAME",
      "ACCESS_TYP",
      "GIS_ACRES",
      "TRLS_MI",
      "TOTAL_GOOD",
      "TOTAL_FAIR",
      "TOTAL_POOR",
    ],
    popupTemplate: popupOpenspaces,
  });

  map.add(parksLayer, 0);

  const graphicsLayer = new GraphicsLayer({ title: "Vehicle Trajectory" });
  map.add(graphicsLayer);

  // Create a line geometry
  const polyline = {
    type: "polyline",
    paths: [
      [110.328536, 1.548377], //Longitude, latitude
      [110.338842, 1.546147], //Longitude, latitude
      [110.345198, 1.547176], //Longitude, latitude
      [110.354645, 1.550265], //Longitude, latitude
      [110.366498, 1.552839], //Longitude, latitude
    ],
  };
  const simpleLineSymbol = {
    type: "simple-line",
    color: [225, 0, 0], // Orange
    width: 4,
  };

  const polylineGraphic = new Graphic({
    geometry: polyline,
    symbol: simpleLineSymbol,
  });
  graphicsLayer.add(polylineGraphic);

  // Define a pop-up for Trailheads
  const popupPoints = {
    title: "{cctv_name}",
    content: "<b>CCTV ID:</b> {cctv_id}<br><b>CCTV Address:</b> {cctv_address}",
  };

  const cctvLayer = new FeatureLayer({
    // url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0",
    portalItem: {
      id: "8bace0177a0246139515f06b9b170685",
    },
    outFields: ["cctv_name", "cctv_id", "cctv_address"],
    popupTemplate: popupPoints,
  });

  map.add(cctvLayer);

  // Create a LayerList widget
  const layerList = new LayerList({
    view: view,
  });

  // Add the LayerList widget to the view
  view.ui.add(layerList, "top-right");

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
