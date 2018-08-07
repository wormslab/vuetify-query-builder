import Vue from 'vue'
import Vuetify from 'vuetify'
import QueryBuilder from './QueryBuilder.vue'
import 'vuetify/dist/vuetify.css'

Vue.use(Vuetify)
Vue.component('query-builder', QueryBuilder)
Vue.config.productionTip = false

const types = [
  { text: '전체', value: 'ALL' },
  { text: '일부', value: 'ANY' }
]
const operators = [
  { text: '=', value: '$eq' },
  { text: '!=', value: '$ne' },
  { text: '>', value: '$gt' },
  { text: '<', value: '$lt' },
  { text: 'LIKE', value: '$like' },
  { text: 'NULL', value: '$null' },
  { text: 'NOT NULL', value: '$not_null' },
]
const operands = [
  { text: '아이디', value: 'id', type: 'number' },
  { text: '관리자 ID', value: 'admin_id', type: 'number' },
  { text: '관리자 이름', value: 'admin_name', type: 'string' },
  { text: '리소스', value: 'resource', type: 'string', values: [
      { text: '컨텐츠', value: 'contents' },
      { text: '컨텐츠 옵션', value: 'contents_options' },
      { text: '컨텐츠 옵션 아이템', value: 'contents_options_items' },
      { text: '주문', value: 'order' },
    ]
  },
  { text: '액션', value: 'action', type: 'string', values: [
      { text: '동기화시작', value: 'start_sync_list_item' },
      { text: '동기화종료', value: 'end_sync_list_item' },
      { text: '리스트동기화', value: 'sync_list_item' },
      { text: '존재하지 않는 아이템 삭제', value: 'delete_non_exist_items' },
      { text: '컨텐츠 불일치', value: 'different_item' },
      { text: '전체 동기화', value: 'sync_entire_item' },
      { text: '단일 컨텐츠 동기화', value: 'sync_single_item' },
      { text: '증분 동기화', value: 'sync_incremental_item' },
      { text: '코드 재전송', value: 'resend_code' },
      { text: '알림톡 재전송', value: 'resend_notice' },
    ]
  }
]

new Vue({
  render: (h) => h('v-app', [
    h('div', { attrs: { style: 'width: 600px' } }, [
      h('query-builder', { class: 'elevation-1 ma-3 pa-3', attrs: { types, operators, operands, maxDepth: 1 } })
    ])
  ])
}).$mount('#app')
