<template>

    <div>
        <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
            <div class="row">
                <div class="col">
                    <div class="card shadow">
                        <div class="card-header bg-transparent">
                            <div class="col">
                                <h3 class="mb-0">
                                    <i class="fa fa-user text-warning" aria-hidden="true"></i> Main information
                                </h3>
                            </div>
                        </div>
                        <div class="card-body ">
                            <div class="row">
                                <div class="col-lg-12">
                                    <i class="fas fa-vote-yea text-primary"></i> Address:
                                    <router-link :to="'/staker/' + store.address ">
                                        {{store.address}}
                                    </router-link>
                                </div>
                                <div class="col-lg-6">
                                    <i class="fas fa-balance-scale text-primary"></i>
                                    Your Balance: {{formatNumber(store.balance)}} TOMO
                                </div>
                                <div class="col-lg-6">
                                    <i class="fas fa-vote-yea text-primary"></i>
                                    Total Staking: {{candidateStaker ? formatNumber(candidateStaker.capacity) : 0}} TOMO
                                </div>
                                <div class="col-lg-6">
                                    <i class="fas fa-balance-scale text-primary"></i>
                                    Total Reward: {{candidateStaker ? formatNumber(candidateStaker.totalReward) : 0}} TOMO
                                </div>
                            </div>
                        </div>
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
                                <i class="fa fa-history text-warning" aria-hidden="true"></i> Withdraw stake history
                            </h3>
                        </div>
                        <div class="card-body card-body-no-padding">
                            <div class="table-responsive">

                                <new-table
                                    :fields="withdrawFields"
                                    :items="withdrawData"
                                    class="tomo-table tomo-table--withdraw-stake">

                                    <template
                                            slot="unstakeTx"
                                            slot-scope="props">
                                        <a :href="tomoscan + '/txs/' + props.item.unstakeTx" class="account-address">
                                            {{hiddenString(props.item.unstakeTx, 10)}}
                                        </a>
                                    </template>
                                    <template
                                            slot="withdrawTx"
                                            slot-scope="props">
                                        <a :href="tomoscan + '/txs/' + props.item.withdrawTx" class="account-address">
                                            {{hiddenString(props.item.withdrawTx, 10)}}
                                        </a>
                                    </template>
                                    <template
                                            slot="blockUnstake"
                                            slot-scope="props">
                                        {{formatNumber(props.item.blockUnstake)}}
                                    </template>
                                    <template
                                            slot="blockWithdraw"
                                            slot-scope="props">
                                        {{formatNumber(props.item.blockWithdraw)}}
                                    </template>
                                    <template
                                            slot="capacity"
                                            slot-scope="props">
                                        {{formatNumber(props.item.capacity)}}
                                    </template>
                                    <template
                                            slot="estimateTime"
                                            slot-scope="props">
                                        <vue-countdown :time="props.item.blockWithdraw - currentBlock > 0 ? (props.item.blockWithdraw - currentBlock) * 2 * 1000 : 0">
                                            <template slot-scope="time">{{ time.days > 0 ? time.days + ' days ' : '' }}{{ time.hours }}:{{ time.minutes }}:{{ time.seconds }}</template>
                                        </vue-countdown>
                                    </template>
                                    <template
                                            slot="option"
                                            slot-scope="props">
                                        <base-button
                                                v-if="!props.item.isWithdraw"
                                                :class="currentBlock < props.item.blockWithdraw ? 'disabled' : ''"
                                                type="primary"
                                                size="sm"
                                                @click="withdrawStake(props.item.candidate, props.item.blockWithdraw)">Withdraw</base-button>
                                    </template>
                                </new-table>
                            </div>
                            <div class="mt-3">
                                <base-pagination
                                    v-if="withdrawTotal > 0 && withdrawTotal > limit"
                                    v-model="withdrawCurrentPage"
                                    :page-count="Math.ceil(withdrawTotal/limit)"
                                    @change="getCandidates"></base-pagination>
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
  import store from '@/store'
  import contract from '@/contracts/contractBaseFunction'
  import VueCountdown from '@chenfengyuan/vue-countdown'


  Vue.use(VueClipboard)
  export default {
    components: {
      VueCountdown
    },
    data() {
      return {
        staker: {},
        candidateStaker: {},
        currentPage: 1,
        limit: 20,
        currentBlock: 0,
        candidateAddress: store.candidateAddress,

        withdrawData: [],
        withdrawFields: {
          unstakeTx: { label: 'Unstake Tx' },
          blockUnstake: { label: 'Block Unstake' },
          blockWithdraw: { label: 'Block Withdraw' },
          withdrawTx: { label: 'Withdraw Tx' },
          capacity: { label: 'Amount' },
          estimateTime: { label: 'Estimate Time' },
          option: { label: '' },
        },
        withdrawTotal: 0,
        withdrawCurrentPage: 1,

        store: store,
        contract: contract,
        tomoscan: process.env.VUE_APP_TOMOSCAN,
        apiServer: process.env.VUE_APP_API
      }
    },
    methods: {
      async getListWithdraw() {

        let params = {
          page: this.withdrawCurrentPage,
          limit: this.limit
        }
        const query = this.serializeQuery(params)
        let request = await axios.get(this.apiServer + '/api/stakers/' + this.store.address + '/candidate/' + this.candidateAddress + '/withdraw?' + query)
        this.withdrawData = request.data.listWithdraw
        this.withdrawTotal = request.data.total
        this.staker = request.data.staker
        this.candidateStaker = request.data.candidateStaker
        this.currentBlock = request.data.currentBlock
      },

      withdrawStake(candidate, blockWithdraw) {
        this.contract.withdrawStake(candidate, blockWithdraw)
      }
    },
    async mounted() {
      await this.getListWithdraw()
    }
  };
</script>
<style></style>
