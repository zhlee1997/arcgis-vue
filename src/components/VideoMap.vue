<template>
  <div class="mapdiv" ref="mapdiv"></div>
</template>

<script lang="ts" setup>
import MapView from "@arcgis/core/views/MapView";
import { onMounted, ref } from "vue";
import Map from "@arcgis/core/Map";
import esriConfig from "@arcgis/core/config";

import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

import PopupTemplate from "@arcgis/core/PopupTemplate";
import CustomContent from "@arcgis/core/popup/content/CustomContent";
import Search from "@arcgis/core/widgets/Search";
import StatisticDefinition from "@arcgis/core/rest/support/StatisticDefinition";
import Query from "@arcgis/core/rest/support/Query";
import * as query from "@arcgis/core/rest/query.js";
import * as intl from "@arcgis/core/intl.js";

const mapdiv = ref();

onMounted(() => {
  esriConfig.apiKey =
    "AAPK72621c47770b426798758730c48b8adeCpiJMaMF6zlMpNvLuvmd4H_yHgohLv9Jf0AAgDEbdZ1oVfvmLibxDgwZYfPgFIZf";

  let stats = {}; // Object to hold all school enrollment stats properties

  // Underlying states feature layer
  const featureLayer = new FeatureLayer({
    url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/OverlaySchools/FeatureServer/0",
    outFields: ["*"],
    title: "Private and Public schools in the US",
  });

  const map = new Map({
    basemap: "topo-vector",
    layers: [featureLayer],
  });

  const view = new MapView({
    container: mapdiv.value,
    map: map,
    zoom: 4,
    center: [-98, 38.5],
    popup: {
      defaultPopupTemplateEnabled: false,
      dockEnabled: true,
      dockOptions: {
        buttonEnabled: false,
        breakpoint: false,
      },
    },
  });

  view.when(() => {
    // Create the Search widget
    let searchWidget = new Search({
      view: view,
      includeDefaultSources: false,
      locationEnabled: false,
      popupEnabled: true,
      searchAllEnabled: false,
      suggestionsEnabled: true,
      sources: [
        {
          layer: featureLayer,
          searchFields: ["state_name"],
          displayField: "state_name",
          exactMatch: false,
          outFields: ["*"],
          name: "State name",
          placeholder: "Search by state",
        },
      ],
    });

    // This custom content element contains the Search widget
    const contentWidget = new CustomContent({
      outFields: ["*"],
      creator: () => {
        return searchWidget;
      },
    });

    // Query URL for private schools that intersect a state that was clicked
    // This is used to display content in the second custom content element
    const queryUrl =
      "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/PrivateSchools/FeatureServer/0";

    // This custom content contains the resulting promise from the query
    const contentPromise = new CustomContent({
      outFields: ["*"],
      creator: (event) => {
        // Generate stats for the count and types of private schools that intersect the state with average enrollment
        const levelCount = new StatisticDefinition({
          statisticType: "count",
          onStatisticField: "LEVEL_",
          outStatisticFieldName: "level_count",
        });

        const enrollmentAvg = new StatisticDefinition({
          statisticType: "avg",
          onStatisticField: "ENROLLMENT",
          outStatisticFieldName: "enroll_avg",
        });

        const queryObject = new Query({
          geometry: event.graphic.geometry,
          groupByFieldsForStatistics: ["LEVEL_"],
          outFields: ["*"],
          spatialRelationship: "intersects",
          outStatistics: [levelCount, enrollmentAvg],
        });

        // Check if the (school type) LEVEL_ is a specific value, if, return the enrollment average for that level and the count of features for it

        // Execute the query
        return query.executeQueryJSON(queryUrl, queryObject).then((result) => {
          // Returns the entire result, need to filter based on LEVEL_
          const featureAttributes = result.features.map((item, i) => {
            return item.attributes;
          });

          // Loop through all the feature attributes and check for the school level (elementary, secondary, or combined)
          featureAttributes.forEach((attribute) => {
            switch (attribute.LEVEL_) {
              case "Elementary":
                stats.elemCount = attribute.level_count;
                stats.elemAvg = attribute.enroll_avg;
                // Format the average to remove decimal places
                stats.elemAvgFormatted = intl.formatNumber(stats.elemAvg, {
                  maximumFractionDigits: 0,
                });
                break;
              case "Secondary":
                stats.secondaryCount = attribute.level_count;
                stats.secondaryAvg = attribute.enroll_avg;
                stats.secondaryAvgFormatted = intl.formatNumber(
                  stats.secondaryAvg,
                  {
                    maximumFractionDigits: 0,
                  }
                );
                break;
              case "Combined elementary and secondary":
                stats.combinedCount = attribute.level_count;
                stats.combinedAvg = attribute.enroll_avg;
                stats.combinedAvgFormatted = intl.formatNumber(
                  stats.combinedAvg,
                  {
                    maximumFractionDigits: 0,
                  }
                );
            }
          });

          // Format the returned values and display this in the popup content
          return `<video width="320" height="240" controls>
  <source src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4">
  <source src="movie.ogg" type="video/ogg">
  Your browser does not support the video tag.
</video>`;
        });
      },
    });

    searchWidget.on("search-complete", (searchResult) => {
      searchWidget.clear();
    });

    // Create the PopupTemplate and reference the two custom content elements
    const template = new PopupTemplate({
      outFields: ["*"],
      title: "State: {state_name}",
      content: [contentWidget, contentPromise],
    });

    featureLayer.popupTemplate = template;
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
