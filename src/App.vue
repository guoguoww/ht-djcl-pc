<template>
  <div id="app">
    <headerC></headerC>

    <router-view></router-view>
  </div>
</template>

<script>
  import headerC from '@/components/headerC.vue';
  export default {
    name: 'App',
    components: {
      headerC,
    },

  }
</script>

<style lang="less">

</style>
