<template>
    <div>
        <base-header type="gradient-success" class="color-gray">
            <!-- Card stats -->
            <div class="row">
                <div class="stats col-sm-6 col-md-6 col-xl-3 col-lg-3 mb-2 mb-sm-4 mb-md-4 mb-xl-0 mb-lg-0">
                    <div class="list-group-item border-purple text-center h-100 py-3">
                        <p class="highlight-label">My Stake</p>
                        <p class="h3 font-w4 mb-3">
                            <span class="color-purple"> {{formatNumber(candidateStaker.capacity)}}</span>
                            <span class="m-0 h6 highlight-sub"> TOMO</span>
                        </p>
                        <p class="m-0 small font-w5"><a href="#" @click="stake">Stake More</a></p>
                    </div>
                </div>
                <div class="stats col-sm-6 col-md-6 col-xl-3 col-lg-3 mb-2 mb-sm-4 mb-md-4 mb-xl-0 mb-lg-0">
                    <div class="list-group-item border-purple text-center h-100 py-3">
                        <p class="highlight-label">My Rewards</p>
                        <p class="h3 font-w4 mb-3">
                            <span class="color-purple"> {{formatNumber(Math.round(stakerReward * 1000) / 1000)}}</span>
                            <span class="m-0 h6 highlight-sub"> TOMO</span>
                        </p>
                        <p class="m-0 small font-w5"><a href="#" @click="withdrawRewards">Withdraw</a></p>
                    </div>
                    </div>
                <div class="stats col-sm-6 col-md-6 col-xl-3 col-lg-3 mb-2 mb-sm-4 mb-md-0 mb-xl-0 mb-lg-0">
                    <div class="list-group-item border-purple text-center h-100 py-3">
                        <p class="highlight-label">Total Staker</p>
                        <p class="h3 font-w4 mb-3">
                            <span class="color-purple"> {{formatNumber(stats.totalStaker)}}</span>
                        </p>
                    </div>
                </div>
                <div class="stats col-sm-6 col-md-6 col-xl-3 col-lg-3 mb-2 mb-sm-4 mb-md-0 mb-xl-0 mb-lg-0">
                    <div class="list-group-item border-purple text-center h-100 py-3">
                        <p class="highlight-label">ROI</p>
                        <p class="h3 font-w4 mb-3">
                            <span class="color-purple">{{stats.stakingROI}}%</span>
                        </p>
                    </div>
                </div>
            </div>
        </base-header>

        <base-header type="gradient-success" class="pt-3 pt-md-3 pt-sm-3 pt-xl-5 pt-lg-5">
            <div class="row">
                <div class="col">
                    <div class="card shadow">
                        <div class="card-header bg-transparent">
                            <div class="col">
                                <h5 class="mb-0">
                                    <i class="fa fa-user text-warning" aria-hidden="true"></i> Candidate detail
                                </h5>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-sm-12">
                                    <div>Candidate:
                                        <a :href="tomoscan + '/address/' + candidate.hash" target="_blank">
                                            {{candidate.hash}}
                                        </a>
                                    </div>
                                    <div>Coinbase:
                                        <a :href="tomomaster + '/candidate/' + candidate.coinbase" target="_blank">
                                            {{candidate.coinbase}}
                                        </a>
                                     </div>
                                    <div>Capacity: {{ formatNumber(candidate.capacity) }} / {{formatNumber(maxCap)}} TOMO</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row mt-3 mb-3">
                <div class="col-12">
                    <b-button-toolbar key-nav aria-label="Toolbar with button groups">
                        <b-button variant="primary" class="btn-responsive mx-1 ml-auto" @click="stake">Stake</b-button>
                        <b-button variant="danger" class="btn-responsive mx-1" @click="unstake"
                                  v-if="store.address && candidateStaker && candidateStaker.capacity > 0">Unstake</b-button>
                        <b-button v-if="candidate.status === 'PENDING' && candidate.capacity >= 200000"
                                variant="warning" class="btn-responsive mx-1"
                                @click="propose(candidate.hash)">Propose</b-button>

                        <b-dropdown class="mx-1 btn-responsive" right text="Other " v-if="store.address && candidateStaker && candidateStaker.capacity > 0 && candidate.status !== 'PENDING'">
                            <router-link :to="'/transferStake/' + candidate.hash" class="dropdown-item" v-if="candidateStaker.capacity > 0">
                                Transfer Stake
                            </router-link>
                            <router-link :to="'/voteResign/' + candidate.hash" class="dropdown-item" v-if="!resignStatus">
                                Vote Resign
                            </router-link>
                            <router-link :to="'/unVoteResign/' + candidate.hash" class="dropdown-item" v-if="resignStatus">
                                UnVote Resign
                            </router-link>
                            <a class="dropdown-item" @click="resign" v-if="canResign">Resign</a>
                        </b-dropdown>
                    </b-button-toolbar>

                </div>
            </div>
        </base-header>

        <div class="container-fluid mt--7">
            <div class="row">
                <div class="col">

                    <b-card no-body>
                        <b-tabs card>
                            <b-tab title="Stakers" active>
                                <div class="table-responsive">
                                    <new-table
                                            :fields="stakerFields"
                                            :items="stakersData"
                                            class="tomo-table tomo-table--staker">
                                        <template
                                                slot="staker"
                                                slot-scope="props">
                                            <router-link :to="'/staker/' + props.item.staker" class="account-address">
                                                {{props.item.staker}}
                                            </router-link>
                                        </template>

                                        <template
                                                slot="capacity"
                                                slot-scope="props">
                                            {{formatNumber(props.item.capacity)}}
                                        </template>
                                    </new-table>
                                </div>
                                <div class="mt-3">
                                    <base-pagination
                                            v-if="stakerTotal > 0 && stakerTotal > limit"
                                            v-model="stakerCurrentPage"
                                            :page-count="Math.ceil(stakerTotal/limit)"
                                            @change="getStakers"></base-pagination>
                                </div>
                            </b-tab>
                            <b-tab title="Rewards">
                                <div class="table-responsive">
                                    <new-table
                                            :fields="rewardFields"
                                            :items="rewardData"
                                            class="tomo-table tomo-table--reward">
                                        <template
                                                slot="annualInterest"
                                                slot-scope="props">
                                            <div>
                                                <span>{{(Math.ceil((props.item.totalReward * 48 * 30 * 12) / props.item.totalCapacity * 100 * 100)) / 100 }}% </span>
                                                <small>({{formatNumber((Math.ceil((props.item.totalReward * 48 * 30 * 12) * 100 )) / 100) }} TOMO)</small>
                                            </div>

                                        </template>
                                        <template
                                                slot="totalCapacity"
                                                slot-scope="props">
                                            {{formatNumber(props.item.totalCapacity)}}
                                        </template>
                                        <template
                                                slot="rewardTime"
                                                slot-scope="props"
                                                :title="props.item.rewardTime">
                                            {{formatAge(props.item.rewardTime)}}
                                        </template>
                                    </new-table>
                                </div>
                                <div class="mt-3">
                                    <base-pagination
                                            v-if="rewardTotal > 0 && rewardTotal > limit"
                                            v-model="rewardCurrentPage"
                                            :page-count="Math.ceil(rewardTotal/limit)"
                                            @change="getCandidateRewards"></base-pagination>
                                </div>
                            </b-tab>
                            <b-tab title="Transactions">
                                <div class="table-responsive">
                                    <new-table
                                            :fields="transactionFields"
                                            :items="transactionsData"
                                            class="tomo-table tomo-table--transaction">
                                        <template
                                                slot="hash"
                                                slot-scope="props">
                                            <div class="account-address">
                                                <a :href="tomoscan + '/tx/' + props.item.hash" target="_blank">
                                                    {{props.item.hash}}
                                                </a>
                                            </div>
                                        </template>
                                        <template
                                                slot="staker" class="account-address"
                                                slot-scope="props">
                                            <router-link :to="'/staker/' + props.item.staker" class="account-address">
                                                {{props.item.staker}}
                                            </router-link>
                                        </template>

                                        <template
                                                slot="capacity"
                                                slot-scope="props">
                                            {{formatNumber(props.item.capacity)}}
                                        </template>
                                        <template
                                                slot="blockNumber"
                                                slot-scope="props">
                                            {{formatNumber(props.item.blockNumber)}}
                                        </template>
                                        <template
                                                slot="createdAt"
                                                slot-scope="props">
                                            {{formatAge(props.item.createdAt)}}
                                        </template>
                                    </new-table>
                                </div>
                                <div class="mt-3">
                                    <base-pagination
                                            v-if="transactionTotal > 0 && transactionTotal > limit"
                                            v-model="transactionCurrentPage"
                                            :page-count="Math.ceil(transactionTotal/limit)"
                                            @change="getTransactions"></base-pagination>
                                </div>
                            </b-tab>
                        </b-tabs>
                    </b-card>

                </div>
            </div>
        </div>

    </div>
