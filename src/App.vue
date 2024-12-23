<template>
  <LoadingPage :openTrigger="openTrigger" v-if="isLoading" @componentDestroy="handleComponentDestroy" />
  <div v-if="firstPage" class="firstpage">
    <!-- <SequenceFrameAnimationImg :animation-speed="1" v-preload @component-loaded="handleComponentLoaded"
      @video-ended="handleVideoEnded" class="back" imgUrl="back" :start="false">
      <template v-slot:audio>
        <AudioPlayer ref="audioPlayer" @click="handleAudioStart" :src="audioSrc" />
      </template>
    </SequenceFrameAnimationImg> -->

    <SequenceFrameAnimationVideo :animation-speed="0.5" v-preload @component-loaded="handleComponentLoaded"
      @video-ended="handleVideoEnded" class="back" imgUrl="back" :start="false">
      <template v-slot:audio>
        <AudioPlayer ref="audioPlayer" @click="handleAudioStart" />
      </template>
    </SequenceFrameAnimationVideo>
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
import 'swiper/css';
import 'swiper/css/mousewheel';
import 'swiper/css/pagination';
import { Mousewheel, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { ref } from 'vue';
import AudioPlayer from './components/AudioPlayer.vue';
import LoadingPage from './components/LoadingPage.vue';
import SequenceFrameAnimationVideo from './components/SequenceFrameAnimationVideo.vue';


let swiperInstance = ref()
let firstPage = ref(true)

const openTrigger = ref(false);

const onSwiper = (swiper: any) => {
  swiperInstance.value = swiper
  console.log(swiper);
};
const onSlideChange = (swiper: { activeIndex: any; }) => {
  const { activeIndex } = swiper

  console.log('slide change', swiper, activeIndex);
};
const modules = [Pagination, Navigation, Mousewheel];

const handleVideoEnded = (e: any) => {
  console.log('video ended', e);
  firstPage.value = false
}
const handleComponentDestroy = () => {
  console.log('子组件已完成开门动画并即将销毁');
  isLoading.value = false
  // 这里可以添加更多的逻辑，比如从父组件的数据中移除对子组件相关的引用等，
  // 或者进行一些界面上的调整（虽然很多情况下Vue会自动处理组件销毁后的DOM更新等）
};
const isLoading = ref(true);
// 定义处理子组件加载完成事件的函数
const handleComponentLoaded = () => {
  console.log('component loaded');
  openTrigger.value = true;
  // isLoading.value = false; // 子组件加载完成后，隐藏loading页面
};

//音频操作
const audioSrc = ref('your_audio_file.mp3');
const audioPlayer = ref<InstanceType<typeof AudioPlayer> | null>(null);

const handleAudioStart = () => {
  if (audioPlayer.value) {
    if (audioPlayer.value.isPlaying) {
      audioPlayer.value.pauseAudio();
    } else {
      audioPlayer.value.playAudio();
    }
  }
}
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
