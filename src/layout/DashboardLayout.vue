<template>
  <div class="wrapper">
    <div class="main-content" :data="sidebarBackground">
      <dashboard-navbar></dashboard-navbar>
      <div class="pt-3 pt-md-3 pt-sm-3 pt-xl-5 pt-lg-5">
          <!-- your content here -->
          <router-view></router-view>
        <content-footer v-if="!$route.meta.hideFooter"></content-footer>
      </div>
    </div>
  </div>
</template>
<script>
  import ContentFooter from './ContentFooter.vue'
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
