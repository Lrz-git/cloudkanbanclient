<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  user-select: none;
}
body {
  margin: 0;
  font-family: "Microsoft YaHei";
  font-size: 0.9rem;
  /* background-color: #f7f7f7; */
}
</style>
<script>
import { initDynamicRoutes } from './router/index.js'

export default {
  created () {
    initDynamicRoutes();
  }
}
</script>
