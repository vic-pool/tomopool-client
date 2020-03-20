<template>
  <div class="wrapper">
    <div class="side-bar">
    </div>
    <div class="main-content" :data="sidebarBackground">
      <dashboard-navbar></dashboard-navbar>
      <div>
        <fade-transition :duration="200" origin="center top" mode="out-in">
          <!-- your content here -->
          <router-view></router-view>
        </fade-transition>
        <content-footer v-if="!$route.meta.hideFooter"></content-footer>
      </div>
    </div>
  </div>
</template>
<script>
  import ContentFooter from './ContentFooter.vue';
  import { FadeTransition } from 'vue2-transitions'
  import DashboardNavbar from './DashboardNavbar'

  export default {
    components: {
      ContentFooter,
      FadeTransition,
      DashboardNavbar
    },
    data() {
      return {
        sidebarBackground: 'vue' //vue|blue|orange|green|red|primary
      };
    },
    methods: {
    }
  };
</script>
<style lang="scss">
</style>
