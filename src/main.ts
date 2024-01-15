import { createApp } from "vue";
import App from "./App.vue";
import "./main.css";
import router from "./router";

import { setAssetPath } from "@esri/calcite-components/dist/components";

setAssetPath(location.href);

createApp(App).use(router).mount("#app");
