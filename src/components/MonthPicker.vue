<template>
  <section class="month-picker-container">
    <v-menu ref="menu"
            :close-on-content-click="false"
            v-model="menu"
            :nudge-right="40"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            max-width="290px"
            min-width="290px"
            :disabled="disabled"
    >
      <v-text-field slot="activator"
                    :value="date"
                    :label="label"
                    :hint="hint"
                    persistent-hint
                    :name="label"
                    readonly
                    :error-messages="errors.collect(label)"
                    v-validate="'required|date_format:YYYY-MM'"
                    data-vv-validate-on="input"
                    :data-vv-name="label"
                    prepend-icon="event"
                    :disabled="disabled"
      ></v-text-field>
      <v-date-picker :value="date"
                     type="month"
                     locale="ko-kr"
                     @input="menu = false"
                     @change="save"
      ></v-date-picker>
    </v-menu>
  </section>
</template>

<script>
  import moment from 'moment'
  const current = moment()
  const currentMonth = current.format('YYYY-MM')
  export default {
    data () {
      return {
        menu: false
      }
    },
    props: {
      hint: {
        type: String,
        default: null
      },
      label: {
        type: String,
        default: 'Date'
      },
      date: {
        type: String,
        default: currentMonth
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      save (date) {
        this.$emit('save', date)
      }
    }
  }
</script>

<style scoped>

</style>