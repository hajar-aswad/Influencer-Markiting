<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
/* Add your global styles here */
#app {

  height: 100vh; /* Full viewport height */
  display: flex;
  flex-direction: column;
}
</style>
