<template>
    <div class="container mt--8 pb-5 staking-content">
        <div class="row justify-content-center">
            <div class="col-lg-5 col-md-7">
                <div class="card shadow border-0">
                    <div class="card-header bg-transparent pb-2">
                        <h3 class="text-muted mb-2">
                            <b-icon icon="arrow-counterclockwise" variant="danger"></b-icon> Unstake
                        </h3>
                    </div>
                    <div class="card-body px-lg-4 py-lg-4">
                        <form role="form">
                            <div class="form-group">
                                <i class="fas fa-vote-yea text-primary"></i> Staker:
                                <router-link :to="'/staker/' + store.address ">
                                    {{ store.address }}
                                </router-link>
                            </div>
                            <div class="form-group">
                                <i class="fas fa-id-card text-primary"></i> Candidate:
                                <a :href="tomomaster + '/candidate/' + candidate.coinbase">
                                    {{candidate.coinbase}}
                                </a>
                            </div>
                            <div class="form-group">
                                <i class="fas fa-warehouse text-primary"></i>
                                Current Capacity: {{ formatNumber(candidate.capacity) }}
                            </div>
                            <div class="form-group">
                                <i class="fas fa-warehouse text-primary"></i>
                                Max Capacity: {{ formatNumber(candidate.maxCapacity) }}
                            </div>
                            <div class="form-group">
                                <i class="fas fa-balance-scale text-primary"></i> Your Staking: {{formatNumber(yourStaking)}} TOMO
                            </div>
                            <b-form-input
                                class="input-group-alternative mb-3"
                                placeholder="Amount"
                                addon-left-icon="fas fa-coins text-primary"
                                type="number"
                                min="0"
                                v-model="amount">
                            </b-form-input>
                            <div class="text-center">
                                <b-button
                                    variant="danger"
                                    class="mr-2"
                                    :class="store.address ? '' : 'disabled'"
                                    @click="unStaking">UnStaking</b-button>
                                <router-link to="/" class="btn btn-outline-primary">
                                    Back
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
  import axios from 'axios'
  import store from '@/store'
  import contract from '@/contracts/contractBaseFunction'

  Vue.use(VueClipboard)
  export default {
    components: {
    },
    data() {
      return {
        address: this.$route.params.address.toLowerCase(),
        amount: '',
        candidate: {},
        candidateStaker: {},
        yourStaking: 0,
        store: store,
        contract: contract,
        tomomaster: process.env.VUE_APP_TOMOMASTER,
        apiServer: process.env.VUE_APP_API
      }
    },
    methods: {
      async getCandidateDetail() {
        let request = await axios.get(this.apiServer + '/api/candidates/' + this.address)
        this.candidate = request.data
      },
      async getCandidateStaker() {
        let { data } = await axios.get(this.apiServer + `/api/stakers/${store.address}/candidate/${this.address}`)
        this.candidateStaker = data
        if (data.candidateStaker) {
          this.yourStaking = data.candidateStaker.capacity
        }
      },
      async unStaking() {
        if (this.amount > this.yourStaking) {
          alert(`Your staking is less than ${this.amount}`)
        } else {
          await this.contract.unstake(this.candidate.hash, this.amount)
        }
      }
    },
    async mounted() {
      await this.getCandidateDetail()
      await this.getCandidateStaker()
    }
  };
</script>
<style></style>
