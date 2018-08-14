<template>
  <section class="query-builder-rule-container">
    <div class="operand-select-box">
      <v-select :items="operands"
                v-model="query.operand"
                :item-text="itemText"
                :item-value="itemValue"
                single-line
                @change="_handleChangeOperand"
                :error-messages="operandError"
      />
    </div>
    <div class="operator-select-box">
      <v-select :items="_operators"
                v-model="query.operator"
                :item-text="itemText"
                :item-value="itemValue"
                single-line
                @change="_handleChangeOperator"
                :error-messages="operatorError"
      />
    </div>
    <div class="value-text-field" v-if="!unaryOperators.includes(query.operator)">
      <v-select v-if="query.values"
                :items="query.values"
                v-model="query.value"
                :item-text="itemText"
                :item-value="itemValue"
                single-line
                @change="_handleChangeValues"
      />
      <v-text-field v-else v-model="query.value" @input="_handleChangeValue" @keyup.native="_handleEnterKeyUp" :error-messages="valueError"/>
    </div>
  </section>
</template>

<script>
  import _ from 'underscore'
  export default {
    data () {
      return {
        unaryOperators: [ '$null', '$not_null' ]
      }
    },
    props: {
      operators: {
        type: Array,
        required: true
      },
      operands: {
        type: Array,
        required: true
      },
      query: {
        type: Object,
        required: true
      },
      itemText: {
        type: String,
        default: 'text'
      },
      itemValue: {
        type: String,
        default: 'value'
      }
    },
    methods: {
      _handleChangeOperand (value) {
        const item = this.operands.find(v => v.value === value)
        if (item) {
          this.query.type = item.type
          this.query.values = item.values
          this.query.operandError = ''
          this.$forceUpdate()
        }
      },
      _handleChangeOperator (value) {
        const item = this.operators.find(v => v.value === value)
        if (item) {
          this.query.operatorError = ''
          this.$forceUpdate()
        }
      },
      _handleChangeValues () {
        this.query.valueError = ''
        this.$forceUpdate()
      },
      _handleChangeValue (value) {
        if (value.length > 0) {
          this.query.valueError = ''
          this.$forceUpdate()
        }
      },
      _handleEnterKeyUp (event) {
        if (event && event.code === 'Enter') {
          this.$emit('enter-keyup', event)
        }
      }
    },
    computed: {
      operandError () {
        return _.isEmpty(this.query.operandError) ? [] : [ this.query.operandError ]
      },
      operatorError () {
        return _.isEmpty(this.query.operatorError) ? [] : [ this.query.operatorError ]
      },
      valueError () {
        return _.isEmpty(this.query.valueError) ? [] : [ this.query.valueError ]
      },
      _operators () {
        const operandObject = this.operands.find(v => v.value === this.query.operand)
        if (operandObject && Array.isArray(operandObject.operator)) {
          return this.operators.filter(v => operandObject.operator.includes(v.value))
        }
        return this.operators
      }
    }
  }
</script>

<style scoped>
  .query-builder-rule-container {
    display: flex;
    align-items: center;
    position: relative;
  }
  .query-builder-rule-container > div {
    flex: 1 1 0;
    margin-right: 21px;
  }
</style>
