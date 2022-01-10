<template>
  <nav class="navigation">
    <slot></slot>
  </nav>
</template>

<style>
.navigation {
  position: relative;
  top: 0;
  left: 0;
  box-sizing: border-box;
  width: 10%;
  height: 100%;
  padding: 1em 1em;
  background-color: transparent;
  border-top: 3px solid rgb(200, 23, 216);
  box-shadow: 1px 0 5px #aaaaaa;
}

@media only screen and (min-width: 375px){
  .navigation {
    
    width: 100vw;
    height: 10vh;
  }
}

@media only screen and (min-width: 750px){
  .navigation {
    width: 10vw;
    height: 100vh;
  }
}

</style>
