<template>
  <LoadingPage :openTrigger="openTrigger" v-if="!isLoading" @componentDestroy="handleComponentDestroy" />
  <div v-if="!firstPage" class="firstpage">
    <SequenceFrameAnimation @video-ended="handleVideoEnded" @component-loaded="handleComponentLoaded">
      <template v-slot:icon>
        <div class="icon"></div>
      </template>
      <template v-slot:audio>
        <AudioPlayer ref="audioPlayer" :src="audioSrc" @click="handleAudioStart" />
      </template>
    </SequenceFrameAnimation>
  </div>
  <div v-else>
    <Swiper @swiper="onSwiper" @init="init" @slide-change-transition-end="slideChangeTransitionEnd"
      @slideChange="onSlideChange" direction="vertical" :modules="modules" class="mySwiper">
      <swiper-slide>
        <div class="squre ">
          <div swiper-animate-effect="animate__fadeIn" swiper-animate-duration="1s" class="title animation">

          </div>
          <div swiper-animate-effect="animate__fadeIn" swiper-animate-duration="1s" class="content normal animation">
            <span>主公在过去一年累计增加</span>
            <div class="center"><span class="red-text">18378945</span>帅点</div>
            <div>任<span class="red-text">表骑将军</span></div>
            <img class="level-icon" src="https://yjcmndzb.sanguosha.com/home-icon.png" alt="">
            <div class="beyong">超越 <span class="yellow">99.99%</span> 的主公</div>
          </div>
          <div swiper-animate-effect="animate__fadeIn" swiper-animate-duration="1s" class="line animation"></div>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div class="squre">
          <div swiper-animate-effect="animate__fadeIn" swiper-animate-duration="1s" class="title animation">
          </div>
          <div swiper-animate-effect="animate__fadeIn" swiper-animate-duration="1s" class="line animation"></div>
          <div swiper-animate-effect="animate__fadeIn" swiper-animate-duration="1s" class="normal animation">
            <span>全年累计击败敌将数</span>
            <span class="red-text">9999</span>
            <div class="num-two">
              <span>在s99赛季 <span class="red">模式名称</span> 中 取得最高连胜数</span>
              <span class="red-text">9999</span>
            </div>
          </div>
          <div swiper-animate-effect="animate__fadeIn" swiper-animate-duration="3s" class="content">
            <div swiper-animate-effect="animate__fadeInRight" swiper-animate-duration="0.6s"
              class="content-item animation">
              <div class="mode">
                <img class="mode-icon" src="https://yjcmndzb.sanguosha.com/level-icon.png" alt="">
                <div class="mode-name">2v2排位</div>
              </div>
              <div class="optimum">本年度最高段位</div>
            </div>
            <div swiper-animate-effect="animate__fadeInRight" swiper-animate-duration="0.9s"
              class="content-item animation">
              <div class="mode">
                <div class="mode-text red">9999</div>
                <div class="mode-name black">身份休闲</div>
              </div>
              <div class="optimum">本年度最高积分</div>
            </div>
            <div swiper-animate-effect="animate__fadeInRight" swiper-animate-duration="1.2s"
              class="content-item animation">
              <div class="mode">
                <div class="mode-text red">9999</div>
                <div class="mode-name black">国战天梯</div>
              </div>
              <div class="optimum">本年度最高积分</div>
            </div>
          </div>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div class="squre">
          <div swiper-animate-effect="animate__fadeIn" swiper-animate-duration="1s" class="title animation">
            <div class="fb"></div>
          </div>
          <div swiper-animate-effect="animate__fadeInDownBig" swiper-animate-duration="1.2s"
            style="background-image: url(https://yjcmndzb.sanguosha.com/avatar.png);"
            class="general general-one animation">
            <img class="general-avatar" src="@/assets/gennel-border.webp" alt="">
            <div class="gennger-rate">
              <div class="more-rate"><span class="rate">39</span> %</div>
              <div class="feng">/</div>
              <span class="num">50场</span>
            </div>
            <div class="gennger-name">谋贾诩</div>
          </div>
          <div swiper-animate-effect="animate__fadeInDownBig" swiper-animate-duration="0.9s"
            style="background-image: url(https://yjcmndzb.sanguosha.com/avatar.png);"
            class="general general-two animation">
            <img class="general-avatar" src="@/assets/gennel-border.webp" alt="">
            <div class="gennger-rate">
              <div class="more-rate"><span class="rate">39</span> %</div>
              <div class="feng">/</div>
              <span class="num">50场</span>
            </div>
            <div class="gennger-name">谋贾诩</div>
          </div>
          <div swiper-animate-effect="animate__fadeInDownBig" swiper-animate-duration="0.6s"
            style="background-image: url(https://yjcmndzb.sanguosha.com/avatar.png);"
            class="general general-three animation">
            <img class="general-avatar" src="@/assets/gennel-border.webp" alt="">
            <div class="gennger-rate">
              <div class="more-rate"><span class="rate">39</span> %</div>
              <div class="feng">/</div>

              <span class="num">50场</span>
            </div>
            <div class="gennger-name">谋贾诩</div>
          </div>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div class="squre">
          <div swiper-animate-effect="animate__fadeIn" swiper-animate-duration="1s" class="title animation">
          </div>
          <div swiper-animate-effect="animate__fadeInRight" swiper-animate-duration="1s" class="zzq-right animation">

            <div class="zzq-level"></div>
            <div class="zzq-num">9999</div>
            <div class="zzq-text">自走棋模式最高段位</div>
          </div>
          <div swiper-animate-effect="animate__fadeInUpBig" swiper-animate-duration="1s" class="zzq-boder animation">
            <div class="zzq-header">
              <div class="header-item">
                <span class="red-text">14543</span>
                <span>游玩局数</span>
              </div>
              <div class="header-item">
                <span class="red-text">14543</span>
                <span>四强次数</span>
              </div>
              <div class="header-item">
                <span class="red-text">14543</span>
                <span>夺冠次数</span>
              </div>
            </div>
            <div class="zzq-waist">
              <div class="waist-item">
                <span class="red-text">14543</span>
                <span>淘汰主公数</span>
              </div>
              <div class="waist-item">
                <span class="red-text">14543</span>
                <span>消灭武将数</span>
              </div>
            </div>
            <div class="zzq-body">
              <div class="body-item" style="background-image: url(https://yjcmndzb.sanguosha.com/avatar.png);">
                <div class="body-border">
                  <div class="body-name vertical">张角</div>
                </div>

              </div>
              <div class="body-item" style="background-image: url(https://yjcmndzb.sanguosha.com/avatar.png);">
                <div class="body-border">
                  <div class="body-name vertical">李世民</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </swiper-slide>
      <swiper-slide>
        <div class="squre">
          <div swiper-animate-effect="animate__fadeIn" swiper-animate-duration="1s" class="title animation">
          </div>
          <div swiper-animate-effect="animate__fadeInUpBig" swiper-animate-duration="1s" class="events animation">
            <div class="level-info">
              <span class="level-title">2024年,三国杀技术等级评定正式上线 主公踊跃参与，荣获评级</span>
              <div class="level-num">
                <img class="major" src="@/assets/major.webp" alt="">
                <span class="amateur-color">业余一段</span>
              </div>
            </div>

            <div v-if="false" class="events-border">
              <div class="events-title">
                小杀全民赛也在2024年全面焕新
              </div>
              <div class="line"></div>
              <div class="num">
                <span> 主公夺得全民赛胜场数</span>
                <span class="red-text">999</span>
              </div>
              <div class="line"></div>
              <div class="num">
                <span> 主公夺得全民赛胜场数</span>
                <span class="red-text">999</span>
              </div>
              <div class="line"></div>
              <div class="events-footer">
                小杀全民赛也在2024年全面焕新
              </div>
            </div>
            <div class="events-borders">
              <div class="events-title">
                2024,小杀全民赛再启航，他们站上荣耀之巅
              </div>
              <div class="events-body">
                <div v-for="(item, index) in prizeList" class="reason-item">
                  <div class="reason-header">- S{{ index + 2 }} -</div>
                  <div class="reason-box">
                    <span class="name">{{ item.name }}</span>
                    <span class="name">{{ item.prize }}</span>
                  </div>
                </div>
              </div>
              <div class="line"></div>
              <div class="events-footer">
                未来，期待你能大放异彩
              </div>
            </div>
          </div>

        </div>
      </swiper-slide>
      <swiper-slide>
        <div class="squre">
          <div swiper-animate-effect="animate__fadeIn" swiper-animate-duration="1s" class="title animation">
          </div>
          <div swiper-animate-effect="animate__fadeInLeft" swiper-animate-duration="1s" class="animation main">
            <div class="line"></div>
            <div class="achievement ">

              <div class="achievement-item">
                <span class="time">2023年3月15日</span>
                <p class="content">
                  通过 <span class="red"> 最多有六个字</span>,获 得了武将<span class="red"> 最多有六个 字</span>,天降洪福，举世皆 惊
                </p>
              </div>
              <div class="achievement-item">
                <span class="time">2023年3月15日</span>
                <p class="content">
                  通过<span class="red"> 最多有六个字</span>,获得 了皮肤<span class="red"> 最多有六个字</span>,鸿 运当头，幸哉幸哉
                </p>
              </div>
              <div class="achievement-item">
                <span class="time">2023年3月15日</span>
                <p class="content">
                  是用普通转生丹成功获得<span class="red">两字</span>将 灵<span class="red"> 三个字</span>,转生轮回，逆天改命
                </p>
              </div>
              <div class="achievement-item">
                <span class="time">2023年3月15日</span>
                <p class="content">
                  主公发动了<span class="red">121</span>次战役，整个三国都被你如滔天之 焰的斗志点亮
                </p>
              </div>
              <div class="achievement-item">
                <span class="time">2023年3月15日</span>
                <p class="content">
                  主公于<span class="red">23:50</span>发动了今年最晚的一次战斗，敌将在 半睡半醒之间被你轻松解决
                </p>
              </div>
            </div>
          </div>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div class="squre">
          <div class="home">

          </div>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div class="squre">
          <div class="home">

          </div>
        </div>
      </swiper-slide>
    </Swiper>
  </div>
