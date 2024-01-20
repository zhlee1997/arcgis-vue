<template>
  <div class="mapdiv" ref="mapdiv"></div>
</template>

<script lang="ts" setup>
import MapView from "@arcgis/core/views/MapView";
import { onMounted, ref } from "vue";
import Map from "@arcgis/core/Map";
import esriConfig from "@arcgis/core/config";

import ClassBreaksRenderer from "@arcgis/core/renderers/ClassBreaksRenderer";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import Legend from "@arcgis/core/widgets/Legend";

const mapdiv = ref();

onMounted(() => {
  esriConfig.apiKey =
    "AAPK72621c47770b426798758730c48b8adeCpiJMaMF6zlMpNvLuvmd4H_yHgohLv9Jf0AAgDEbdZ1oVfvmLibxDgwZYfPgFIZf";

  //   const url =
  //     "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.csv";

  // create a geojson layer from geojson feature collection
  const geojson = {
    type: "FeatureCollection",
    metadata: {
      generated: 1705239963000,
      url: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson",
      title: "USGS All Earthquakes, Past Month",
      status: 200,
      api: "1.10.3",
      count: 8973,
    },
    features: [
      {
        type: "Feature",
        properties: {
          council: "US",
          precipitation: 5,
          place: "6 km E of Yorba Linda, CA",
          type: "weather",
        },
        geometry: {
          type: "Point",
          coordinates: [-117.748, 33.8985],
        },
        id: "ci40459679",
      },
      {
        type: "Feature",
        properties: {
          council: "DBKU",
          precipitation: 1,
          type: "weather",
        },
        geometry: {
          coordinates: [110.34411723815202, 1.5728910594640553],
          type: "Point",
        },
        id: "dbku",
      },
      {
        type: "Feature",
        properties: {
          council: "MBKS",
          precipitation: 5,
          type: "weather",
        },
        geometry: {
          coordinates: [110.33863530772732, 1.547878740921007],
          type: "Point",
        },
        id: "mbks14",
      },
      {
        type: "Feature",
        properties: {
          council: "around",
          precipitation: 10,
          type: "weather",
          title: "M 0.9 - 3 km NE of Colton, CA",
        },
        geometry: {
          coordinates: [110.368551, 1.543537],
          type: "Point",
        },
        id: "around23",
      },
      {
        type: "Feature",
        properties: {
          council: "around",
          precipitation: 12,
          type: "weather",
          title: "M 0.9 - 3 km NE of Colton, CA",
        },
        geometry: {
          coordinates: [110.36688993690075, 1.5758539643234997],
          type: "Point",
        },
        id: "around24",
      },
      {
        type: "Feature",
        properties: {
          council: "around",
          precipitation: 18,
          type: "weather",
          title: "M 0.9 - 3 km NE of Colton, CA",
        },
        geometry: {
          coordinates: [110.316333, 1.561383],
          type: "Point",
        },
        id: "around25",
      },
    ],
  };

  // create a new blob from geojson featurecollection
  const blob = new Blob([JSON.stringify(geojson)], {
    type: "application/json",
  });

  // URL reference to the blob
  const url = URL.createObjectURL(blob);

  // Paste the url into a browser's address bar to download and view the attributes
  // in the CSV file. These attributes include:
  // * mag - magnitude
  // * type - earthquake or other event such as nuclear test
  // * place - location of the event
  // * time - the time of the event

  const template = {
    title: "{place}",
    content: "Magnitude {precipitation} {type} hit {place} on {time}.",
  };

  // The heatmap renderer assigns each pixel in the view with
  // an intensity value. The ratio of that intensity value
  // to the maxPixel intensity is used to assign a color
  // from the continuous color ramp in the colorStops property

  var renderer = new ClassBreaksRenderer({
    field: "precipitation",
  });
  renderer.addClassBreakInfo({
    minValue: 0,
    maxValue: 4,
    symbol: {
      type: "simple-marker",
      size: 50,
      color: "rgba(255, 0, 0, 0.3)",
    },
  });
  renderer.addClassBreakInfo({
    minValue: 5,
    maxValue: 8,
    symbol: {
      type: "simple-marker",
      size: 50,
      color: "rgba(255, 165, 0, 0.3)",
    },
  });
  renderer.addClassBreakInfo({
    minValue: 9,
    maxValue: 12,
    symbol: {
      type: "simple-marker",
      size: 50,
      color: "rgba(0, 255, 0, 0.3)",
    },
  });
  renderer.addClassBreakInfo({
    minValue: 13,
    maxValue: 16,
    symbol: {
      type: "simple-marker",
      size: 50,
      color: "rgba(0, 0, 255, 0.3)",
    },
  });
  renderer.addClassBreakInfo({
    minValue: 17,
    maxValue: 20,
    symbol: {
      type: "simple-marker",
      size: 50,
      color: "rgba(75, 0, 130, 0.3)",
    },
    // outline: {
    //   color: "rgba(0, 139, 174, 0.5)",
    //   width: 5,
    // },
  });

  // create new geojson layer using the blob url
  const layer = new GeoJSONLayer({
    url,
    title: "Kuching Rainfall (mm)",
    copyright: "USGS Earthquakes",
    popupTemplate: template,
    renderer: renderer,
    // labelsVisible: true,
    // labelingInfo: [
    //   {
    //     symbol: {
    //       type: "text", // autocasts as new TextSymbol()
    //       color: "white",
    //       font: {
    //         family: "Noto Sans",
    //         size: 8,
    //       },
    //       haloColor: "#472b77",
    //       haloSize: 0.75,
    //     },
    //     labelPlacement: "center-center",
    //     labelExpressionInfo: {
    //       expression: "Text($feature.mag, '#.0')",
    //     },
    //     where: "mag > 5",
    //   },
    // ],
  });

  const map = new Map({
    basemap: "arcgis/dark-gray",
    layers: [layer],
  });

  const view = new MapView({
    container: mapdiv.value,
    center: [110.34411723815202, 1.5728910594640553],
    zoom: 11,
    map: map,
    constraints: {
      maxZoom: 11,
      minZoom: 2,
    },
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
