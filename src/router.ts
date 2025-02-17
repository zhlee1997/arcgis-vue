import { createRouter, createWebHistory } from "vue-router";
import Map from "./components/Map.vue";
import WebMap from "./components/WebMap.vue";
import LayerMap from "./components/LayerMap.vue";
import HeatMapCSV from "./components/HeatMapCSV.vue";
import HeatMapGeoJSON from "./components/HeatMapGeoJSON.vue";
import OverlayMap from "./components/OverlayMap.vue";
import ThreeDMap from "./components/ThreeDMap.vue";
import ChangeBasemap from "./components/ChangeBasemap.vue";
import AlertMap from "./components/AlertMap.vue";
import VideoMap from "./components/VideoMap.vue";
import SimpleStatisticsMap from "./components/SimpleStatisticsMap.vue";
import SingleHighlightMap from "./components/SingleHighlightMap.vue";
import WeatherPointMapJSON from "./components/WeatherPointMapJSON.vue";
import ClusteringMarkerMap from "./components/ClusteringMarkerMap.vue";
import AdminMap from "./components/AdminMap.vue";
import SpatialQueryMap from "./components/SpatialQueryMap.vue";
import SpatialQueryCCTVMap from "./components/SpatialQueryCCTVMap.vue";

const routes = [
  { path: "/", component: Map },
  { path: "/webmap", component: WebMap },
  { path: "/layermap", component: LayerMap },
  { path: "/heatmapcsv", component: HeatMapCSV },
  { path: "/heatmapgeojson", component: HeatMapGeoJSON },
  { path: "/overlaymap", component: OverlayMap },
  { path: "/threedmap", component: ThreeDMap },
  { path: "/changebasemap", component: ChangeBasemap },
  { path: "/alertmap", component: AlertMap },
  { path: "/videomap", component: VideoMap },
  { path: "/simplestatisticsmap", component: SimpleStatisticsMap },
  { path: "/singlehiglightmap", component: SingleHighlightMap },
  { path: "/weatherpointmapjson", component: WeatherPointMapJSON },
  { path: "/clusteringmarkermap", component: ClusteringMarkerMap },
  { path: "/adminmap", component: AdminMap },
  { path: "/spatialquerymap", component: SpatialQueryMap },
  { path: "/spatialquerycctvmap", component: SpatialQueryCCTVMap },
  // Add more routes for other pages
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
