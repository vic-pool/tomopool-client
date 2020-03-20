import utils  from './contracts/utils'
let store = {
  address: '',
  balance: 0,
  wallet: '',
  networkId: 0,
  async updateBalance(address) {
    await new Promise((resolve, reject) => {
      window.web3.eth.getBalance(address, function (err, data) {
        if (err) {
          return reject(err)
        }
        store.balance = utils.toTOMO(data, false)
        return resolve()
      })
    })
  },
  currentProvider: {},
  candidateAddress: process.env.VUE_APP_CANDIDATE_ADDRESS
};

export default store;