</template>
<script>
  import Vue from 'vue'
  import VueClipboard from 'vue-clipboard2'
  import axios from 'axios'
  import contract from '@/contracts/contractBaseFunction'
  import store from '@/store'
  import NewTable from '@/components/NewTable'
  import BaseHeader from '@/components/BaseHeader'
  import BasePagination from '@/components/BasePagination'

  Vue.use(VueClipboard)
  export default {
    components: {
        NewTable,
        BaseHeader,
        BasePagination,
    },
    data() {
      return {
        address: store.candidateAddress,
        candidate: {},
        limit: 10,
        stakerReward: 0,

        rewardData: [],
        rewardFields: {
          epoch: { label: 'Epoch' },
          totalReward: { label: 'Reward' },
          stakerNumber: { label: 'Staker Number' },
          totalCapacity: { label: 'Capacity' },
          annualInterest: { label: 'Annual Interest' },
          rewardTime: { label: 'Age' },
        },
        rewardTotal: 0,
        rewardCurrentPage: 1,

        stakersData: [],
        stakerFields: {
          staker: { label: 'Staker' },
          capacity: { label: 'Capacity' }
        },
        stakerTotal: 0,
        stakerCurrentPage: 1,

        transactionsData: [],
        transactionFields: {
          hash: { label: 'Hash' },
          staker: { label: 'Staker' },
          event: { label: 'Event' },
          capacity: { label: 'Capacity' },
          blockNumber: { label: 'Block' },
          createdAt: { label: 'Age' }
        },
        transactionTotal: 0,
        transactionCurrentPage: 1,
        contract: contract,
        store: store,
        staker: {},
        candidateStaker: {capacity: 0},
        resignStatus: false,
        canResign: false,
        candidateStatus: 0,
        withdrawLock2days: false,
        withdrawLock30days: false,
        stats: {},

        tomoscan: process.env.VUE_APP_TOMOSCAN,
        tomomaster: process.env.VUE_APP_TOMOMASTER,
        apiServer: process.env.VUE_APP_API,
        maxCap: 0
      }
    },
    methods: {
      async getStakers() {
        let params = {
          page: this.stakerCurrentPage,
          limit: this.limit
        }
        const query = this.serializeQuery(params)

        let request = await axios.get(this.apiServer + '/api/stakers/candidate/' + this.address + '?' + query)
        this.stakersData = request.data.candidateStakers
        this.stakerTotal = request.data.total
      },
      async currentStakerReward() {
        if (this.store.address) {
          this.stakerReward = await this.contract.computeReward(this.address)
        }
      },
      async getTransactions() {
        let params = {
          page: this.transactionCurrentPage,
          limit: this.limit
        }
        const query = this.serializeQuery(params)

        let request = await axios.get(this.apiServer + '/api/transactions/candidate/' + this.address + '?' + query)
        this.transactionsData = request.data.transactions
        this.transactionTotal = request.data.total
      },
      stake() {
        this.$router.push({ path: `/staking/${this.address}` })
      },
      unstake() {
        this.$router.push({ path: `/unStaking/${this.address}` })
      },
      voteResign() {
        this.$router.push({ path: `/voteResign/${this.address}` })
      },
      unVoteResign() {
        this.$router.push({ path: `/unVoteResign/${this.address}` })
      },
      async propose() {
        await this.contract.propose(this.address)
      },
      async withdrawRewards() {
        await this.contract.withdrawRewards(this.address)
      },
      async resign() {
        let c = confirm('Are you sure?')
        if (c) {
          await this.contract.resign(this.address)
        }
      },
      async checkIsVoted() {
        this.resignStatus = await this.contract.checkIsVoted(this.store.address)
      },
      async reCalculate() {
        await this.contract.fillRewardsPerEpoch(this.address)
        let sleep = (time) => new Promise((resolve) => setTimeout(resolve, time))
        await sleep(2000)
        this.stakerReward = await this.contract.computeReward(this.address)
      },
      async getCandidateStatus() {
        if (this.candidate.statusNumber === 100) {
          let isWithdraw2days = await this.contract.isAlreadyWithdrawAfterResign(this.address, this.store.address, true)
          if (!isWithdraw2days) {

          }
        }
      },
      async getCandidateDetail() {
        let request = await axios.get(this.apiServer + '/api/candidates/' + this.address)
        this.candidate = request.data
        this.maxCap = this.candidate.maxCapacity
      },
      async getCandidateRewards() {
        let params = {
          page: this.rewardCurrentPage,
          limit: this.limit
        }
        const query = this.serializeQuery(params)

        let request = await axios.get(this.apiServer + `/api/candidates/${this.address}/rewards?${query}`)
        this.rewardData = request.data.rewards
        this.rewardTotal = request.data.total
      },
      async getCandidateStaker() {
        if (this.store.address) {
          let request = await axios.get(this.apiServer + `/api/candidates/${this.address}/staker/${this.store.address}`)
          this.candidateStaker = request.data
        }

      },
      async getStats() {
        let request = await axios.get(this.apiServer + '/api/config/stats/' + process.env.VUE_APP_CANDIDATE_ADDRESS)
        this.stats = request.data
      },
      async getCandidateStakers() {
        let params = {
          page: this.rewardCurrentPage,
          limit: this.limit
        }
        const query = this.serializeQuery(params)

        let request = await axios.get(this.apiServer + `/api/candidates/${this.address}/stakers?${query}`)
        this.stakersData = request.data.stakers
        this.stakerTotal = request.data.total
      }
    },
    async created() {
      await this.getStats()
      await this.getCandidateDetail()
      await this.getCandidateStaker()
      await this.currentStakerReward()
      await this.getCandidateRewards()
      await this.getCandidateStakers()
      await this.getTransactions()
      await this.getCandidateStatus()
    }
  };
</script>
<style></style>
