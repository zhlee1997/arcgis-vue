<template>
  <div class="mapdiv" ref="mapdiv"></div>
  <div id="infoDiv" class="esri-widget">
    <div id="layerListDiv"></div>
  </div>
  <!-- <div id="layerListToggle">Toggle LayerList</div> -->
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
import Expand from "@arcgis/core/widgets/Expand";

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
    center: [110.344728, 1.556662], //Longitude, latitude
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
      [110.343815, 1.557575], //Longitude, latitude
      [110.347925, 1.555725], //Longitude, latitude
      [110.351854, 1.547649], //Longitude, latitude
      [110.358639, 1.530446], //Longitude, latitude
    ],
  };

  const simpleLineSymbol = {
    type: "simple-line",
    color: [225, 0, 0], // Orange
    width: 3,
  };

  const polylineGraphic = new Graphic({
    geometry: polyline,
    symbol: simpleLineSymbol,
  });
  graphicsLayer.add(polylineGraphic);

  let textSymbol1 = {
    type: "text", // autocasts as new TextSymbol()
    color: "white",
    text: "1",
    backgroundColor: [255, 0, 0],
    borderLineColor: [255, 0, 0],
    font: {
      // autocasts as new Font()
      size: 12,
      weight: "bold",
    },
  };

  let textSymbol2 = {
    type: "text", // autocasts as new TextSymbol()
    color: "white",
    text: "2",
    backgroundColor: [255, 0, 0],
    borderLineColor: [255, 0, 0],
    font: {
      // autocasts as new Font()
      size: 12,
      weight: "bold",
    },
  };

  let textSymbol3 = {
    type: "text", // autocasts as new TextSymbol()
    color: "white",
    text: "3",
    backgroundColor: [255, 0, 0],
    borderLineColor: [255, 0, 0],
    font: {
      // autocasts as new Font()
      size: 12,
      weight: "bold",
    },
  };

  let textSymbol4 = {
    type: "text", // autocasts as new TextSymbol()
    color: "white",
    text: "4",
    backgroundColor: [255, 0, 0],
    borderLineColor: [255, 0, 0],
    font: {
      // autocasts as new Font()
      size: 12,
      weight: "bold",
    },
  };

  let textSymbol5 = {
    type: "text", // autocasts as new TextSymbol()
    color: "white",
    text: "5",
    backgroundColor: [255, 0, 0],
    borderLineColor: [255, 0, 0],
    font: {
      // autocasts as new Font()
      size: 12,
      weight: "bold",
    },
  };

  let textSymbol6 = {
    type: "text", // autocasts as new TextSymbol()
    color: "white",
    text: "6",
    backgroundColor: [255, 0, 0],
    borderLineColor: [255, 0, 0],
    font: {
      // autocasts as new Font()
      size: 12,
      weight: "bold",
    },
  };

  const point = new Point({
    //Create a point
    longitude: 110.328536,
    latitude: 1.548377,
  });

  const point2 = new Point({
    //Create a point
    longitude: 110.338842,
    latitude: 1.546147,
  });

  const point3 = new Point({
    //Create a point
    longitude: 110.343815,
    latitude: 1.557575,
  });

  const point4 = new Point({
    //Create a point
    longitude: 110.347925,
    latitude: 1.555725,
  });

  const point5 = new Point({
    //Create a point
    longitude: 110.351854,
    latitude: 1.547649,
  });

  const point6 = new Point({
    //Create a point
    longitude: 110.358639,
    latitude: 1.530446,
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
    symbol: textSymbol1,
  });

  const pointGraphic2 = new Graphic({
    geometry: point2,
    symbol: textSymbol2,
  });

  const pointGraphic3 = new Graphic({
    geometry: point3,
    symbol: textSymbol3,
  });

  const pointGraphic4 = new Graphic({
    geometry: point4,
    symbol: textSymbol4,
  });

  const pointGraphic5 = new Graphic({
    geometry: point5,
    symbol: textSymbol5,
  });

  const pointGraphic6 = new Graphic({
    geometry: point6,
    symbol: textSymbol6,
  });

  graphicsLayer.addMany([
    pointGraphic,
    pointGraphic2,
    pointGraphic3,
    pointGraphic4,
    pointGraphic5,
    pointGraphic6,
  ]);

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
    container: "layerListDiv",
  });

  // Add the LayerList widget to the view
  // view.ui.add(layerList, "top-right");

  const infoDiv = document.getElementById("infoDiv");
  view.ui.add(
    new Expand({
      expandIcon: "layers",
      view: view,
      content: infoDiv,
      expandIconClass: "esri-icon-layer-list",
      expanded: false,
    }),
    "top-left"
  );

  // Toggle button to hide/show LayerList
  var layerListToggle = document.getElementById("layerListToggle");
  layerListToggle.addEventListener("click", function () {
    if (layerList.visible) {
      layerList.visible = false;
    } else {
      layerList.visible = true;
    }
  });

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
#layerListToggle {
  position: absolute;
  bottom: 20px;
  left: 10px;
  background-color: #fff;
  padding: 8px;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
