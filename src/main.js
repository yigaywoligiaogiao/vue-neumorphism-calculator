import Vue from 'vue'
import App from './App.vue'
import calculator from './plugins/calculator'

Vue.use(calculator)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
