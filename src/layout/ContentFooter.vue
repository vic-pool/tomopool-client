<template>
  <div class="footer text-center mt-3">
    <a :href="telegram" class="icon ml-3">
      <img src="@/assets/logo/telegram-logo.svg" alt="github" height="35px">
    </a>
    <a :href="twitter" class="icon ml-3">
      <img src="@/assets/logo/twitter-logo.svg" alt="github" height="35px">
    </a>
    <a href="https://github.com/tomo-pool/tomo-pool" class="icon ml-3">
      <img src="@/assets/logo/github-120px.png" alt="github" height="35px">
    </a>
    <a :href="'https://scan.tomochain.com/address/' + candidate" class="icon ml-3">
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
      telegram: process.env.VUE_APP_TELEGRAM,
      twitter: process.env.VUE_APP_TWITTER,
      year: new Date().getFullYear()
    };
  }
};
</script>
<style></style>
