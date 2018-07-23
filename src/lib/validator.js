import _ from 'underscore'

export function validateQuery (query, { operands }) {
  function validateGroup (group) {
    let valid = true
    if (group.operator !== 'ALL' && group.operator !== 'ANY') {
      valid = false
      group.error = '그룹 연산자는 "전체" 혹은 "일부" 만 가능합니다'
    }
    group.children.forEach(child => {
      if (child.type === 'rule') {
        const { operator, operand, value, type } = child.query
        const operandObject = operands.find(v => v.value === operand)
        if (_.isEmpty(operator)) {
          valid = false
          child.query.operatorError = '연산자를 선택해주세요'
        }
        if (operandObject && Array.isArray(operandObject.operator) && !operandObject.operator.includes(operator)) {
          valid = false
          child.query.operatorError = '연산자를 선택해주세요'
        }
        if (_.isEmpty(operand)) {
          valid = false
          child.query.operandError = '피 연산자를 선택해주세요'
        }
        const phoneRegexp = /^[0-9]+$/
        if ([ 'CUSTOMER_PHONE', 'USER_PHONE' ].includes(operand) && !phoneRegexp.test(value)) {
          valid = false
          child.query.valueError = '전화번호는 숫자만 넣어서 검색해주세요 ex) 01012345678'
        }
        /* eslint-disable */
        const emailRegexp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        /* eslint-enable */
        if ([ 'CUSTOMER_EMAIL', 'USER_EMAIL' ].includes(operand) && !emailRegexp.test(value)) {
          valid = false
          child.query.valueError = 'E-MAIL 형식이 맞지 않습니다   ex) foo@yanolja.com'
        }

        if ( ![ '$null', '$not_null'].includes(operator) && (_.isNull(value) || _.isUndefined(value) || _.isEmpty(String(value)))) {
          valid = false
          child.query.valueError = '필터링 값을 입력해주세요'
        }
        if (![ 'number', 'string', 'date', 'boolean' ].includes(type)) {
          valid = false
          child.query.typeError = '피연산자 타입 지정이 잘못되었습니다. 개발자에게 연락해주세요'
        }
      } else if (child.type === 'group') {
        valid = valid ? validateGroup(child.query) : valid
      }
    })
    return valid
  }

  const valid = validateGroup(query)
  return valid
}
