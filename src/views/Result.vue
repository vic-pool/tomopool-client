<template>
    <div class="container mt--8 pb-5 staking-content">
        <div class="row justify-content-center">
            <div class="col-lg-5 col-md-7">
                <div class="card shadow border-0">
                    <div class="card-header bg-transparent pb-2">
                        <h3 class="text-muted mb-2">
                            <i class="fa  fa-check-circle text-warning" aria-hidden="true"></i> Success
                        </h3>
                    </div>
                    <div class="card-body px-lg-4 py-lg-4">
                        <form role="form">
                            <div
                                v-if="type === 'proposed' || type === 'voteResign'"
                                class="form-group">
                                You have {{type}} for candidate successfully
                            </div>
                            <div
                                v-else-if="type === 'withdrawRewards'"
                                class="form-group">
                                You have withdrawn your rewards successfully
                            </div>
                            <div
                                v-else
                                class="form-group">
                                You have {{type}} {{formatNumber(amount)}} TOMO successfully
                            </div>
                            <div class="form-group">
                                Transaction Hash:
                                <a :href="tomoscan + '/txs/' + txHash" class="account-address">
                                    {{txHash}}
                                </a>
                            </div>

                            <div class="text-center">
                                <router-link to="/" class="btn btn-primary">
                                    Back to dashboard
                                </router-link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>
<script>
  import Vue from 'vue'
  import VueClipboard from 'vue-clipboard2'


  Vue.use(VueClipboard)
  export default {
    components: {
    },
    data() {
      return {
        type: this.$route.params.type,
        candidate: this.$route.params.candidate.toLowerCase(),
        amount: this.$route.params.amount.toLowerCase(),
        txHash: this.$route.params.hash.toLowerCase(),
        tomoscan: process.env.VUE_APP_TOMOSCAN
      }
    },
    methods: {

    },
    mounted() {
    }
  };
</script>
<style></style>
