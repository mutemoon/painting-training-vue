<template>
  <div class="navigation-second-item">
    <slot>
      <router-link :to="to">{{ title }}</router-link>
    </slot>
  </div>
</template>

<script>
export default {
  props: ["to", "title"],
};
</script>

<style scoped>
a {
  color: rgb(0, 0, 0);
  text-decoration: none;
  text-size-adjust: auto;
}
.navigation-second-item {
  margin: 1em 1em 1em 2em;
}
.router-link-active {
  color: rgb(200, 23, 216);
}

@media only screen and (min-width: 375px) {
  .navigation-second-item {
    display: inline-block;
  }
}

@media only screen and (min-width: 750px) {
  .navigation-second-item {
    display: block;
  }
}
</style>
