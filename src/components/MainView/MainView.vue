<template>
  <div class="view">
    <slot><h2>我是view</h2></slot>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.view {
  position: relative;
  top: 0;
  left: 10%;
  box-sizing: border-box;
  width: 90%;
  height: 100%;
  padding: 1em;
}
</style>
