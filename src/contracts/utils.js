const BigNumber = require('bignumber.js/bignumber.js')

BigNumber.config({ EXPONENTIAL_AT: [-100, 100] })
export default {
  toTOMO(bigNum, isInt) {
    let nu = new BigNumber(bigNum)
    let num = nu.div(10 ** 18).toNumber()
    if (isInt) {
      return Math.floor(num);
    }
    else {
      return Math.floor(num * 10) / 10
    }
  }
}
