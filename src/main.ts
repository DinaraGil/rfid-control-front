import './assets/styles/styles.scss'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

app.mount('#app')

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