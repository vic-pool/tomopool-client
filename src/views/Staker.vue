<template>
    <div>
        <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
            <div class="row">
                <div class="col">
                    <div class="card shadow">
                        <div class="card-header bg-transparent">
                            <div class="col">
                                <h3 class="mb-0">
                                    <i class="fa fa-user text-warning" aria-hidden="true"></i> Staker {{address}}
                                </h3>
                            </div>
                        </div>
                        <div class="card-body ">
                            <div class="row">
                                <div class="col-sm-4">
                                    <span>Total staking: {{ formatNumber(candidatesStaker ? candidatesStaker.capacity : 0) }} TOMO</span>
                                </div>
                                <div class="col-sm-4">
                                    <span>Balance: {{formatNumber(candidatesStaker ? formatTomo(candidatesStaker.tomo) : 0)}} TOMO</span>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-4">
                                    <span>Last day: {{formatTomo(candidatesStaker ? candidatesStaker.dailyReward : 0)}} TOMO</span>
                                </div>
                                <div class="col-sm-4">
                                    <span>Last 7 days: {{formatTomo(candidatesStaker ? candidatesStaker.weeklyReward : 0)}} TOMO</span>
                                </div>
                                <div class="col-sm-4">
                                    <span>Last 30 days: {{formatTomo(candidatesStaker ? candidatesStaker.monthlyReward : 0)}} TOMO</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </base-header>

        <div class="container-fluid mt--7">

            <div class="row mt-5">
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
                                    class="tomo-table tomo-table--reward-candidate">
                                    <template
                                        slot="capacity"
                                        slot-scope="props">
                                            {{formatNumber(props.item.capacity)}}
                                    </template>
                                    <template
                                        slot="totalCapacity"
                                        slot-scope="props">
                                            {{formatNumber(props.item.totalCapacity)}}
                                    </template>
                                    <template
                                            slot="annualInterest"
                                            slot-scope="props">
                                        <div>
                                            <span>{{(Math.ceil((props.item.reward * 48 * 30 * 12) / props.item.capacity * 100 * 100)) / 100 }}% </span>
                                            <small>({{formatNumber((Math.ceil((props.item.reward * 48 * 30 * 12) * 100 )) / 100) }} TOMO)</small>
                                        </div>

                                    </template>
                                    <template
                                        slot="rewardTime"
                                        slot-scope="props">
                                        {{formatAge(props.item.rewardTime)}}
                                    </template>
                                </new-table>
                            </div>
                            <div class="mt-3">
                                <base-pagination
                                    v-if="rewardTotal > 0 && rewardTotal > limit"
                                    v-model="rewardCurrentPage"
                                    :page-count="Math.ceil(rewardTotal/limit)"
                                    @change="getRewards"></base-pagination>
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
                                        class="tomo-table tomo-table--staker-transaction">
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

  Vue.use(VueClipboard)
  export default {
    components: {},
    data() {
      return {
        address: this.$route.params.address.toLowerCase(),
        candidate: process.env.VUE_APP_CANDIDATE_ADDRESS,
        candidatesStaker: {},
        limit: 10,

        rewardData: [],
        rewardFields: {
          epoch: { label: 'Epoch' },
          reward: { label: 'Reward' },
          capacity: { label: 'Capacity' },
          totalCapacity: { label: 'Total Capacity' },
          annualInterest: { label: 'Annual Interest' },
          rewardTime: { label: 'Age' },
        },
        rewardTotal: 0,
        rewardCurrentPage: 1,

        transactionsData: [],
        transactionFields: {
          hash: { label: 'Hash' },
          event: { label: 'Event' },
          capacity: { label: 'Capacity' },
          blockNumber: { label: 'Block' },
          createdAt: { label: 'Age' }
        },
        transactionTotal: 0,
        transactionCurrentPage: 1,
        tomoscan: process.env.VUE_APP_TOMOSCAN,
        apiServer: process.env.VUE_APP_API
      }
    },
    methods: {
      onCopy() {
        this.$notify({
          type: 'success',
          title: 'Copied to clipboard'
        })
      },
      async getCandidateStaker() {
        let request = await axios.get(this.apiServer + `/api/candidates/${this.candidate}/staker/${this.address}`)
        this.candidatesStaker = request.data
      },
      async getRewards() {
        let params = {
          page: this.rewardCurrentPage,
          limit: this.limit,
          candidate: this.candidate
        }
        const query = this.serializeQuery(params)

        let request = await axios.get(this.apiServer + '/api/stakers/' + this.address + '/rewards?' + query)
        this.rewardData = request.data.rewards
        this.rewardTotal = request.data.total
      },
      async getTransactions() {
        let params = {
          page: this.transactionCurrentPage,
          limit: this.limit,
          candidate: this.candidate
        }
        const query = this.serializeQuery(params)

        let request = await axios.get(this.apiServer + '/api/transactions/staker/' + this.address + '?' + query)
        this.transactionsData = request.data.transactions
        this.transactionTotal = request.data.total
      }
    },
    async mounted() {
      await this.getCandidateStaker()
      await this.getRewards()
      await this.getTransactions()
    }
  };
</script>
<style></style>
