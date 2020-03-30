const Web3 = require('web3')
const CandidateABI = require('./CandidateContract')
const PrivateKeyProvider = require('truffle-privatekey-provider')
const BigNumber = require('bignumber.js')
import store from '../store'

// let provider
// if (window.web3) {
//   provider = store.currentProvider
// } else {
//   provider = new Web3.providers.HttpProvider(process.env.VUE_APP_HTTP_RPC)
// }
// const web3 = new Web3(provider)


let web3 = null

async function loginViaPrivateKey(privateKey, cb) {
  if (privateKey) {
    try {
      let provider = new PrivateKeyProvider(privateKey, process.env.VUE_APP_HTTP_RPC)
      web3 = new Web3(provider);
      store.address = provider.addresses[0];
      web3.eth.defaultAccount = store.address;
      store.wallet = 'privatekey'
      await store.updateBalance(store.address)
    }
    catch (ex) {
      cb && cb('Cannot login with your private key');
    }
  }
}

function loginViaMetamask(cb) {
  if (typeof window.web3 == 'undefined') {
    return cb && cb('MetaMask is not installed')
  }

  web3 = new Web3(window.web3.currentProvider);

  window.web3.eth.getAccounts(async function (err, accounts) {
    if (err) {
      return null
    }
    else if (accounts.length === 0) {
      return null
    }
    store.wallet = 'metamask';
    if (Array.isArray(accounts)) {
      store.address = accounts[0];
    } else {
      store.address = accounts
    }
    await store.updateBalance(store.address)

    window.web3.version.getNetwork((err, netId) => {
      store.networkId = netId;
      if (netId !== process.env.VUE_APP_NETWORK_ID) {
        alert('Unknown network, change network to TomoChain, please');
      }
    });
  });
}
function loginViaPantograph(cb) {
  if (typeof window.tomochain == 'undefined') {
    return cb && cb('Pantograph is not installed')
  }

  web3 = new Web3(window.tomochain);

  window.web3.eth.getAccounts(async function (err, accounts) {
    if (err) {
      return null
    }
    else if (accounts.length === 0) {
      return null
    }
    store.wallet = 'pantograph';
    if (Array.isArray(accounts)) {
      store.address = accounts[0];
    } else {
      store.address = accounts
    }
    await store.updateBalance(store.address)

    window.web3.version.getNetwork((err, netId) => {
      store.networkId = netId;
      if (netId !== process.env.VUE_APP_NETWORK_ID) {
        alert('Unknown network, change network to TomoChain, please');
      }
    });
  });
}

function loginViaTomoWallet() {
  web3 = new Web3(window.web3.currentProvider);
  window.web3.eth.getAccounts(async function (err, accounts) {
    store.wallet = 'tomowallet';
    if (Array.isArray(accounts)) {
      store.address = accounts[0];
    } else {
      store.address = accounts
    }
    await store.updateBalance(store.address)
  });

  window.web3.version.getNetwork((err, netId) => {
    store.networkId = netId;
    if (netId !== process.env.VUE_APP_NETWORK_ID) {
      alert('Unknown network, change network to TomoChain, please');
    }
  });
}

function loginViaOtherBrowser() {
  web3 = window.web3
  window.web3.eth.getAccounts(async function (err, accounts) {
    store.wallet = 'other';
    if (Array.isArray(accounts)) {
      store.address = accounts[0];
    } else {
      store.address = accounts
    }
    await store.updateBalance(store.address)
  });

  // window.web3.version.getNetwork((err, netId) => {
  //   store.networkId = netId;
  //   if (netId !== process.env.VUE_APP_NETWORK_ID) {
  //     alert('Unknown network, change network to TomoChain, please');
  //   }
  // });
}

