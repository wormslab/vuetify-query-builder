<template>
  <section class="query-builder-rule-container">
    <div class="operand-select-box">
      <v-select :items="operands"
                :item-disabled="itemDisabled"
                v-model="query.operand"
                :error-messages="errors.collect(`피연산자-${index}`)"
                v-validate="validateOperand"
                :data-vv-name="`피연산자-${index}`"
                :item-text="itemText"
                :item-value="itemValue"
                single-line
                @change="_handleChangeOperand"
      />
    </div>
    <div class="operator-select-box">
      <v-select :items="_operators"
                :item-disabled="itemDisabled"
                v-model="query.operator"
                :error-messages="errors.collect(`연산자-${index}`)"
                v-validate="validateOperator"
                :data-vv-name="`연산자-${index}`"
                :item-text="itemText"
                :item-value="itemValue"
                single-line
                @change="_handleChangeOperator"
      />
    </div>
    <div class="value-text-field" v-if="!unaryOperators.includes(query.operator)">
      <v-select v-if="queryValues(query)"
                :error-messages="errors.collect(`필터값-${index}`)"
                v-validate="validateValue"
                :data-vv-name="`필터값-${index}`"
                :items="queryValues(query)"
                :item-disabled="itemDisabled"
                v-model="query.value"
                :item-text="itemText"
                :item-value="itemValue"
                single-line
                @change="_handleChangeValue"
      />
      <v-text-field v-else
                    v-model="query.value"
                    :error-messages="errors.collect(`필터값-${index}`)"
                    v-validate="validateValue"
                    :data-vv-name="`필터값-${index}`"
                    @input="_handleChangeValue"
                    @keyup.native="_handleEnterKeyUp"
      />
    </div>
  </section>
</template>

<script>
  export default {
    data () {
      return {
        unaryOperators: [ '$null', '$not_null' ]
      }
    },
    props: {
      /**
       * 
       */
      index: {
        type: String,
        default: '0'
      },
      position: {
        type: Number,
        default: 0
      },
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
      validateAll () {
        return this.$validator.validateAll()
      },
      _handleChangeOperand (operand) {
        // 피연산자를 선택했을 때 연산자가 지정되어 있지 않다면 첫번째 값을 자동으로 입력
        if (!this.operator) {
          this.query.operator = this.operators[0].value
        }
        // 피연산자를 선택 했을 때 필터 값을 초기화
        this.query.value = ''
        this.$emit('change-operand', operand, this.query, [ this.position ])
      },
      _handleChangeOperator (operator) {
        this.$emit('change-operator', operator, this.query, [ this.position ])

      },
      _handleChangeValue (value) {
        this.$emit('change-value', value, this.query, [ this.position ])
      },
      _handleEnterKeyUp (event) {
        if (event && event.code === 'Enter') {
          this.$emit('enter-keyup', event)
        }
      },
      itemDisabled (select) {
        return select.disabled || false
      },
      queryValues (query) {
        if (!query.operand) {
          return null
        }
        const operand = this.operands.find(v => v.value === query.operand)
        return operand.values
      }
    },
    computed: {
      validateOperand () {
        return this.query.validateOperand || 'required'
      },
      validateOperator () {
        return this.query.validateOperator || 'required'
      },
      validateValue () {
        const op = this.operands.find(v => v.value === this.query.operand)
        const validators = {
          required: true
        }

        if (op && op.type === 'number') {
          validators['numeric'] = true
        } else if (op && op.type === 'boolean') {
          validators['in'] = [ true, false ]
        } else if (op && op.type === 'date') {
          validators['date'] = true
        } else if (op && op.type === 'datetime') {
          validators['datetime'] = true
        }

        return this.query.validateValue || validators
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
    flex-wrap: wrap;
  }
  .query-builder-rule-container > div {
    flex: 1 1 0;
    margin-right: 21px;
    width: 250px;
  }
</style>
