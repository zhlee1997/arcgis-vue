import { createRouter, createWebHistory } from "vue-router";
import Map from "./components/Map.vue";
import WebMap from "./components/WebMap.vue";
import LayerMap from "./components/LayerMap.vue";
import HeatMapCSV from "./components/HeatMapCSV.vue";
import HeatMapGeoJSON from "./components/HeatMapGeoJSON.vue";
import OverlayMap from "./components/OverlayMap.vue";
import ThreeDMap from "./components/ThreeDMap.vue";
import ChangeBasemap from "./components/ChangeBasemap.vue";

const routes = [
  { path: "/", component: Map },
  { path: "/webmap", component: WebMap },
  { path: "/layermap", component: LayerMap },
  { path: "/heatmapcsv", component: HeatMapCSV },
  { path: "/heatmapgeojson", component: HeatMapGeoJSON },
  { path: "/overlaymap", component: OverlayMap },
  { path: "/threedmap", component: ThreeDMap },
  { path: "/changebasemap", component: ChangeBasemap },
  // Add more routes for other pages
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
