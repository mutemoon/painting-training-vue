<template>
  <div>
    <h2>一些计算器</h2>
    <router-link to='/calculator/calcbill'>账单计算</router-link>
    <router-link to='/calculator/calcdamage'>伤害计算</router-link>
    <router-view/>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
</style>
