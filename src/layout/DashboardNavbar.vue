<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="info">
            <b-navbar-brand href="#">TomoPool</b-navbar-brand>

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav v-if="store.address !== ''">
                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto" right>
                    <div class="float-left account-balance">
                        <small>Your Balance</small><br/>
                        <span class="font-weight-800">{{formatNumber(store.balance)}} </span><small class="font-weight-300">TOMO</small>
                    </div>
                    <b-nav-item-dropdown right>
                        <!-- Using 'button-content' slot -->
                        <template v-slot:button-content>
                            <img src="https://placekitten.com/g/30/30" alt="Kitten">
                        </template>
                        <b-dropdown-item href="#">Profile</b-dropdown-item>
                        <b-dropdown-item href="#">Sign Out</b-dropdown-item>
                    </b-nav-item-dropdown>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
    </div>
</template>
<script>
import store from '@/store'
  export default {
      data() {
          return {
              store: store
          }
      }
  };
</script>
