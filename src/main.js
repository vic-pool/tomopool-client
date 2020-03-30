import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import BigNumber from 'bignumber.js'
import moment from 'moment'
import contract from './contracts/contractBaseFunction'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import '@/assets/scss/app.scss'

BigNumber.config({ EXPONENTIAL_AT: [-100, 100] })

Vue.config.productionTip = false

// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

Vue.prototype.serializeQuery = function (params, prefix) {
  const query = Object.keys(params).map((key) => {
    const value = params[key]

    if (params.constructor === Array) {
      key = `${prefix}[]`
    } else {
      if (params.constructor === Object) {
        key = (prefix ? `${prefix}[${key}]` : key)
      }
    }

    return value === 'object' ? this.serializeQuery(value, key) : `${key}=${encodeURIComponent(value)}`
  })

  return [].concat.apply([], query).join('&')
}

Vue.prototype.formatNumber = function (number) {
  number = new BigNumber(number)
  let seps = number.toString().split('.')
  seps[0] = seps[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return seps.join('.')
}

Vue.prototype.hiddenString = function (string, numberStringShowing) {
  if (string === null || string === '') {
    return ''
  }
  if (string.length <= numberStringShowing * 2 + 3) {
    return string
  }
  let stringBeforeDot = String(string).substr(0, numberStringShowing)
  let stringAfterDot = String(string).substr(-numberStringShowing)
  return stringBeforeDot + '...' + stringAfterDot
}

Vue.prototype.formatAge = function (timestamp) {
  return moment(timestamp).fromNow()
}

Vue.prototype.formatTomo = function (num) {
  return Math.floor(num * 1000) / 1000
}
Vue.prototype.walletLogin = function () {
  if (window.web3) {
    if (window.web3.currentProvider) {
      if (window.web3.currentProvider.isTomoWallet) {
        contract.login({
          tomowallet: true
        }, async (err, address) => {
          store.address = address;
          await store.updateBalance(address)
        });
      }
      else if (window.web3.currentProvider.isTrust) {
        contract.login({
          trustwallet: true
        }, async (err, address) => {
          store.address = address;
          await store.updateBalance(address)
        });
      }
      else if (window.web3.currentProvider.isMetaMask) {
        contract.login({
          metamask: true
        }, async (err, address) => {
          store.address = address;
          await store.updateBalance(address)
        });
      } else {
        contract.login({
          other: true
        }, async (err, address) => {
          store.address = address;
          await store.updateBalance(address)
        });
      }
    } else {
      contract.login({
        other: true
      }, async (err, address) => {
        store.address = address;
        await store.updateBalance(address)
      });
    }
  } else if (window.tomochain) {
    contract.login({
      pantograph: true
    }, async (err, address) => {
      store.address = address;
      await store.updateBalance(address)
    });
  }
}

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
