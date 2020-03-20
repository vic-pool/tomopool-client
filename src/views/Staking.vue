<template>
    <div class="mt--7">

        <div class="row justify-content-center">
            <div class="col-lg-5 col-md-7">
                <div class="card bg-secondary shadow border-0">
                    <div class="card-header bg-transparent pb-2">
                        <h3 class="text-muted mb-2">
                            <i class="ni ni-send text-warning" aria-hidden="true"></i> Staking
                        </h3>
                    </div>
                    <div class="card-body px-lg-4 py-lg-4">
                        <form role="form">
                            <div v-if="store.address" class="form-group">
                                <i class="fas fa-vote-yea text-primary"></i> Staker:
                                <router-link :to="'/staker/' + store.address ">
                                    {{ store.address }}
                                </router-link>
                            </div>
                            <div class="form-group">
                                <i class="fas fa-id-card text-primary"></i> Candidate:
                                <a target="_blank" :href="tomomaster + '/candidate/' + candidate.coinbase">
                                    {{candidate.hash}}
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
                                <i class="fas fa-balance-scale text-primary"></i> Your Balance: {{formatNumber(store.balance)}} TOMO
                            </div>
                            <base-input class="input-group-alternative mb-3"
                                placeholder="Amount"
                                addon-left-icon="fas fa-coins text-primary"
                                type="number"
                                min="0"
                                v-model="amount"
                                @keyup="estimateReward"
                                @change="estimateReward">
                            </base-input>
                            <div class="form-group">
                                <small>Est Daily rewards: {{ estReward }} TOMO</small>
                            </div>

                            <div class="form-group" v-if="hasProblem">
                                <base-alert type="danger">
                                    There is an internal technical problem with the way the contract processes your wallet address. Please contact us to resolve problem
                                </base-alert>
                            </div>
                            <div class="text-center">
                                <base-button
                                    type="primary"
                                    :class="store.address ? '' : 'disabled'"
                                    class="my-2"
                                    @click="staking()">Stake</base-button>
                                <router-link to="/" class="btn btn-secondary">
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
        estReward: 0,
        store: store,
        contract: contract,
        tomomaster: process.env.VUE_APP_TOMOMASTER,
        apiServer: process.env.VUE_APP_API,
        maxCap: process.env.VUE_APP_MAX_CAPACITY,
        currentCap: 0,
        hasProblem: false
      }
    },
    methods: {
      async getCandidateDetail() {
        let request = await axios.get(this.apiServer + '/api/candidates/' + this.address)
        this.candidate = request.data
        this.currentCap = this.candidate.capacity
      },
      async checkProblem() {
        let request = await axios.get(this.apiServer + '/api/candidates/' + this.address)
        this.candidate = request.data
        this.currentCap = this.candidate.capacity
      },
      estimateReward() {
        let latestReward = this.candidate.reward
        let totalCapacity = this.candidate.capacity
        this.estReward = (parseInt(this.amount) * latestReward / totalCapacity) * 48
      },
      async staking() {
        if (this.candidate) {
          if (parseFloat(this.candidate.capacity) >= parseFloat(process.env.VUE_APP_MAX_CAPACITY)) {
            return alert('Stake Rejected! The pool has reached the maximum capacity. Please comeback when the pool stake is reduced!')
          } else {
            let newCap = parseFloat(this.currentCap) + parseFloat(this.amount)
            if (newCap > parseFloat(this.maxCap)) {
              let maxStake = parseFloat(this.maxCap) - parseFloat(this.currentCap)
              let c = confirm(`Stake rejected! Max capacity is ${this.maxCap}. You can stake ${maxStake}. Do you want stake with this amount`)
              if (c) {
                  this.amount = maxStake
              }
            }
          if (parseFloat(this.amount) < 10) {
              return alert('Minimum stake is 10 Tomo')
          }
            await this.contract.stake(this.candidate.hash, this.amount)
          }
        }

      }
    },
    async mounted() {
      await this.getCandidateDetail()
    }
  };
</script>
<style></style>
