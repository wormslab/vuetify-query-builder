<template>
  <section class="query-builder-group-container">
    <section class="query-builder-group-type">
      <span>다음</span>
      <div class="type-select-box">
        <v-select :items="types" v-model="query.operator" item-text="text" :disabled="query.children.length <= 0" item-value="value" single-line />
      </div>
      <span>규칙과 일치</span>
      <v-tooltip bottom>
        <v-btn slot="activator" icon @click="_handleClickAddGroup" :disabled="maxDepth <= depth"><v-icon color="grey">playlist_add</v-icon></v-btn>
        <span>{{addGroupText}}</span>
      </v-tooltip>
      <v-tooltip bottom>
        <v-btn slot="activator" icon @click="_handleClickAddRule"><v-icon color="grey">add_circle</v-icon></v-btn>
        <span>{{addRuleText}}</span>
      </v-tooltip>
      <v-tooltip bottom>
        <v-btn slot="activator" icon @click="_handleClickRemoveGroup(query.id)" v-if="depth > 1"><v-icon color="grey">cancel</v-icon></v-btn>
        <span>{{removeGroupText}}</span>
      </v-tooltip>
    </section>
    <draggable v-model="query.children" :options="{animation:150,handle:'.query-builder-drag-icon'}">
      <transition-group>
        <section class="query-builder-child" v-for="(child, index) in query.children" :key="index">
          <section class="query-builder-group-content" v-if="child.type === 'group'" :style="`margin-left: ${(depth - 1) * 41}px`">
            <v-icon class="query-builder-drag-icon">reorder</v-icon>
            <query-builder-group :ref="`group${index}`"
                                 :types="types"
                                 :operators="operators"
                                 :operands="operands"
                                 :depth="depth + 1"
                                 :position="index"
                                 :max-depth="maxDepth"
                                 :query="child.query"
                                 @change-operand="_handleChangeOperand"
                                 @change-operator="_handleChangeOperator"
                                 @change-value="_handleChangeValue"
                                 @remove-group="_handleRemoveGroup"
            />
          </section>
          <section class="query-builder-rule-content" v-if="child.type === 'rule'" :style="`margin-left: ${(depth - 1) * 41}px`">
            <v-icon class="query-builder-drag-icon">reorder</v-icon>
            <query-builder-rule :ref="`rule${index}`"
                                :index="`${position}${depth}${index}`"
                                :position="index"
                                :operators="operators"
                                :operands="operands"
                                :query="child.query"
                                @change-operand="_handleChangeOperand"
                                @change-operator="_handleChangeOperator"
                                @change-value="_handleChangeValue"
                                @enter-keyup="_handleEnterKeyUp"
            />
            <v-tooltip bottom>
              <v-btn slot="activator" icon @click="_handleClickRemoveRule(index)"><v-icon class="query-builder-rule-icon" color="grey">cancel</v-icon></v-btn>
              <span>{{removeRuleText}}</span>
            </v-tooltip>
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
      /**
       * query 의 종류를 표기하기 위한 후보 리스트
       * 현재는 'group' 과 'rule' 만 사용 함
       */
      types: {
        type: Array,
        required: true
      },
      /**
       * 연산자 리스트
       */
      operators: {
        type: Array,
        required: true
      },
      /**
       * 피연산자 리스트
       */
      operands: {
        type: Array,
        required: true
      },
      /**
       * type, operator, operand, value 를 포함하는 객체
       */
      query: {
        type: Object,
        required: true
      },
      /**
       * 그룹의 중첩을 지원하므로 자신이 몇번째 중첩인지를 표시
       * 제일 처음의 깊이는 1로 지정
       */
      depth: {
        type: Number,
        default: 1
      },
      /**
       * 쿼리의 복잡도나 API 지원여부에 따라서 최대 중첩 깊이를 제한할 수 있도록 함
       */
      maxDepth: {
        type: Number,
        default: 3
      },
      /**
       * 상위 그룹으로 부터 자신이 몇번째 인덱스에 위치하고 있는지 설명
       * 제일 처음의 그룹은 0으로 시작
       */
      position: {
        index: Number,
        default: 0
      },
      /**
       * TODO: I18N 지원을 위해 텍스를 별도로 받을 수 있도록 함
       */
      addGroupText: {
        type: String,
        default: '규칙 그룹을 추가합니다. 규칙 그룹은 여러개의 규칙에 대한 조건을 정의할 수 있습니다'
      },
      /**
       * TODO: I18N 지원을 위해 텍스를 별도로 받을 수 있도록 함
       */
      addRuleText: {
        type: String,
        default: '규칙을 추가 합니다'
      },
      /**
       * TODO: I18N 지원을 위해 텍스를 별도로 받을 수 있도록 함
       */
      removeGroupText: {
        type: String,
        default: '규칙 그룹을 삭제 합니다. 그룹에 포함된 모든 규칙이 함께 삭제 됩니다'
      },
      /**
       * TODO: I18N 지원을 위해 텍스를 별도로 받을 수 있도록 함
       */
      removeRuleText: {
        type: String,
        default: '규칙을 삭제 합니다'
      }
    },
    methods: {
      async validateAll () {
        const ret = {}
        for (const key of Object.keys(this.$refs)) {
          const inst = this.$refs[key][0]
          ret[key] = inst ? await inst.validateAll() : true
        }
        return ret
      },
      _handleClickAddGroup () {
        this.query.children.push({
          type: 'group',
          query: {
            operator: 'ALL',
            children: []
          }
        })
        this.$emit('add-group', this.query)
      },
      _handleClickAddRule () {
        this.query.children.push({
          type: 'rule',
          query: {
            operator: '',
            operand: '',
            value: '',
          }
        })
        this.$emit('add-rule', this.query)
      },
      _handleClickRemoveRule (index) {
        this.query.children.splice(index, 1)
        this.$emit('remove-rule', this.query)
      },
      _handleClickRemoveGroup (id) {
        this.$emit('remove-group', { id })
      },
      _handleRemoveGroup ({ id }) {
        const index = this.query.children.findIndex(v => v.id === id)
        this.query.children.splice(index, 1)
      },
      _handleChangeOperand (operand, query, positions) {
        this.$emit('change-operand', operand, query, positions)
      },
      _handleChangeOperator (operator, query, positions) {
        if (this.position !== 0) {
          positions.push(this.position)
        }
        this.$emit('change-operator', operator, query, positions)
      },
      _handleChangeValue (value, query, positions) {
        if (this.position !== 0) {
          positions.push(this.position)
        }
        this.$emit('change-value', value, query, positions)
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