</template>
<script setup lang="ts">
import { swiperAnimate, swiperAnimateCache } from '@/utils/swiper.animate';
import 'animate.css';
import 'swiper/css';
import 'swiper/css/mousewheel';
import 'swiper/css/pagination';
import { Mousewheel, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { ref } from 'vue';
import LoadingPage from './components/LoadingPage.vue';
import SequenceFrameAnimation from './components/SequenceFrameAnimation.vue';
// import SequenceFrameAnimationVideo from './components/SequenceFrameAnimationVideo.vue';
import AudioPlayer from './components/AudioPlayer.vue';
//获奖名单
const prizeList = [
  {
    name: '泪染樱花醉',
    prize: '振帅',
  },
  {
    name: '幽州颜阳州',
    prize: '加⁢仑⁣⁠⁣',
  },
  {
    name: '小内也无敌',
    prize: '国战最强玩家',
  },
  {
    name: '军哥你个捞坤',
    prize: '真布公主殿下',
  }
]


let swiperInstance = ref()
let firstPage = ref(true)

const openTrigger = ref(false);

const onSwiper = (swiper: any) => {
  swiperInstance.value = swiper
  console.log(swiper);
};
const init = (e: any) => {
  swiperAnimateCache()
  swiperAnimate(e)
}
const slideChangeTransitionEnd = (e: any) => {

  swiperAnimate(e);
}
function getRandomBoolean() {
  return Math.random() < 0.5;
}

const onSlideChange = (swiper: { activeIndex: any; }) => {
  const { activeIndex } = swiper
  // new WOW().init()
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
// .firstpage {
//   position: relative;
//   width: 100%;
//   height: 100vh;
//   background: url(./assets/bg.png) no-repeat;
//   background-size: cover;

//   .back {
//     width: 100%;
//     height: 100%;
//   }
// }

.icon {
  position: absolute;
  top: 45px;
  left: 31px;
  width: 154px;
  height: 89px;
  background: url(./assets/logo.png) no-repeat;
  background-size: cover;
  z-index: 9;
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
