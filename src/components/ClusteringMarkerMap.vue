<template>
  <div class="mapdiv" ref="mapdiv"></div>
</template>

<script lang="ts" setup>
import MapView from "@arcgis/core/views/MapView";
import { onMounted, ref } from "vue";
import Map from "@arcgis/core/Map";
import esriConfig from "@arcgis/core/config";

import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";

import Graphic from "@arcgis/core/Graphic";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Point from "@arcgis/core/geometry/Point";

const mapdiv = ref();

onMounted(() => {
  esriConfig.apiKey =
    "AAPK72621c47770b426798758730c48b8adeCpiJMaMF6zlMpNvLuvmd4H_yHgohLv9Jf0AAgDEbdZ1oVfvmLibxDgwZYfPgFIZf";

  // Configures clustering on the layer. A cluster radius
  // of 100px indicates an area comprising screen space 100px
  // in length from the center of the cluster
  const clusterConfig = {
    type: "cluster",
    clusterRadius: "100px",
    // {cluster_count} is an aggregate field containing
    // the number of features comprised by the cluster
    popupTemplate: {
      content: "This cluster represents {cluster_count} earthquakes.",
      fieldInfos: [
        {
          fieldName: "cluster_count",
          format: {
            places: 0,
            digitSeparator: true,
          },
        },
      ],
    },
    clusterMinSize: "24px",
    clusterMaxSize: "60px",
    labelingInfo: [
      {
        deconflictionStrategy: "none",
        labelExpressionInfo: {
          expression: "Text($feature.cluster_count, '#,###')",
        },
        symbol: {
          type: "text",
          color: "#004a5d",
          font: {
            weight: "bold",
            family: "Noto Sans",
            size: "12px",
          },
        },
        labelPlacement: "center-center",
      },
    ],
  };

  const layer = new GeoJSONLayer({
    title: "Earthquakes from the last month",
    url: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson",
    copyright: "USGS Earthquakes",
    featureReduction: clusterConfig,
    // popupTemplates can still be viewed on
    // individual features
    popupTemplate: {
      title: "Earthquake Info",
      content: "Magnitude {mag} {type} hit {place} on {time}",
      fieldInfos: [
        {
          fieldName: "time",
          format: {
            dateFormat: "short-date-short-time",
          },
        },
      ],
    },
    // renderer: renderer,
    renderer: {
      type: "simple",
      field: "mag",
      symbol: {
        type: "simple-marker",
        size: 4,
        color: "rgba(255, 139, 174, 0.5)",
        outline: {
          color: "rgba(0, 139, 174, 0.5)",
          width: 5,
        },
      },
    },
  });

  const clusterConfigCCTV = {
    type: "cluster",
    clusterRadius: "100px",
    // {cluster_count} is an aggregate field containing
    // the number of features comprised by the cluster
    popupTemplate: {
      content: "This cluster represents {cluster_count} CCTVs.",
      fieldInfos: [
        {
          fieldName: "cluster_count",
          format: {
            places: 0,
            digitSeparator: true,
          },
        },
      ],
    },
    clusterMinSize: "24px",
    clusterMaxSize: "60px",
    labelingInfo: [
      {
        deconflictionStrategy: "none",
        labelExpressionInfo: {
          expression: "Text($feature.cluster_count, '#,###')",
        },
        symbol: {
          type: "text",
          color: "#004a5d",
          font: {
            weight: "bold",
            family: "Noto Sans",
            size: "12px",
          },
        },
        labelPlacement: "center-center",
      },
    ],
  };

  // Define a pop-up for Trailheads
  const popupPoints = {
    title: "{name}",
    content: "<b>Rating:</b> {rating}<br>",
  };

  // Marker icon rendering
  const trailheadsRenderer = {
    type: "simple",
    symbol: {
      type: "picture-marker",
      url: "https://image.shutterstock.com/image-vector/black-icon-illustration-cctv-camera-260nw-628040864.jpg",
      width: "30px",
      height: "30px",
    },
  };

  const trailheadsLayer = new FeatureLayer({
    // url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0",
    portalItem: {
      id: "8ffdd4b9cbeb4ed8bba91d05e2b4fbbe",
    },
    renderer: trailheadsRenderer,
    outFields: ["name", "rating"],
    popupTemplate: popupPoints,
    featureReduction: clusterConfigCCTV,
  });

  const map = new Map({
    basemap: "arcgis/topographic",
    layers: [trailheadsLayer, layer],
  });

  const view = new MapView({
    container: mapdiv.value,
    map: map,
    center: [110.358639, 1.530446], //Longitude, latitude
    zoom: 12,
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
</style>