export default {
  login: function (data, cb) {
    if (data.privateKey) {
      loginViaPrivateKey(data.privateKey, cb);
    }
    else if (data.metamask) {
      loginViaMetamask(cb);
    }
    else if (data.tomowallet) {
      loginViaTomoWallet();
    }
    else if (data.trustwallet) {
      loginViaMetamask();
    } else if (data.other) {
      loginViaOtherBrowser()
    } else if (data.pantograph) {
      loginViaPantograph()
    }
  },
  stake: async function (_candidate, _amount) {
    let candidate = await new web3.eth.Contract(CandidateABI, _candidate)
    if (parseFloat(_amount) > parseFloat(store.balance)) {
      alert('Your balance is not enough')
    } else {
      try {
        _amount = new BigNumber(_amount)
        let wei = _amount.multipliedBy(10 ** 18)
        candidate.methods.stake().send({
          value: wei.toString(),
          from: store.address,
          gasLimit: web3.utils.toHex(3000000),
          gasPrice: web3.utils.toHex(web3.utils.toWei('0.25', 'gwei'))
        }, async (error, txHash) => {
          if (error) {
            alert('There are something errors! Please try again later.')
          } else {
            let sInterval = setInterval(async () => {
              let receipt = await web3.eth.getTransactionReceipt(txHash)
              if (receipt) {
                await store.updateBalance(store.address)
                clearInterval(sInterval);
              }
            }, 500);

            window.location = `#/result/staked/${_candidate}/${_amount.toString()}/${txHash}`
          }
        })
      } catch (e) {
        alert('There are something errors! Please try again later')
      }
    }
  },

  unstake: async function (_candidate, _amount) {
    let candidate = await new web3.eth.Contract(CandidateABI, _candidate)
    _amount = new BigNumber(_amount)
    let wei = _amount.multipliedBy(10 ** 18).toString()
    await candidate.methods.unstake(wei).send({
      from: store.address,
      gasLimit: web3.utils.toHex(3000000),
      gasPrice: web3.utils.toHex(web3.utils.toWei('0.25', 'gwei'))
    }, async (error, txHash) => {
      if (error) {
        alert('There are something errors! Please try again later.')
      } else {
        let sInterval = setInterval(async () => {
          let receipt = await web3.eth.getTransactionReceipt(txHash)
          if (receipt) {
            await store.updateBalance(store.address)
            clearInterval(sInterval);
          }
        }, 500);
        window.location = `#/result/unstaked/${_candidate}/${_amount.toString()}/${txHash}`
      }
    })

  },

  getCurrentStakerCapacity: async function (_candidate, _staker) {
    let candidate = new web3.eth.Contract(CandidateABI, _candidate)
    let currentCapacity = await candidate.methods.getCurrentStakerCap(_staker).call()
    if (currentCapacity) {
      currentCapacity = new BigNumber(currentCapacity)
      return currentCapacity.dividedBy(10 ** 18).toNumber()
    }
    return 0
  },

  voteResign: async function (_candidate) {
    let candidate = await new web3.eth.Contract(CandidateABI, _candidate)
    candidate.methods.communityVote(true).send({
      from: store.address,
      gasLimit: web3.utils.toHex(3000000),
      gasPrice: web3.utils.toHex(web3.utils.toWei('0.25', 'gwei'))
    }, (error, txHash) => {
      if (error) {
        alert('There are something errors! Please try again later.')
      } else {
        store.updateBalance()
        window.location = `#/result/voteResign/${_candidate}/0/${txHash}`
      }
    })
  },

  unVoteResign: function (_candidate) {
    let candidate = new web3.eth.Contract(CandidateABI, _candidate)
    candidate.methods.communityVote(false).send({
      from: store.address,
      gasLimit: web3.utils.toHex(3000000),
      gasPrice: web3.utils.toHex(web3.utils.toWei('0.25', 'gwei'))
    }, async (error, txHash) => {
      if (error) {
        alert('There are something errors! Please try again')
      } else {
        window.location = `#/result/unVoteResign/${_candidate}/0/${txHash}`
      }
    })
  },

  checkIsVoted: async function(_candidate) {
    let candidate = await new web3.eth.Contract(CandidateABI, _candidate)
    return await candidate.methods.isVoted(store.address).call()
  },
  checkHasProblem: async function(_candidate) {
    let candidate = await new web3.eth.Contract(CandidateABI, _candidate)
    let currentEpoch = await candidate.methods.currentEpoch().call()
    try {
      let lastWithdrawEpoch = await candidate.methods.getLastWithdrawEpochOfStaker(store.address).call()

      console.log('duration', currentEpoch - lastWithdrawEpoch)
      if (currentEpoch - lastWithdrawEpoch > 1000) {
        return true
      }
      return false
    } catch (e) {
      return false
    }

  },

  propose: async function (_candidate) {
    let candidate = await new web3.eth.Contract(CandidateABI, _candidate)
    try {
      await candidate.methods.propose().send({
        from: store.address,
        gasLimit: web3.utils.toHex(3000000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('0.25', 'gwei'))
      }, async (error, txHash) => {
        if (error) {
          alert('There are something errors! Please try again')
        } else {
          window.location = `#/result/proposed/${_candidate}/0/${txHash}`
        }
      })


    } catch (e) {
      alert('Something error!')
    }

  },

  resign: function (_candidate) {
    let candidate = new web3.eth.Contract(CandidateABI, _candidate)
    candidate.methods.resign().send({
      from: store.address,
      gasLimit: web3.utils.toHex(3000000),
      gasPrice: web3.utils.toHex(web3.utils.toWei('0.25', 'gwei'))
    }, async (error, txHash) => {
      if (error) {
        alert('There are something errors! Please try again')
      } else {
        window.location = `#/result/resign/${_candidate}/0/${txHash}`
      }
    })
  },

  withdrawRewards: function (_candidate) {
    let candidate = new web3.eth.Contract(CandidateABI, _candidate)
    candidate.methods.withdrawAllRewardsOfStaker(store.address).send({
      from: store.address,
      gasLimit: web3.utils.toHex(3000000),
      gasPrice: web3.utils.toHex(web3.utils.toWei('0.25', 'gwei'))
    }, async (error, txHash) => {
      if (error) {
        alert('There are something errors! Please try again')
      } else {
        window.location = `#/result/withdrawRewards/${_candidate}/0/${txHash}`
      }
    })
  },

  computeReward: async function (_candidate) {
    let candidate = new web3.eth.Contract(CandidateABI, _candidate)
    try {
      let reward = await candidate.methods.computeTotalStakerReward(store.address).call()
      if (reward) {
        reward = new BigNumber(reward)
        return reward.div(10 ** 18).toNumber()
      }
    } catch (e) {
      return 0
    }

    return 0
  },

  fillRewardsPerEpoch: async function(_candidate) {
    let candidate = new web3.eth.Contract(CandidateABI, _candidate)
    // await candidate.methods.fillRewardsPerEpoch().send({from: store.address})
    await new Promise((resolve, reject) => {
      candidate.methods.fillRewardsPerEpoch().send({
        from: store.address,
        gasLimit: web3.utils.toHex(3000000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('0.25', 'gwei'))
      }, function (err) {
        if (err) {
          return reject(err)
        } else {
          return resolve()
        }
      }).catch()
    })
  },

  withdrawStake: async function(_candidate, _blockWithdraw) {
    let candidate = new web3.eth.Contract(CandidateABI, _candidate)
    candidate.methods.withdrawStake(_blockWithdraw).send({
      from: store.address,
      gasLimit: web3.utils.toHex(3000000),
      gasPrice: web3.utils.toHex(web3.utils.toWei('0.25', 'gwei'))
    }, async (error, txHash) => {
      if (error) {
        alert('There are something errors! Please try again')
      } else {
        window.location = `#/result/withdrawStake/${_candidate}/0/${txHash}`
      }
    })
  },

  isAlreadyWithdrawAfterResign: async function(_candidate, _staker, checkStakeLock) {
    let candidate = new web3.eth.Contract(CandidateABI, _candidate)
    return await candidate.methods.isAlreadyWithdrawAfterResign(_staker, checkStakeLock)
  },

  isWithdrawAfterResignAvailable: async function(_candidate, _staker, checkStakeLock) {
    let candidate = new web3.eth.Contract(CandidateABI, _candidate)
    return await candidate.methods.isWithdrawAfterResignAvailable(_staker, checkStakeLock)
  },

  transferStake: function(_candidate, _to, _amount) {
    if (!web3.utils.isAddress(_to)) {
      return alert('Receiver is not address')
    }
    let candidate = new web3.eth.Contract(CandidateABI, _candidate)
    try {
      _amount = new BigNumber(_amount)
      let wei = _amount.multipliedBy(10 ** 18)
      candidate.methods.transferStake(_to, wei.toString()).send({
        from: store.address,
        gasLimit: web3.utils.toHex(3000000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('0.25', 'gwei'))
      }, async (error, txHash) => {
        if (error) {
          alert('There are something errors! Please try again later.')
        } else {
          let sInterval = setInterval(async () => {
            let receipt = await web3.eth.getTransactionReceipt(txHash)
            if (receipt) {
              await store.updateBalance(store.address)
              clearInterval(sInterval);
            }
          }, 500);

          window.location = `#/result/staked/${_candidate}/${_amount.toString()}/${txHash}`
        }
      })
    } catch (e) {
      alert('There are something errors! Please try again later')
    }
  },

}
