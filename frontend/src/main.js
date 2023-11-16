import { createApp } from "vue";
import App from "./App.vue";
import "bootstrap/dist/css/bootstrap.min.css";
import MoshaToast from "mosha-vue-toastify";
import "mosha-vue-toastify/dist/style.css";
import config from "./configs/systemConfig.json";

const app = createApp(App);

app.config.globalProperties.$config = config;

app.use(MoshaToast).mount("#app");
