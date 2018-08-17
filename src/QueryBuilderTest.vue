<template>
  <section>
    <div>
      <query-builder-without-initial />
    </div>
    <div>
      <expansion-query-builder />
    </div>
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
  section > div {
    position: relative;
  }
</style>