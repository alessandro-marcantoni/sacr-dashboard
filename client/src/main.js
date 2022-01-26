import { createApp } from 'vue'
import App from './App.vue'
import axios from "axios";
import VueAxios from "vue-axios";

export const host = "http://localhost:3000"

createApp(App).use(VueAxios, axios).mount('#app')
