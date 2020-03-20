<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import store from './store'

  export default {
    name: 'app',
    data() {
      return {
        store: store
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

