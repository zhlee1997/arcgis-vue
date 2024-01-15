<template>
  <!-- <div class="mapdiv" ref="mapdiv"></div> -->
  <div>
    <div ref="mapdiv" style="height: 500px"></div>
    <div id="overlayPanel" v-show="showOverlay">
      <!-- Add your overlay content here -->
      <p>This is the overlay panel content.</p>
      <p>This is an alert information content.</p>
      <button @click="hideOverlay">Close Overlay</button>
    </div>
    <div
      id="myOwnPrinterButton"
      class="esri-component esri-widget--button esri-widget"
      role="button"
    >
      <span
        title="This looks like a printer button"
        id="custom-printer"
        class="esri-icon esri-icon-printer"
      ></span>
    </div>
    <!-- Button outside of mapdiv -->
    <button @click="showOverlayPanel" class="centered-button">
      Display Information
    </button>
  </div>
</template>

<script lang="ts" setup>
import MapView from "@arcgis/core/views/MapView";
import { onMounted, ref } from "vue";
import Map from "@arcgis/core/Map";
import esriConfig from "@arcgis/core/config";

import Graphic from "@arcgis/core/Graphic";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Point from "@arcgis/core/geometry/Point";

const mapdiv = ref();

// reactive state
const showOverlay = ref(true);

// functions that mutate state and trigger updates
function showOverlayPanel() {
  showOverlay.value = true;
  console.log("show button pressed");
}

function hideOverlay() {
  showOverlay.value = false;
  console.log("hide button pressed");
}

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

  view.ui.add(["myOwnPrinterButton"], "top-right");

  var printerButton = document.getElementById("myOwnPrinterButton");
  printerButton?.addEventListener("click", printerAction);

  function printerAction(event: MouseEvent) {
    showOverlayPanel();
  }

  const graphicsLayer = new GraphicsLayer();
  map.add(graphicsLayer);

  const point = new Point({
    //Create a point
    longitude: 110.340089,
    latitude: 1.554336,
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
  graphicsLayer.add(pointGraphic);

  view.on("click", function (event) {
    view.hitTest(event).then(function (response) {
      if (response.results.length) {
        view.goTo(response.results[0].graphic.geometry).then(() => {
          view.zoom = 17;
          showOverlayPanel();
        });
      }
    });
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

#overlayPanel {
  position: absolute;
  top: 100px;
  left: 100px;
  padding: 10px;
  background-color: white;
  border: 1px solid #ccc;
  z-index: 1000;
}

.centered-button {
  position: fixed;
  bottom: 25%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
