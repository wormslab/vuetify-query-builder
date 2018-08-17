<template>
  <section>
    <query-builder :types="types"
                   :operators="operators"
                   :operands="operands"
                   :max-depth="3"
                   :_query="query"
                   :display="mode"
                   @click-expand="() => mode = mode === 'simple' ? 'custom' : 'simple'"
                   @search="_handleSearch"
    />
    <div style="height: 300px; background-color: #BBB"></div>
  </section>
</template>

<script>
  import QueryBuilder from '../QueryBuilder'
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
    },
    { text: 'BOOL', value: 'bool_test', type: 'boolean', values: [
        { text: 'True', value: true },
        { text: 'False', value: false },
        { text: 'Must fail', value: 'true1' },
      ]
    },
    { text: 'DATE', value: 'date_test', type: 'date' },
    { text: 'DATETIME', value: 'datetime_test', type: 'datetime' }
  ]
  export default {
    data() {
      return {
        mode: 'simple',
        types,
        operators,
        operands,
        query: {
          from: '2018-03-01',
          to: '2018-03-31',
          operator: 'ALL',
          limit: 10,
          children: [
            { type: 'rule', query: { operand: 'id', operator: '$eq', value: '123', type: 'number' } }
          ]
        }
      }
    },
    methods: {
      _handleSearch (query, validator) {
        console.log(query, validator)
      }
    },
    components: {
      QueryBuilder
    }
  }
</script>

<style scoped>

</style>
