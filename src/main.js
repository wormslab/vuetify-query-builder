import Vue from 'vue'
import Vuetify from 'vuetify'
import QueryBuilderTest from './QueryBuilderTest.vue'
import 'vuetify/dist/vuetify.css'

Vue.use(Vuetify)
Vue.component('query-builder-test', QueryBuilderTest)
Vue.config.productionTip = false

new Vue({
  render: (h) => h('v-app', [
    h('div', { attrs: { style: 'width: 100%; height: 100%' } }, [
      h('query-builder-test')
    ])
  ])
}).$mount('#app')
