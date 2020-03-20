<template>
    <div>
        <base-header type="gradient-success" class="pt-5 pt-md-8">
            <!-- Card stats -->
            <stats></stats>
        </base-header>
        <base-header type="gradient-success" class="pb-6 pb-8 pt-5">
            <div class="row">
                <div class="col">
                    <div class="card shadow">
                        <div class="card-header bg-transparent">
                            <div class="col">
                                <h3 class="mb-0">
                                    <i class="fa fa-user text-warning" aria-hidden="true"></i> Candidate detail
                                </h3>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-sm-6">
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
                                    <div>Capacity: {{ formatNumber(candidate.capacity) }} TOMO</div>
                                </div>
                                <div class="col-sm-6">
                                    <div>
                                        <span>You voted: {{ formatNumber(candidateStaker.capacity) }} TOMO</span>
                                    </div>
                                    <div>
                                        <span>Your current reward: {{ formatNumber(stakerReward) }} TOMO </span>
                                        <span style="cursor: pointer; text-transform: capitalize !important;"
                                              class="badge text-uppercase badge-primary" @click="reCalculate">Re-Calculate rewards</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-12">
                    <div class="text-right">
                        <base-button type="default" class="btn-responsive" @click="withdrawRewards" v-if="store.address && stakerReward > 0">Withdraw Rewards</base-button>
                        <base-button type="primary" class="btn-responsive" @click="stake">Stake</base-button>
                        <base-button
                            type="warning"
                            class="btn-responsive"
                            @click="unstake"
                            v-if="store.address && candidateStaker && candidateStaker.capacity > 0">UnStake</base-button>
                        <base-button
                            v-if="candidate.status === 'PENDING' && candidate.capacity >= 200000"
                            type="warning"
                            class="btn-responsive"
                            @click="propose(candidate.hash)">Propose</base-button>
                        <base-dropdown position="right" v-if="store.address && candidateStaker && candidateStaker.capacity > 0 && candidate.status !== 'PENDING'">
                            <base-button slot="title" type="secondary" class="dropdown-toggle btn-responsive">
                                Other
                            </base-button>
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
                        </base-dropdown>

                    </div>

                </div>
            </div>
        </base-header>

        <div class="container-fluid mt--7">
            <div class="row">
                <div class="col">
                    <div class="card shadow">
                        <div class="card-header bg-transparent">
                            <h3 class="mb-0">
                                <i class="fa fa-trophy text-warning" aria-hidden="true"></i> Rewards
                            </h3>
                        </div>
                        <div class="card-body card-body-no-padding">
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
                        </div>
                    </div>
                </div>
            </div>

            <div class="row mt-5">
                <div class="col">
                    <div class="card shadow">
                        <div class="card-header bg-transparent">
                            <h3 class="mb-0">
                                <i class="fa fa-star text-warning" aria-hidden="true"></i> Stakers
                            </h3>
                        </div>
                        <div class="card-body card-body-no-padding">
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
                        </div>
                    </div>
                </div>
            </div>

            <div class="row mt-5">
                <div class="col">
                    <div class="card shadow">
                        <div class="card-header bg-transparent">
                            <h3 class="mb-0">
                                <i class="fa fa-history text-warning" aria-hidden="true"></i> Transactions
                            </h3>
                        </div>
                        <div class="card-body card-body-no-padding">
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
                        </div>
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
  import contract from '@/contracts/contractBaseFunction'
  import store from '@/store'
  import NewTable from '@/components/NewTable'
  import BaseDropdown from '@/components/BaseDropdown'
  import BaseHeader from '@/components/BaseHeader'
  import Stats from '@/components/Stats'
  import BasePagination from '@/components/BasePagination'
  import BaseButton from '@/components/BaseButton'

  Vue.use(VueClipboard)
  export default {
    components: {
        NewTable,
        BaseDropdown,
        BaseHeader,
        Stats,
        BasePagination,
        BaseButton,
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

        tomoscan: process.env.VUE_APP_TOMOSCAN,
        tomomaster: process.env.VUE_APP_TOMOMASTER,
        apiServer: process.env.VUE_APP_API
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
    async mounted() {
      await this.getCandidateStaker()
      await this.currentStakerReward()
    },
    async created() {
      await this.getCandidateDetail()
      await this.getCandidateStaker()
      await this.currentStakerReward()
      await this.getCandidateRewards()
      await this.getCandidateStakers()
      await this.getTransactions()
      await this.getCandidateStatus()
    },
    async updated() {
      // await this.getCandidateStaker()
      // await this.currentStakerReward()
    }
  };
</script>
<style></style>
