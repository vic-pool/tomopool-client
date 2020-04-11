<template>
    <div class="container mt--8 pb-5 staking-content">
        <div class="row justify-content-center">
            <div class="col-lg-5 col-md-7">
                <div class="card shadow border-0">
                    <div class="card-header bg-transparent pb-2">
                        <h4 class="text-muted mb-2">
                            <b-icon icon="cursor-fill" variant="danger"></b-icon>
                            Find your transaction
                        </h4>
                    </div>
                    <div class="card-body px-lg-4 py-lg-4">
                        <form role="form">
                            <div class="form-group" v-if="message !== ''">
                                <b-alert show :variant="success ? 'success' : 'danger'">
                                    {{message}}
                                </b-alert>
                            </div>
                            <b-form-input class="input-group-alternative mb-3"
                                          placeholder="Fill your transaction hash"
                                          type="text"
                                          v-model="txHash">
                            </b-form-input>
                            <div class="text-center">
                                <b-button
                                        variant="primary"
                                        class="mr-2"
                                        @click="finding()">Find
                                </b-button>
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
  import axios from 'axios'

  export default {
    components: {
    },
    data() {
      return {
        txHash: '',
        apiServer: process.env.VUE_APP_API,
        message: '',
        success: false
      }
    },
    methods: {
      async finding() {
        if (this.txHash.length !== 66) {
            this.message = 'Transaction Hash is incorrect'
        }
        let request = await axios.get(this.apiServer + '/api/transactions/miss/' + this.txHash)
        let res = request.data
        this.message = res.message
        this.success = res.success
      }
    }
  }
</script>
<style></style>
