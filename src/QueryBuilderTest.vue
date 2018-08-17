<template>
  <section>
    <query-builder-without-initial />
    <expansion-query-builder />
  </section>
</template>

<script>
  import QueryBuilderWithoutInitial from './example/QueryBuilderWithoutInitial'
  import ExpansionQueryBuilder from './example/ExpansionQueryBuilder'
  export default {
    components: {
      QueryBuilderWithoutInitial,
      ExpansionQueryBuilder
    }
  }
</script>

<style scoped>

</style>