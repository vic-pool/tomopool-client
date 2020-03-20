<template>
    <div class="main-content bg-default">
        <!-- Navbar -->
        <div class="side-bar">
            <nav class="navbar navbar-vertical fixed-left navbar-expand-md navbar-light bg-white" id="sidenav-main">
                <div class="container-fluid">
                    <router-link class="navbar-brand" to="/">
                        <img :src="'img/brand/tomopool-green.png'" class="navbar-brand-img" alt="...">
                    </router-link>

                    <slot name="mobile-right">
                        <div>
                            <div v-if="store.address !== ''">
                                <div class="float-left account-balance">
                                    <small>Your Balance</small><br/>
                                    <span class="font-weight-800">{{formatNumber(store.balance)}} </span><small class="font-weight-300">TOMO</small>
                                </div>
                                <div class="float-right">
                                    <base-dropdown v-if="store.address !== ''" class="nav-item" position="right">
                                        <a slot="title" class="nav-link" href="#" role="button">
                                            <div class="media align-items-center">
                                                <img src="@/assets/img/avatar-08-512.png" height="36px">
                                            </div>
                                        </a>
                                        <router-link to="/profile" class="dropdown-item">
                                            <i class="ni ni-single-02"></i>
                                            <span>Profile</span>
                                        </router-link>
                                    </base-dropdown>
                                </div>
                            </div>
                        </div>
                    </slot>
                    <slot></slot>
                    <div class="navbar-collapse collapse show" id="sidenav-collapse-main">

                        <div class="navbar-collapse-header d-md-none">
                            <div class="row">
                                <div class="col-6 collapse-brand">
                                    <router-link to="/">
                                        <img :src="'img/brand/tomopool-green.png'">
                                    </router-link>
                                </div>
                                <div class="col-6 collapse-close">
                                    <button class="navbar-toggler" type="button"
                                            data-toggle="collapse"
                                            aria-label="Toggle navigation">
                                        <slot>
                                            <span></span>
                                            <span></span>
                                        </slot>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <ul class="navbar-nav">
                            <slot name="links">
                            </slot>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
        <!-- Header -->
        <div class="header bg-gradient-success py-7 py-lg-8">
            <div class="separator separator-bottom separator-skew zindex-100">
                <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1"
                     xmlns="http://www.w3.org/2000/svg">
                    <polygon class="fill-default" points="2560 0 2560 100 0 100"></polygon>
                </svg>
            </div>
        </div>
        <!-- Page content -->
        <div class="container mt--8 pb-5 staking-content">
            <dashboard-navbar></dashboard-navbar>
            <slide-y-up-transition mode="out-in" origin="center top">
                <router-view></router-view>
            </slide-y-up-transition>
        </div>
        <footer class="py-5">
            <div class="text-center">
                <a href="https://t.me/coin98pool" class="icon ml-3" target="_blank">
                    <img src="@/assets/logo/telegram-logo.svg" alt="github" height="35px">
                </a>
                <a href="https://twitter.com/coin98_net" class="icon ml-3" target="_blank">
                    <img src="@/assets/logo/twitter-logo.svg" alt="github" height="35px">
                </a>
                <a href="https://github.com/tomo-pool/tomo-pool" class="icon ml-3" target="_blank">
                    <img src="@/assets/logo/github-logo.svg" alt="github" height="35px">
                </a>
                <a :href="'https://scan.tomochain.com/address/' + candidate" class="icon ml-3" target="_blank">
                    <img src="@/assets/logo/tomo-scan-logo.svg" alt="github" height="35px">
                </a>
                <div class="mt-3">
                    © {{year}} TomoPool Team
                </div>
            </div>
        </footer>
    </div>
</template>
<script>
  import { SlideYUpTransition } from 'vue2-transitions'
  import DashboardNavbar from './DashboardNavbar.vue';
  import BaseDropdown from '@/components/BaseDropdown.vue';

  export default {
    name: 'auth-layout',
    components: {
      SlideYUpTransition,
      DashboardNavbar,
      BaseDropdown
    },
    data() {
      return {
        candidate: process.env.VUE_APP_CANDIDATE_ADDRESS,
        year: new Date().getFullYear(),
        showMenu: false,
        sidebarBackground: 'vue' //vue|blue|orange|green|red|primary
      }
    }
  }
</script>
<style>
</style>
