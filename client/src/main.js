import { createApp } from 'vue'
import App from './App.vue'
import axios from "axios";
import VueAxios from "vue-axios";
import io from "socket.io-client"

export const host = "http://localhost:3000"
export const socket = io(host)

createApp(App)
    .use(VueAxios, axios)
    .mount('#app')
