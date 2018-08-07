<template>
  <section class="query-builder-group-container">
    <section class="query-builder-group-type">
      <span>다음</span>
      <div class="type-select-box">
        <v-select :items="types" v-model="query.operator" item-text="text" :disabled="query.children.length <= 0" item-value="value" single-line />
      </div>
      <span>규칙와 일치</span>
      <v-btn icon @click="_handleClickAddGroup" :disabled="maxDepth <= depth"><v-icon color="grey">playlist_add</v-icon></v-btn>
      <v-btn icon @click="_handleClickAddRule"><v-icon color="grey">add_circle</v-icon></v-btn>
      <v-btn icon @click="_handleClickRemoveGroup(query.id)" v-if="depth > 1"><v-icon color="grey">cancel</v-icon></v-btn>
    </section>
    <draggable v-model="query.children" :options="{animation:150,handle:'.query-builder-drag-icon'}">
      <transition-group>
        <section class="query-builder-child" v-for="(child, index) in query.children" :key="index">
          <section class="query-builder-group-content" v-if="child.type === 'group'" :style="`margin-left: ${(depth - 1) * 41}px`">
            <v-icon class="query-builder-drag-icon">reorder</v-icon>
            <query-builder-group :types="types"
                                 :operators="operators"
                                 :operands="operands"
                                 :depth="depth + 1"
                                 :max-depth="maxDepth"
                                 :query="child.query"
                                 @remove-group="_handleRemoveGroup"
            />
          </section>
          <section class="query-builder-rule-content" v-if="child.type === 'rule'" :style="`margin-left: ${(depth - 1) * 41}px`">
            <v-icon class="query-builder-drag-icon">reorder</v-icon>
            <query-builder-rule :operators="operators"
                                :operands="operands"
                                :query="child.query"
                                @enter-keyup="_handleEnterKeyUp"
            />
            <v-btn icon @click="_handleClickRemoveRule(index)"><v-icon class="query-builder-rule-icon" color="grey">cancel</v-icon></v-btn>
          </section>
        </section>
      </transition-group>
    </draggable>
  </section>
</template>

<script>
  import draggable from 'vuedraggable'
  import QueryBuilderGroup from './QueryBuilderGroup.vue'
  import QueryBuilderRule from './QueryBuilderRule.vue'
  export default {
    name: 'query-builder-group',
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
      query: {
        type: Object,
        required: true
      },
      depth: {
        type: Number,
        default: 1
      },
      maxDepth: {
        type: Number,
        default: 3
      }
    },
    methods: {
      _handleClickAddGroup () {
        this.query.children.push({
          type: 'group',
          query: {
            operator: 'ALL',
            children: []
          }
        })
      },
      _handleClickAddRule () {
        this.query.children.push({
          type: 'rule',
          query: {
            operator: '',
            operand: '',
            value: '',
            operandError: '',
            operatorError: '',
            valueError: '',
            typeError: ''
          }
        })
      },
      _handleClickRemoveRule (index) {
        this.query.children.splice(index, 1)
      },
      _handleClickRemoveGroup (id) {
        this.$emit('remove-group', { id })
      },
      _handleRemoveGroup ({ id }) {
        const index = this.query.children.findIndex(v => v.id === id)
        this.query.children.splice(index, 1)
      },
      _handleEnterKeyUp (event) {
        this.$emit('enter-keyup', event)
      }
    },
    components: {
      QueryBuilderGroup,
      QueryBuilderRule,
      draggable
    }
  }

</script>

<style scoped>
  .query-builder-group-type {
    display: flex;
    align-items: center;
  }
  .query-builder-group-type > .type-select-box {
    width: 200px;
    margin: 0 21px;
  }
  .query-builder-group-type {
    display: flex;
    align-items: center;
  }
  .query-builder-group-type > .query-builder-drag-icon {
    margin-right: 21px;
  }
  .query-builder-group-content {
    display: flex;
    align-items: flex-start;
  }
  .query-builder-group-content > .query-builder-drag-icon {
    margin-right: 21px;
    margin-top: 21px;
  }
  .query-builder-rule-content {
    display: flex;
    align-items: center;
  }
  .query-builder-rule-content > .query-builder-drag-icon {
    margin-right: 21px;
  }
  .query-builder-child {
    background-color: #EFEFEF;
    padding: 0 11px;
  }
  .query-builder-drag-icon {
    cursor: pointer;
  }
</style>
