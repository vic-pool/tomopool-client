<template>
    <div class="container mt--8 pb-5 staking-content">

        <div class="row justify-content-center">
            <div class="col-lg-5 col-md-7">
                <div class="card shadow border-0">
                    <div class="card-header bg-transparent pb-2">
                        <h3 class="text-muted mb-2">
                            <i class="fas fa-sign-out-alt text-warning" aria-hidden="true"></i> Vote Resign
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
                                <i class="fas fa-balance-scale text-primary"></i>
                                Total vote resign: {{formatNumber(totalVote)}} TOMO
                            </div>


                            <div class="text-center">
                                <b-button variant="danger" class="my-2" @click="vote">Vote Resign</b-button>
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
        staker: {},
        candidateStaker: {},
        store: store,
        contract: contract,
        apiServer: process.env.VUE_APP_API,
        totalVote: 0
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
      async vote() {
        await this.contract.voteResign(this.address)
      }
    },
    async mounted() {
      await this.getCandidateDetail()
      await this.getCandidateStaker()
      this.totalVote = await this.contract.voteResult(this.address)
    }
  };
</script>
<style></style>
