<template>
    <b-navbar toggleable="lg" type="dark" variant="purple">

        <router-link class="navbar-brand" to="/">
            <img :src="'/' + navbarUrl" class="navbar-brand-img" height="36px">
        </router-link>

        <div v-if="store.address !== ''"class="ml-auto">
            <div class="float-left account-balance">
                <small>Your Balance</small>
                <br><span class="font-weight-800">{{formatNumber(store.balance)}}</span>
                <small class="font-weight-300"> TOMO</small>
            </div>
            <div class="float-right">
                <b-nav-item-dropdown right>
                    <!-- Using 'button-content' slot -->
                    <template  v-slot:button-content>
                        <img src="@/assets/img/avatar-08-512.png" height="36px">
                    </template>
                    <router-link to="/profile" class="dropdown-item">
                        <span>Profile</span>
                    </router-link>
                </b-nav-item-dropdown>
            </div>
        </div>
    </b-navbar>
</template>
<script>
import store from '@/store'
  export default {
      data() {
          return {
              store: store,
              navbarUrl: process.env.VUE_APP_NAVBAR_IMAGE
          }
      }
  };
</script>
