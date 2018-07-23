<template>
  <section class="query-builder-container">
    <query-builder-group :types="types"
                         :operators="operators"
                         :operands="operands"
                         :depth="1"
                         :query="query"
                         @enter-keyup="_handleEnterKeyUp"
    />
    <section class="query-builder-limit">
      <span>페이지당</span>
      <div class="limit-select-box">
        <v-select :items="limits" v-model="query.limit" item-text="text" item-value="value" single-line />
      </div>
      <span>개 노출</span>
    </section>
    <section class="query-builder-date">
      <span class="label-text">기간</span>
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
      <v-btn small color="primary ml-2" @click="_handleClickDateRange(-1, 'week')">1 주일</v-btn>
      <v-btn small color="primary ml-2" @click="_handleClickDateRange(-1, 'month')">1 개월</v-btn>
      <v-btn small color="primary ml-2" @click="_handleClickDateRange(-2, 'month')">2 개월</v-btn>
      <v-btn small color="primary ml-2" @click="_handleClickDateRange(-3, 'month')">3 개월</v-btn>
      <v-btn small color="primary ml-2" @click="_handleClickDateRange(-6, 'month')">6 개월</v-btn>
      <v-btn small color="primary ml-2" @click="_handleClickDateRange(-12, 'month')">12 개월</v-btn>
    </section>
    <v-btn color="primary" style="margin-left: -1px" @click="_handleClickSearch">
      <v-icon left>search</v-icon>
      <span>검색</span>
    </v-btn>
    <v-btn color="primary" @click="_handleClickClear">
      <v-icon left>clear_all</v-icon>
      <span>초기화</span>
    </v-btn>
  </section>
</template>

<script>
  import moment from 'moment'
  import QueryBuilderGroup from './components/QueryBuilderGroup'
  import { validateQuery } from './lib/validator'
  import { dupQuery } from './lib/query-helper'
  export default {
    data () {
      return {
        startMenu: false,
        endMenu: false,
        limits: this._limits,
        query: dupQuery(this._query)
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

      },
      _limits: {
        type: Array,
        default () {
          return [ 5, 10, 25, 50, 100 ]
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
      }
    },
    methods: {
      _handleClickSearch () {
        const valid = validateQuery(this.query, { types: this.types, operands: this.operands, operators: this.operators })
        if (!valid) {
          return
        }
        this.$emit('search', dupQuery(this.query))
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
