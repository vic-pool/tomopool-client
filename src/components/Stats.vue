<template>
  <div class="row">
    <div class="col-sm-6 col-md-6 col-xl-3 col-lg-3">
      <stats-card title="Total Stakers"
                  type="gradient-orange"
                  :sub-title="formatNumber(stats.totalStaker)"
                  icon="ni ni-chart-bar-32"
                  class="mb-4 mb-xl-0">
      </stats-card>
    </div>
    <div class="col-sm-6 col-md-6 col-xl-3 col-lg-3">
      <stats-card title="Staking ROI"
                  type="gradient-blue"
                  :sub-title="stats.stakingROI + '%' "
                  icon="fa fa-trophy"
                  class="mb-4 mb-xl-0">
      </stats-card>
    </div>

    <div class="col-sm-6 col-md-6 col-xl-3 col-lg-3">
      <stats-card title="Total Rewards"
                  type="gradient-red"
                  :sub-title="formatNumber(formatTomo(stats.totalReward))"
                  :small-title="'TOMO'"
                  icon="fa fa-users"
                  class="mb-4 mb-xl-0">
      </stats-card>
    </div>
    <div class="col-sm-6 col-md-6 col-xl-3 col-lg-3">
      <stats-card title="Last Epoch"
                  type="gradient-info"
                  :sub-title="formatNumber(stats.lastPaymentEpoch)"
                  icon="fas fa-hourglass-end"
                  class="mb-4 mb-xl-0">
      </stats-card>
    </div>
  </div>
</template>
<script>

  import axios from 'axios'
  import StatsCard from '@/components/StatsCard'
  export default {
    name: 'stats',
    components: {
      StatsCard,
    },

    data() {
      return {
        stats: {},
        apiServer: process.env.VUE_APP_API
      }
    },
    methods: {
      async getStats() {
        let request = await axios.get(this.apiServer + '/api/config/stats/' + process.env.VUE_APP_CANDIDATE_ADDRESS)
        this.stats = request.data
      }
    },
    mounted() {
      this.getStats()
    }
  };
</script>
<style></style>
