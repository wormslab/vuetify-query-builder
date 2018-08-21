<template>
  <section>
    <div>
      <query-builder-without-initial />
    </div>
  </section>
</template>

<script>
  import QueryBuilderWithoutInitial from './example/QueryBuilderWithoutInitial'
  export default {
    components: {
      QueryBuilderWithoutInitial
    }
  }
</script>

<style scoped>
  section > div {
    position: relative;
  }
</style>