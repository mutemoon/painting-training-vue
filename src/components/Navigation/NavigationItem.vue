<template>
  <div class="navigation-item">
    <slot>
      <router-link :to="to">{{title}}</router-link>
    </slot>
  </div>
</template>

<script>
export default {
  props: ["to", "title"]
}
</script>

<style scoped>
a {
  color: rgb(0, 0, 0);
  text-decoration: none;
  text-size-adjust: auto;
  font-weight: bold;
}
.navigation-item {
  margin: 1em 1em 1em 1em;
}
.router-link-active {
  color: rgb(200, 23, 216);
}
</style>
