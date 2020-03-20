<template>

  <div class="footer text-center">
    <a href="https://t.me/coin98pool" class="icon ml-3" target="_blank">
      <img src="@/assets/logo/telegram-logo.svg" alt="github" height="35px">
    </a>
    <a href="https://twitter.com/coin98_net" class="icon ml-3" target="_blank">
      <img src="@/assets/logo/twitter-logo.svg" alt="github" height="35px">
    </a>
    <a href="https://github.com/tomo-pool/tomo-pool" class="icon ml-3" target="_blank">
      <img src="@/assets/logo/github-120px.png" alt="github" height="35px">
    </a>
    <a :href="'https://scan.tomochain.com/address/' + candidate" class="icon ml-3" target="_blank">
      <img src="@/assets/logo/tomo-scan-logo.svg" alt="github" height="35px">
    </a>
    <div class="mt-3">
      © {{year}} TomoPool Team
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      candidate: process.env.VUE_APP_CANDIDATE_ADDRESS,
      year: new Date().getFullYear()
    };
  }
};
</script>
<style></style>
