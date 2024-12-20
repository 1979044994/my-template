<template>
  <div class="page">
    <div class="loading-page">
      <img class="logo" :src="languageCo ? cnLogo : enLogo" alt="">
      <div v-if="languageCo" class="text">同人女神正在为你挑选专属标签， 请稍等片刻…</div>
      <div v-else class="text">The fangirl goddess is selecting a special tag just for you...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getAssetsImages } from "@/utils/image";

const prop = defineProps({
  Language: Boolean,
});
const lang = navigator.language
const enLogo = getAssetsImages('en-logo.png')
const cnLogo = getAssetsImages('cn-logo.png')
const languageCo = ref(false)
if (lang === 'zh-CN') {
  languageCo.value = true
} else {
  languageCo.value = false
}

</script>

<style lang="scss" scoped>
.page {
  width: 750px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: url(@/assets/loading.png) center center;
  background-size: 100% auto;
}

.loading-page {
  display: flex;
  flex-direction: column;
  align-items: center;

  height: 1300px;

  .logo {
    width: 649px;
    height: 314px;
    margin: 0 auto 170px auto;
  }

  .text {
    width: 620px;
    font-family: DengXian;
    font-size: 36px;
    color: #FF66B5;

    text-align: center;
    font-style: normal;
    text-transform: none;
  }
}
</style>
