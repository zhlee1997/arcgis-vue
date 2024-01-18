<template>
  <div class="mapdiv" ref="mapdiv"></div>
  <div id="paneDiv" class="esri-widget">
    <h3>CCTV Cameras</h3>
    <button class="esri-button esri-button-overwrite">Kuching SIOC</button>
    <button class="esri-button esri-button-overwrite">Bangunan Merdeka</button>
    <button class="esri-button esri-button-overwrite">
      Sarawak Tourist Association
    </button>
    <button class="esri-button esri-button-overwrite">Wisma Satok</button>
    <button class="esri-button esri-button-overwrite">Precinct 88 Mall</button>
    <button class="esri-button esri-button-overwrite">Wisma MPP</button>
  </div>
</template>

<script lang="ts" setup>
import MapView from "@arcgis/core/views/MapView";
import { onMounted, ref } from "vue";
import WebMap from "@arcgis/core/WebMap";

import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

import ScaleBar from "@arcgis/core/widgets/ScaleBar";
import Legend from "@arcgis/core/widgets/Legend";

import * as urlUtils from "@arcgis/core/core/urlUtils.js";

const mapdiv = ref();

onMounted(() => {
  //please add these 2 lines of code to by pass the credential checking
  let proxyURL = "https://gisdevportal.tnt.sarawak.gov.my/proxy/proxy.ashx";
  let urlPrefix =
    "https://gisdevportal.tnt.sarawak.gov.my/arcgis/rest/services";

  urlUtils.addProxyRule({
    proxyUrl: proxyURL,
    urlPrefix,
  });

  const webmap = new WebMap({
    portalItem: {
      id: "41281c51f9de45edaf1c8ed44bb10e30",
    },
  });

  const view = new MapView({
    container: mapdiv.value,
    map: webmap,
    center: [110.358639, 1.530446], //Longitude, latitude
    zoom: 12,
  });

  const scalebar = new ScaleBar({
    view: view,
  });
  view.ui.add(scalebar, "bottom-left");

  const legend = new Legend({
    view: view,
  });
  view.ui.add(legend, "top-right");

  // Define a pop-up for Trailheads
  const popupTemplate = {
    title: "{device_name}",
    content: "<b>Council:</b> {device_council}<br>",
  };

  //Trailheads feature layer (points)
  const cctvLayer = new FeatureLayer({
    url: "https://gisdevportal.tnt.sarawak.gov.my/arcgis/rest/services/sioc/sioc_cctv/FeatureServer/0",
    outFields: ["device_name", "device_council"],
    popupTemplate: popupTemplate,
  });

  webmap.add(cctvLayer);

  let highlightSelect;

  view.whenLayerView(cctvLayer).then((layerView) => {
    const buttons = document.querySelectorAll("button");
    layerView.highlightOptions = {
      color: [255, 255, 0, 1], // bright yellow
      haloOpacity: 0.9,
      fillOpacity: 0.2,
    };

    buttons.forEach((button) => {
      button.addEventListener("click", onClick);
    });

    function onClick(event) {
      const query = cctvLayer.createQuery();
      console.log(event.target.innerText);
      query.where = `device_name='${event.target.innerText}'`;

      cctvLayer.queryFeatures(query).then((result) => {
        if (highlightSelect) {
          highlightSelect.remove();
        }

        const feature = result.features[0];
        console.log(feature.attributes);

        highlightSelect = layerView.highlight([feature.attributes["objectid"]]);

        view
          .goTo(
            {
              target: feature.geometry,
              zoom: 15,
            },
            {
              duration: 2000,
              easing: "ease-in-out",
            }
          )
          .catch((error) => {
            if (error.name !== "AbortError") {
              console.error(error);
            }
          });
      });
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
#paneDiv {
  position: absolute;
  bottom: 40px;
  width: 100%;
  text-align: center;
  background-color: transparent;
  color: black;
}

.esri-button-overwrite {
  width: auto;
  display: table-cell;
  margin: 4px;
  background-color: white;
  color: #0079c1;
}
</style>
