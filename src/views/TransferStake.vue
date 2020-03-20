<template>
    <div class="mt--7">

        <div class="row justify-content-center">
            <div class="col-lg-5 col-md-7">
                <div class="card bg-secondary shadow border-0">
                    <div class="card-header bg-transparent pb-2">
                        <h3 class="text-muted mb-2">
                            <i class="fas fa-sign-out-alt text-warning" aria-hidden="true"></i> Stake Transfer
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
                                <router-link :to="'/candidate/' + address">
                                    {{ address }}
                                </router-link>
                            </div>
                            <div class="form-group">
                                <i class="fas fa-warehouse text-primary"></i>
                                Current Capacity: {{ formatNumber(candidate.capacity) }}
                            </div>
                            <div class="form-group">
                                <i class="fas fa-balance-scale text-primary"></i>
                                Your Staking: {{formatNumber(candidateStaker.capacity || 0)}} TOMO
                            </div>
                            <div class="form-group">
                                <base-alert type="danger">
                                    Please make sure that you know owner or private key of this address! DO NOT use exchange address or TomoPool contract!
                                </base-alert>
                            </div>
                            <base-input
                                    class="input-group-alternative mb-3"
                                    placeholder="Receiver Address"
                                    addon-left-icon="fas fa-vote-yea text-primary"
                                    type="string"
                                    v-model="to">
                            </base-input>
                            <base-input
                                class="input-group-alternative mb-3"
                                placeholder="Amount"
                                addon-left-icon="fas fa-coins text-primary"
                                type="number"
                                min="0"
                                v-model="amount">
                            </base-input>
                            <div class="text-center">
                                <base-button type="danger" class="my-2" @click="transferStake">Transfer</base-button>
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
        to: '',
        candidate: {},
        estReward: 0,
        staker: {},
        candidateStaker: {},
        store: store,
        contract: contract,
        apiServer: process.env.VUE_APP_API
      }
    },
    methods: {
      async getCandidateDetail() {
        let request = await axios.get(this.apiServer + '/api/candidates/' + this.address)
        this.candidate = request.data
      },
      async getCandidateStaker() {
        if (this.store.address) {
          let request = await axios.get(this.apiServer + `/api/stakers/${this.store.address}/candidate/${this.address}`)
          this.staker = request.data.staker
          this.candidateStaker = request.data.candidateStaker
          this.resignStatus = request.data.resignStatus
          this.canResign = request.data.canResign
        }
      },
      async transferStake() {
        if (this.amount > this.candidateStaker.capacity) {
            return alert(`You want transfer ${this.amount} TOMO for other staker but you have only ${this.candidateStaker.capacity} TOMO`)
        }
        await this.contract.transferStake(this.address, this.to, this.amount)
      }
    },
    async mounted() {
      await this.getCandidateDetail()
      await this.getCandidateStaker()
    }
  };
</script>
<style></style>
