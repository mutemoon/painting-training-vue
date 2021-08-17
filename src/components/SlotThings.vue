<template>
  <span>这里有个插槽：<slot></slot></span>
</template>

<script>
export default {
  name: "Things",
  props: {
    msg: String,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
