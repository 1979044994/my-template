<template>
  <div v-if="firstPage" class="firstpage">
    <!-- <SequenceFrameAnimationImg imgUrl="hand" class="hand" /> -->
    <SequenceFrameAnimationImg :animationSpeed="0.9" class="back" imgUrl="back" :start="false" />
    <!-- <SequenceFrameAnimationImg class="light" imgUrl="arrow" :start="false" />

    <SequenceFrameAnimationImg class="word" imgUrl="word" :start="false" /> -->
    <!-- <SequenceFrameAnimation /> -->
  </div>
  <div v-else>
    <Swiper :allow-touch-move="false" @swiper="onSwiper" @slideChange="onSlideChange" :direction="'vertical'"
      :modules="modules" class="mySwiper">
      <swiper-slide>
        <div class="squre">
          <!-- <div class="home" ref="homeRef" @touchstart="handleTouchStart" @pointerdown="handleMouseStart"
            @pointerup="handleMouseEnd" @touchend="handleTouchEnd">

          </div> -->
        </div>
      </swiper-slide>
    </Swiper>
  </div>
</template>

<script lang="ts" setup>
import SequenceFrameAnimationImg from '@/components/SequenceFrameAnimationImg.vue';
import 'swiper/css';
import 'swiper/css/mousewheel';
import 'swiper/css/pagination';
import { Mousewheel, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { ref } from 'vue';
let swiperInstance = ref()
let firstPage = ref(true)
const onSwiper = (swiper: any) => {
  swiperInstance.value = swiper
  console.log(swiper);
};
const onSlideChange = (swiper: { activeIndex: any; }) => {
  const { activeIndex } = swiper

  console.log('slide change', swiper, activeIndex);
};
const modules = [Pagination, Navigation, Mousewheel];
</script>

<style scoped lang="scss">
.firstpage {
  position: relative;
  width: 100%;
  height: 100vh;
  background: url(./assets/bg.png) no-repeat;
  background-size: cover;

  .back {
    width: 100%;
    height: 100%;
  }
}

.squre {
  width: 100%;
  height: 100vh;
  background-color: #f00;
}

.light {
  width: 182px;
  height: 192px;
}

.hand {
  position: absolute;
}

.word {
  width: 528px;
  height: 834px;
}
</style>
