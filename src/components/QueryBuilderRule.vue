<template>
  <section class="query-builder-rule-container">
    <div class="operand-select-box">
      <v-select :items="operands"
                v-model="query.operand"
                :error-messages="errors.collect(`피연산자-${index + 1}`)"
                v-validate="validateOperand"
                :data-vv-name="`피연산자-${index + 1}`"
                :item-text="itemText"
                :item-value="itemValue"
                single-line
                @change="_handleChangeOperand"
      />
    </div>
    <div class="operator-select-box">
      <v-select :items="_operators"
                v-model="query.operator"
                :error-messages="errors.collect(`연산자-${index + 1}`)"
                v-validate="validateOperator"
                :data-vv-name="`연산자-${index + 1}`"
                :item-text="itemText"
                :item-value="itemValue"
                single-line
                @change="_handleChangeOperator"
      />
    </div>
    <div class="value-text-field" v-if="!unaryOperators.includes(query.operator)">
      <v-select v-if="queryValues(query)"
                :error-messages="errors.collect(`필터값-${index + 1}`)"
                v-validate="validateValue"
                :data-vv-name="`필터값-${index + 1}`"
                :items="queryValues(query)"
                v-model="query.value"
                :item-text="itemText"
                :item-value="itemValue"
                single-line
                @change="_handleChangeValues"
      />
      <v-text-field v-else
                    v-model="query.value"
                    :error-messages="errors.collect(`필터값-${index + 1}`)"
                    v-validate="validateValue"
                    :data-vv-name="`필터값-${index + 1}`"
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
      index: {
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
      async validateAll () {
        return await this.$validator.validateAll()
      },
      _handleChangeOperand (value) {
        const item = this.operands.find(v => v.value === value)
        this.query.operator = this.operators[0].value
        this.query.value = ''
        this.$forceUpdate()
      },
      _handleChangeOperator (value) {
        this.$forceUpdate()
      },
      _handleChangeValues () {
        this.$forceUpdate()
      },
      _handleChangeValue (value) {
        if (value.length > 0) {
          this.$forceUpdate()
        }
      },
      _handleEnterKeyUp (event) {
        if (event && event.code === 'Enter') {
          this.$emit('enter-keyup', event)
        }
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
