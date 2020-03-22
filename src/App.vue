<template>
  <div id="app">
    <link rel="icon" :href="'/' + favicon">
    <title>{{title}}</title>
    <router-view/>
  </div>
</template>

<script>
  import store from './store'

  export default {
    name: 'app',
    data() {
      return {
        store: store,
        title: process.env.VUE_APP_POOL_NAME,
        favicon: process.env.VUE_APP_FAVICON
      }
    },
    async created() {
      if (window.ethereum) {
        await window.ethereum.enable()
        await this.walletLogin()
      } else {
        await this.walletLogin()
      }
    },
    async updated() {
      if (window.ethereum) {
        await window.ethereum.enable()
        await this.walletLogin()
      } else {
        await this.walletLogin()
      }
    },
    async mounted() {
      if (window.ethereum) {
        await window.ethereum.enable()
        await this.walletLogin()
      } else {
        await this.walletLogin()
      }
    }
  }
</script>

