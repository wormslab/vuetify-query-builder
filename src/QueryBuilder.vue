<template>
  <section class="query-builder-container">
    <query-builder-group ref="group"
                         :types="types"
                         :operators="operators"
                         :operands="operands"
                         :depth="1"
                         :query="query"
                         :max-depth="maxDepth"
                         @add-group="_handleAddGroup"
                         @remove-group="_handleRemoveGroup"
                         @add-rule="_handleAddRule"
                         @remove-rule="_handleRemoveRule"
                         @change-operand="_handleChangeOperand"
                         @change-operator="_handleChangeOperator"
                         @change-value="_handleChangeValue"
                         @enter-keyup="_handleEnterKeyUp"
    />
    <slot name="limit">
      <section class="query-builder-limit">
        <span>페이지당</span>
        <div class="limit-select-box">
          <v-select :items="limits" v-model="query.limit" item-text="text" item-value="value" single-line />
        </div>
        <span>개 노출</span>
      </section>
    </slot>
    <slot name="date-range">
      <section class="query-builder-date">
        <span class="label-text">{{periodLabel}}</span>
        <v-menu ref="startMenu"
                lazy
                :close-on-content-click="false"
                v-model="startMenu"
                transition="scale-transition"
                offset-y
                full-width
                :nudge-right="40"
                min-width="290px"
                :return-value.sync="query.from"
        >
          <v-text-field slot="activator"
                        label="From"
                        v-model="query.from"
                        prepend-icon="event"
                        readonly
          ></v-text-field>
          <v-date-picker v-model="query.from" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="startMenu = false">Cancel</v-btn>
            <v-btn flat color="primary" @click="$refs.startMenu.save(query.from)">OK</v-btn>
          </v-date-picker>
        </v-menu>
        <span class="tilt"> ~ </span>
        <v-menu ref="endMenu"
                lazy
                :close-on-content-click="false"
                v-model="endMenu"
                transition="scale-transition"
                offset-y
                full-width
                :nudge-right="40"
                min-width="290px"
                :return-value.sync="query.to"
        >
          <v-text-field slot="activator"
                        label="To"
                        v-model="query.to"
                        prepend-icon="event"
                        readonly
          ></v-text-field>
          <v-date-picker v-model="query.to" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="endMenu = false">Cancel</v-btn>
            <v-btn flat color="primary" @click="$refs.endMenu.save(query.to)">OK</v-btn>
          </v-date-picker>
        </v-menu>
        <v-menu open-on-hover top offset-y>
          <v-btn slot="activator" small outline fab color="primary" dark><v-icon>date_range</v-icon></v-btn>
          <v-list>
            <v-list-tile v-for="(item, index) in dateRanges" :key="index" @click="_handleClickDateRange(-item.value, item.unit)">
              <v-list-tile-title>{{ item.text }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </section>
    </slot>
    <slot name="custom-error"></slot>
    <v-btn color="primary" style="margin-left: -1px" @click="_handleClickSearch">
      <v-icon left>search</v-icon>
      <span>{{searchText}}</span>
    </v-btn>
    <v-btn color="primary" @click="_handleClickClear">
      <v-icon left>clear_all</v-icon>
      <span>{{clearText}}</span>
    </v-btn>
  </section>
</template>

<script>
  import Vue from 'vue'
  import VeeValidate from 'vee-validate'
  import ko from 'vee-validate/dist/locale/ko.js'
  import moment from 'moment'
  import QueryBuilderGroup from './components/QueryBuilderGroup'

  Vue.use(VeeValidate, {
    locale: 'ko',
    dictionary: {
      ko
    }
  })

  function dupQuery (q) {
    return JSON.parse(JSON.stringify(q))
  }

  export default {
    created () {
      this.$validator.extend('in', {
        getMessage (field, params) {
          return `${field} 값은 ${params.join(', ')} 중 하나여야 합니다`
        },
        validate (value, target) {
          return target.includes(value)
        },
        hasTarget: true
      })
      this.$validator.extend('date', {
        getMessage (field) {
          return `${field} 값은 YYYY-MM-DD 형식이어야 합니다`
        },
        validate (value) {
          const reg = /[0-9]{4}-[0-9]{2}-[0-9]{2}/
          return reg.test(value) && moment(value).isValid()
        }
      })
      this.$validator.extend('datetime', {
        getMessage (field) {
          return `${field} 값은 YYYY-MM-DD HH:mm:ss 형식이어야 합니다`
        },
        validate (value) {
          const reg = /[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}/
          return reg.test(value) && moment(value).isValid()
        }
      })
    },
    data () {
      return {
        startMenu: false,
        endMenu: false,
        limits: this._limits,
        query: dupQuery(this._query),
        dateRanges: this._dateRanges
      }
    },
    props: {
      types: {
        type: Array,
        required: true
      },
      operators: {
        type: Array,
        required: true
      },
      operands: {
        type: Array,
        required: true
      },
      _limits: {
        type: Array,
        default () {
          return [ 5, 10, 25, 50, 100 ]
        }
      },
      _dateRanges: {
        type: Array,
        default () {
          return [
            { text: '1 주일', value: '1', unit: 'week' },
            { text: '2 주일', value: '2', unit: 'week' },
            { text: '3 주일', value: '3', unit: 'week' },
            { text: '1 개월', value: '1', unit: 'month' },
            { text: '2 개월', value: '2', unit: 'month' },
            { text: '3 개월', value: '3', unit: 'month' },
            { text: '6 개월', value: '6', unit: 'month' },
            { text: '12 개월', value: '12', unit: 'month' }
          ]
        }
      },
      _query: {
        type: Object,
        default () {
          return {
            operator: 'ALL',
            limit: 10,
            from: moment().add(-1, 'year').format('YYYY-MM-DD'),
            to: moment().add(1, 'year').format('YYYY-MM-DD'),
            children: []
          }
        }
      },
      maxDepth: {
        type: Number,
        default: 3
      },
      periodLabel: {
        type: String,
        default: '기간'
      },
      searchText: {
        type: String,
        default: '검색'
      },
      clearText: {
        type: String,
        default: '초기화'
      }
    },
    methods: {
      async _handleClickSearch () {
        const valid = await this.$refs.group.validateAll()
        this.$emit('search', dupQuery(this.query), valid)
      },
      _handleClickClear () {
        const query = dupQuery(this._query)
        this.query = query
        this.$emit('clear', query)
      },
      _handleEnterKeyUp () {
        this._handleClickSearch()
      },
      _handleClickDateRange (value, unit) {
        const format = 'YYYY-MM-DD'
        const current = moment().format(format)
        const start = moment().add(value, unit).format(format)
        this.query.from = start
        this.query.to = current
      },
      _handleAddGroup () {
        this.$emit.call(this, 'add-group', ...arguments)
      },
      _handleRemoveGroup () {
        this.$emit.call(this, 'remove-group', ...arguments)
      },
      _handleAddRule (rule) {
        this.$emit.call(this, 'add-rule', ...arguments)
      },
      _handleRemoveRule (rule) {
        this.$emit.call(this, 'remove-rule', ...arguments)
      },
      _handleChangeOperand () {
        this.$emit.call(this, 'change-operand', ...arguments)
      },
      _handleChangeOperator () {
        this.$emit.call(this, 'change-operator', ...arguments)
      },
      _handleChangeValue () {
        this.$emit.call(this, 'change-value', ...arguments)
      }
    },
    watch: {
      '_query': {
        handler () {
          this.query = dupQuery(this._query)
        },
        deep: true
      }
    },
    components: {
      QueryBuilderGroup
    }
  }
</script>

<style scoped>
  .query-builder-limit {
    display: flex;
    align-items: center;
  }
  .query-builder-limit > .limit-select-box {
    width: 200px;
    margin: 0 21px;
  }
  .query-builder-date {
    display: flex;
    align-items: center;
  }
  .query-builder-date > .tilt {
    margin: 21px;
  }
  .query-builder-date > .label-text {
    margin-right: 21px;
  }
</style>
