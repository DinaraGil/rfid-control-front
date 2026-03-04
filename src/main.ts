import './assets/styles/styles.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
//import { useUserStore } from '@/stores/user'
import App from './App.vue'
import router from './router'

const pinia = createPinia();
const app = createApp(App);

app.use(router);
app.use(pinia);

// const initAuth = () => {
//     const userStore = useUserStore();
//     const token = localStorage.getItem('token');
//     const username = 

//     if (token) {
//         userStore.token = token;
//         userStore.isAuthenticated = true;
//     }
// };

app.mount('#app');

//initAuth();

// import Vue from 'vue'
// import App from './App.vue'
// import router from './router'
// import Axios from 'axios'

// Vue.prototype.$http = Axios
// Vue.config.productionTip = false

// new Vue({
//     el: '#app',
//     router,
//     components: { App },
//     template: '<App/>'
// })