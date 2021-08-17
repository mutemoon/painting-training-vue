<template>
  <nav class="navigation">
    <slot></slot>
  </nav>
</template>

<style>
.navigation {
  position: fixed;
  top: 0;
  left: 0;
  box-sizing: border-box;
  width: 10%;
  height: 100%;
  padding: 1em 1em;
  background-color: rgb(255, 255, 255);
  border-top: 3px solid rgb(200, 23, 216);
  box-shadow: 1px 0 5px #aaaaaa;
}
</style>
