<template>
  <AudioPlayer ref="audioPlayer" :src="audioSrc" @click="handleAudioStart" />
  <LoadingPage :openTrigger="openTrigger" v-if="isLoading" @componentDestroy="handleComponentDestroy" />
  <transition name="fade" mode="out-in">
    <div v-if="firstPage" class="firstpage">
      <SequenceFrameAnimation @video-ended="handleVideoEnded" @component-loaded="handleComponentLoaded">
        <template v-slot:icon>
          <div class="icon"></div>
        </template>
      </SequenceFrameAnimation>
    </div>
    <div v-else>
      <Swiper @swiper="onSwiper" @init="init" @slide-change-transition-end="slideChangeTransitionEnd"
        @slideChange="onSlideChange" direction="vertical" class="mySwiper">
        <swiper-slide>
          <div class="squre first">
            <div v-if="reportData && reportData.is_new !== 1 && reportData.is_qq !== 1"
              swiper-animate-effect="animate__fadeIn" swiper-animate-duration="1s" class="title animation">

            </div>
            <div v-if="reportData && reportData.is_new !== 1 && reportData.is_qq !== 1"
              swiper-animate-effect="animate__fadeIn" swiper-animate-duration="1s" class="content normal animation">
              <span>主公在过去一年累计增加</span>
              <div class="center"><span class="red-text">{{ reportData?.add_shuai_dian }}</span>帅点</div>
              <div>任<span class="red-text">{{ reportData?.office_level_name }}</span></div>
              <img class="level-icon" :src="reportData?.office_level_img" alt="">
              <div class="beyong">超越 <span class="yellow">{{ reportData?.shuai_dian_rate }}</span> 的主公</div>
            </div>
            <div v-if="reportData && reportData.is_new !== 1 && reportData.is_qq !== 1"
              swiper-animate-effect="animate__fadeIn" swiper-animate-duration="1s" class="line animation"></div>
            <div class="other" v-else>
              <div v-if="reportData && reportData.is_qq == 1" class="red-text">抱歉，您当前的渠道不支持 生成年度战报</div>
              <div v-if="reportData && reportData.is_new == 1" class="red-text">抱歉，未能查询到足够的数据 生成年度战报</div>
              <div class="gift">小杀奉上薄礼一份，<br />
                主公可至游戏内信件中领取~</div>
            </div>
          </div>
        </swiper-slide>
        <template v-if="reportData && reportData.is_new !== 1 && reportData.is_qq !== 1">
          <swiper-slide>
            <div class="squre second">
              <div swiper-animate-effect="animate__fadeIn" swiper-animate-duration="1s" class="title animation">
              </div>
              <div swiper-animate-effect="animate__fadeIn" swiper-animate-duration="1s" class="line animation"></div>
              <div swiper-animate-effect="animate__fadeIn" swiper-animate-duration="1s" class="normal animation">
                <span>全年累计击败敌将数</span>
                <span class="red-text">{{ reportData?.beat_general }}</span>
                <div class="num-two">
                  <span>在S{{ reportData?.most_win_season
                    }}赛季<span class="red">{{ reportData?.most_win_mode }}</span> 中取得最高连胜数</span>
                  <span class="red-text">{{ reportData?.most_win }}</span>
                </div>
              </div>
              <div class="content">
                <div swiper-animate-effect="animate__fadeInRight" swiper-animate-duration="0.6s"
                  class="content-item animation">
                  <div class="mode">
                    <img class="mode-icon" :src="reportData?.joy_rank_img" alt="">
                    <div class="mode-name">{{ reportData?.joy_mode }}</div>
                  </div>
                  <div class="optimum">本年度最高段位</div>
                </div>
                <div swiper-animate-effect="animate__fadeInRight" swiper-animate-duration="0.9s"
                  class="content-item animation">
                  <div class="mode">
                    <div class="mode-text red">{{ reportData?.sf_score > 0 ? reportData?.sf_score : 1000 }}</div>
                    <div class="mode-name black">{{ reportData?.sf_name ? reportData?.sf_name : '身份休闲' }}</div>
                  </div>
                  <div class="optimum">本年度最高积分</div>
                </div>
                <div swiper-animate-effect="animate__fadeInRight" swiper-animate-duration="1.2s"
                  class="content-item animation">
                  <div class="mode">
                    <div class="mode-text red">{{ reportData?.nation_score > 0 ? reportData?.nation_score : 1000 }}
                    </div>
                    <div class="mode-name black">{{ reportData?.nation_name ? reportData?.nation_name : '国战天梯' }}</div>
                  </div>
                  <div class="optimum">本年度最高积分</div>
                </div>
              </div>
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="squre third">
              <div swiper-animate-effect="animate__fadeIn" swiper-animate-duration="1s" class="title animation">
                <div class="fb"></div>
              </div>
              <div v-if="reportData?.g3_name" swiper-animate-effect="animate__fadeInDownBig"
                swiper-animate-duration="1.2s" class="general general-one animation">
                <img class="general-avatar" src="@/assets/gennel-border.webp" alt="">
                <img class="avatar-img" :src="reportData?.g3_img" alt="">
                <div class="gennger-rate">

                </div>
                <div class="general-text">
                  <div class="more-rate"><span class="rate">{{
                    reportData && reportData.g3_rate ?
                      Math.floor(parseFloat(reportData.g3_rate.replace('%', ''))) :
                      0
                  }}</span> %</div>
                  <div class="feng">/</div>
                  <span class="num">{{ reportData?.g3_num }}场</span>
                </div>
                <div class="gennger-name">{{ reportData?.g3_name }}</div>
              </div>
              <div v-if="reportData?.g2_name" swiper-animate-effect="animate__fadeInDownBig"
                swiper-animate-duration="0.9s" class="general general-two animation">
                <img class="general-avatar" src="@/assets/gennel-border.webp" alt="">
                <img class="avatar-img" :src="reportData?.g2_img" alt="">
                <div class="gennger-rate">

                </div>
                <div class="general-text">
                  <div class="more-rate"><span class="rate">{{
                    reportData && reportData.g2_rate ?
                      Math.floor(parseFloat(reportData.g2_rate.replace('%', ''))) :
                      0
                  }}</span> %</div>
                  <div class="feng">/</div>
                  <span class="num">{{ reportData?.g2_num }}场</span>
                </div>
                <div class="gennger-name">{{ reportData?.g2_name }}</div>
              </div>
              <div swiper-animate-effect="animate__fadeInDownBig" swiper-animate-duration="0.6s"
                class="general general-three animation">
                <img class="avatar-img" :src="reportData?.g1_img" alt="">
                <img class="general-avatar" src="@/assets/gennel-border.webp" alt="">
                <div class="gennger-rate">

                </div>
                <div class="general-text">
                  <div class="more-rate"><span class="rate"> {{
                    reportData && reportData.g1_rate ?
                      Math.floor(parseFloat(reportData.g1_rate.replace('%', ''))) :
                      0
                  }}</span> %</div>
                  <div class="feng">/</div>

                  <span class="num">{{ reportData?.g1_num }}场</span>
                </div>
                <div class="gennger-name">{{ reportData?.g1_name }}</div>
              </div>
            </div>
          </swiper-slide>
          <swiper-slide v-if="reportData && reportData.zzq_num > 0">
            <div class="squre fourth">
              <div swiper-animate-effect="animate__fadeIn" swiper-animate-duration="1s" class="title animation">
              </div>
              <div swiper-animate-effect="animate__fadeInRight" swiper-animate-duration="1s"
                class="zzq-right animation">

                <div class="zzq-level">

                  <img class="zzq-level-img" :src="reportData?.zzq_rank_img" alt="">
                </div>
                <div class="zzq-num">{{ reportData?.zzq_rank_score }}</div>
                <div class="zzq-text">自走棋模式最高段位</div>
              </div>
              <div swiper-animate-effect="animate__fadeInUpBig" swiper-animate-duration="1s"
                class="zzq-boder animation">
                <div class="zzq-header">
                  <div class="header-item">
                    <span class="red-text">{{ reportData?.zzq_num }}</span>
                    <span>游玩局数</span>
                  </div>
                  <div class="header-item">
                    <span class="red-text">{{ reportData?.zzq_four }}</span>
                    <span>四强次数</span>
                  </div>
                  <div class="header-item">
                    <span class="red-text">{{ reportData?.zzq_win }}</span>
                    <span>夺冠次数</span>
                  </div>
                </div>
                <div class="zzq-waist">
                  <div class="waist-item">
                    <span class="red-text">{{ reportData?.zzq_kill_general }}</span>
                    <span>淘汰主公数</span>
                  </div>
                  <div class="waist-item">
                    <span class="red-text">{{ reportData?.zzq_kill_chess }}</span>
                    <span>消灭武将数</span>
                  </div>
                </div>
                <div class="zzq-body">
                  <div class="body-item">
                    <img class="body-avatar" :src="reportData?.zzq_total_general_img" alt="">
                    <div class="body-border">
                      <div class="body-name vertical">{{ reportData?.zzq_total_general_name }}</div>
                    </div>
                  </div>
                  <div class="body-item">
                    <img class="body-avatar" :src="reportData?.zzq_four_general_img" alt="">
                    <div class="body-border">
                      <div class="body-name vertical">{{ reportData?.zzq_four_general_name }}</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="squre fifth">
              <div swiper-animate-effect="animate__fadeIn" swiper-animate-duration="1s" class="title animation">
              </div>
              <div swiper-animate-effect="animate__fadeInUpBig" swiper-animate-duration="1s" class="events animation">
                <div v-if="reportData?.qm_dw" class="level-info">
                  <span class="level-title">2024年,三国杀技术等级评定正式上线 主公踊跃参与，荣获评级</span>
                  <div class="level-num">
                    <img class="major" v-if="checkSpeciality(reportData?.qm_dw)" src="@/assets/major.webp" alt="">
                    <img v-else src="@/assets/amateur.webp" class="amateur" alt="">
                    <span :class="checkSpeciality(reportData?.qm_dw) ? 'major-color' : 'amateur-color'">{{
                      reportData?.qm_dw
                    }}</span>
                  </div>
                </div>

                <div v-if="reportData && reportData.qm" class="events-border">
                  <div class="events-title">
                    小杀全民赛也在2024年全面焕新
                  </div>
                  <div class="line"></div>
                  <div class="num">
                    <span> 主公夺得全民赛胜场数</span>
                    <span class="red-text">{{ reportData?.qm_win }}</span>
                  </div>
                  <div class="line"></div>
                  <div class="num">
                    <span> 第{{ reportData?.qm_rank_season }}届小杀全民赛积分排名</span>
                    <span class="red-text">{{ reportData?.qm_rank }}</span>
                  </div>
                  <div class="line"></div>
                  <div class="events-footer">
                    未来，期待你能大放异彩
                  </div>
                </div>
                <div v-else class="events-borders">
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
            <div class="squre sixth">
              <div swiper-animate-effect="animate__fadeIn" swiper-animate-duration="1s" class="title animation">
              </div>
              <div swiper-animate-effect="animate__fadeInLeft" swiper-animate-duration="1s" class="animation main">
                <div class="line"></div>
                <div class="achievement ">

                  <div v-if="reportData && reportData?.get_general_date" class="achievement-item">
                    <span class="time">{{ reportData?.get_general_date }}</span>
                    <p class="content">
                      通过<span class="red"> {{ activityMap.get(reportData?.get_general_method) }}</span>,获得了武将<span
                        class="red"> {{ reportData?.get_general }}</span>,天降洪福，举世皆惊
                    </p>
                  </div>
                  <div v-if="reportData && reportData?.get_skin_date" class="achievement-item">
                    <span class="time">{{ reportData?.get_skin_date }}</span>
                    <p class="content">
                      通过<span class="red"> {{ skinAcquisitionMap.get(reportData?.get_skin_method) }}</span>,获得了皮肤<span
                        class="red"> {{ reportData?.get_skin }}</span>,鸿运当头，幸哉幸哉
                    </p>
                  </div>
                  <div v-if="reportData && reportData?.get_sprite_date" class="achievement-item">
                    <span class="time">{{ reportData?.get_sprite_date }}</span>
                    <p class="content">
                      是用普通转生丹成功获得<span class="red">{{ reportData?.get_sprite_rank }}</span>将灵<span class="red"> {{
                        reportData?.get_sprite }}</span>,转生轮回，逆天改命
                    </p>
                  </div>
                  <div class="achievement-item">
                    <span class="time">{{ reportData?.most_game_date }}</span>
                    <p class="content">
                      主公发动了<span class="red">{{ reportData?.most_game }}</span>次战役，整个三国都被你如滔天之焰的斗志点亮
                    </p>
                  </div>
                  <div class="achievement-item">
                    <span class="time">{{ reportData?.latest_game_date }}</span>
                    <p class="content">
                      主公于<span class="red">{{ reportData?.latest_game_time }}</span>发动了今年最晚的一次战斗，敌将在半睡半醒之间被你轻松解决
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="squre seventh">
              <div swiper-animate-effect="animate__fadeIn" swiper-animate-duration="1s" class="title animation">
              </div>
              <div v-if="reportData && reportData.general_post > 0" swiper-animate-effect="animate__fadeInLeftBig"
                swiper-animate-duration="1s" class="submission animation">
                <div class="line"></div>
                <div class="content">
                  <span>2024年</span><br />
                  <p>
                    <span class="normal">“一将成名”武将设计大赛共开展 <span class="red-text">4届</span></span><br />
                    <span class="normal">主公共参与投稿 <span class="red-text">{{ reportData.general_post }}</span>
                      次</span><br />
                    <span class="normal"> 累计获票 <span class="red-text">{{ reportData.general_tickets
                        }}</span></span><br />
                    <span v-if="reportData.general_tickets > 0" class="normal"> 在 <span class="red-text">{{
                      reportData.general_title
                    }}</span>命题中荣获</span><br />
                    <span v-if="reportData.general_tickets > 0" class="normal"> <span class="red-text">{{
                      reportData.general_prize }}</span></span>
                  </p>

                </div>
              </div>
              <div v-else class="nothing">
                <div swiper-animate-effect="animate__fadeInRight" swiper-animate-duration="1s"
                  class="nothing-title animation">
                  <span> 2024年 </span>
                  <span> “一将成名”武将设计大赛共开展 <span class="red-text">4届</span></span>
                  <span> 10位命题武将，在诸位的巧思之下焕发新生</span>
                </div>
                <swiper :spaceBetween="30" :effect="'fade'" :pagination="{
                  clickable: true,
                }" :autoplay="{
                  delay: 3000,
                  disableOnInteraction: false,
                }" :modules="modules" swiper-animate-effect="animate__fadeInLeftBig" swiper-animate-duration="1s"
                  class="generalSwiper animation">
                  <swiper-slide v-for="(item, index) in charList" :key="index">
                    <div class="border" :style="{ backgroundImage: `url(${item.url})` }">
                      <img class="nothing-general" src="@/assets/general-border.webp" alt="">
                      <div class="name">设计者：{{ item.name }}</div>
                    </div>
                  </swiper-slide>
                </swiper>

              </div>
            </div>
          </swiper-slide>
          <swiper-slide>
            <div ref="shareBox" class="squre eighth">
              <div swiper-animate-effect="animate__fadeInLeft" swiper-animate-duration="0.6s"
                class="user-info animation">
                <div class="user">
                  <div class="user-avatar" :style="{ backgroundImage: `url(${reportData?.avatar})` }">
                    <img class="avatar-img" src="@/assets/user-avatar.webp" alt="">
                  </div>
                  <div class="user-text">
                    <div class="user-name">{{ reportData?.nickname }}</div>
                    <div class="user-level">{{ reportData?.office_level_name }}</div>
                  </div>
                </div>
                <div class="user-border">
                  <div class="user-header">
                    <div class="header-item">
                      <span class="red-text">{{ reportData?.total_win }}</span>
                      <span>全年胜场</span>
                    </div>
                    <div class="header-item">
                      <span class="red-text">{{ reportData?.shuai_dian }}</span>
                      <span>获得帅点</span>
                    </div>
                    <div class="header-item">
                      <span class="red-text">{{ reportData?.max_win }}</span>
                      <span>最高连胜</span>
                    </div>
                  </div>
                  <div class="user-body">
                    <div class="body-item">
                      <span class="red-text">{{ reportData?.online }}<span class="mini">天</span></span>
                      <span>累计在线</span>
                    </div>
                    <div class="body-item">
                      <span class="red-text">{{ reportData?.four }}</span>
                      <span>自走棋四强</span>
                    </div>
                    <div class="body-item">
                      <span class="red-text">{{ reportData?.mvp }}</span>
                      <span>全场最佳</span>
                    </div>
                  </div>
                </div>
              </div>
              <div swiper-animate-effect="animate__fadeInLeft" swiper-animate-duration="0.9s" class="mbti animation">
                <div class="mbti-title">我的游戏MBTI是</div>
                <div class="mbti-value">{{ MBTI }}</div>
                <div class="mbti-line"></div>
                <div class="mbti-content">
                  <div class="mbti-item">
                    <div class="mbti-item-content"> <span class="red-more">{{ reportData?.mbti1 }}</span>-{{
                      personalityMap.get(reportData?.mbti1 ?? '') }}</div>
                  </div>
                  <div class="mbti-item">
                    <div class="mbti-item-content"> <span class="red-more">{{ reportData?.mbti2 }}</span>-{{
                      personalityMap.get(reportData?.mbti2 ?? '') }}</div>
                  </div>
                  <div class="mbti-item">
                    <div class="mbti-item-content"> <span class="red-more">{{ reportData?.mbti3 }}</span>-{{
                      personalityMap.get(reportData?.mbti3 ?? '') }}</div>
                  </div>
                  <div class="mbti-item">
                    <div class="mbti-item-content"> <span class="red-more">{{ reportData?.mbti4 }}</span>-{{
                      personalityMap.get(reportData?.mbti4 ?? '') }}</div>
                  </div>
                </div>
              </div>
              <div swiper-animate-effect="animate__fadeInRight" swiper-animate-duration="1.2s"
                class="scratch animation  swiper-no-swiping">
                <scratch :name="personalityMbtiMap.get(MBTI)" :imageUrl="reportData?.mbti_img" />
                <!-- <scratch imageUrl="https://yjcmndzb.sanguosha.com/swlide.png" /> -->
              </div>
              <img id="qrcode" class="qrcode" src="https://yjcmndzb.sanguosha.com/qrcode.png" alt="">

              <div data-html2canvas-ignore="true" @click="handleShareReport" swiper-animate-effect="animate__fadeIn"
                swiper-animate-duration="1.5s" class="share animation">分享战报 领取奖励
              </div>

            </div>
            <ImagePreview ref="imagePreviewRef"></ImagePreview>personalityMbtiMap
          </swiper-slide>
        </template>
      </Swiper>
    </div>
  </transition>
</template>
<script setup lang="ts">
import { getReport, getShare } from '@/service/api';
import { showToast } from '@/utils/image';
import { swiperAnimate, swiperAnimateCache } from '@/utils/swiper.animate';
import 'animate.css';
import html2canvas from 'html2canvas';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/mousewheel';
import 'swiper/css/pagination';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { computed, nextTick, ref } from 'vue';
import ImagePreview from './components/ImagePreview.vue';
import LoadingPage from './components/LoadingPage.vue';
import scratch from './components/scratch.vue';
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
const configImageUrl = 'https://yjcmndzb.sanguosha.com/yjcm/';
const charList = [
  {
    url: `${configImageUrl}yjcm-xukun.jpg`,
    name: "卤香蛋2"
  },
  {
    url: `${configImageUrl}yjcm-simafu.jpg`,
    name: "黑暗魔女"
  },
  {
    url: `${configImageUrl}yjcm-xuangongzhu.jpg`,
    name: "谜城惊雨声"
  },
  {
    url: `${configImageUrl}yjcm-linghuyu.jpg`,
    name: "浮兮璃璃"
  },
  {
    url: `${configImageUrl}yjcm-majun.jpg`,
    name: "白日梦花"
  },
  {
    url: `${configImageUrl}yjcm-mouguojia.jpg`,
    name: "水友1671282085763"
  },
  {
    url: `${configImageUrl}yjcm-xunyuxunyou.png`,
    name: "刘永单推人"
  },
  {
    url: `${configImageUrl}yjcm-wangmeizhike.jpg`,
    name: "特莉丝Triss"
  },
  {
    url: `${configImageUrl}yjcm-shenpangtong.jpg`,
    name: "昵称不合法"
  },
  {
    url: `${configImageUrl}yjcm-peixiu.jpg`,
    name: "改名因为怕被喷"
  }
];
// const getWxSignature = async () => {
//   const { data } = await getSignatureQuery({
//     url: 'https://10thwxh55.sanguosha.com'
//   });
//   console.log(data);
//   // wx.config({
//   //   debug: true, // 开启调试模式
//   //   appId: 'wx8bc525afe48627fd', // 公众号唯一标识
//   //   timestamp: Math.floor(Date.now() / 1000), // 时间戳
//   //   // nonceStr: nonceStr, // 随机串
//   //   // signature: signature, // 签名
//   //   jsApiList: [
//   //     'onMenuShareTimeline', // 分享到朋友圈
//   //     'onMenuShareAppMessage' // 分享给朋友
//   //   ]
//   // });
// }
// const getWxSignature = async () => {
//   fetch('https://10thwx.sanguosha.com/wechat/jssdk?url=https://10thwxh55.sanguosha.com')
//     .then(response => response.json())
//     .then(data => {
//       console.log(data);
//       // 在这里可以访问 data.debug、data.beta 等属性
//       const appId = data.appId;
//       const nonceStr = data.nonceStr;
//       const timestamp = data.timestamp;
//       const signature = data.signature;
//       // 对获取到的值进行进一步处理或使用
//     })
//     .catch(error => {
//       console.error('获取数据出错：', error);
//     });
// }
// getWxSignature()

interface ReportData {

  account: string;
  add_shuai_dian: number;
  avatar: string;
  beat_general: number;
  four: number;
  g1_img: string;
  g1_name: string;
  g1_num: string;
  g1_rate: string;
  g1_resource: string;
  g2_img: string;
  g2_name: string;
  g2_num: string;
  g2_rate: string;
  g2_resource: string;
  g3_img: string;
  g3_name: string;
  g3_num: string;
  g3_rate: string;
  g3_resource: string;
  general_post: number;
  general_prize: string;
  general_tickets: number;
  general_title: string;
  get_general: string;
  get_general_date: string;
  get_general_method: number;
  get_skin: string;
  get_skin_date: string;
  get_skin_method: number;
  get_sprite: string;
  get_sprite_date: string;
  get_sprite_rank: string;
  is_new: number;
  is_qq: number;
  joy_mode: string;
  joy_rank_img: string;
  joy_rank_name: string;
  latest_game_date: string;
  latest_game_time: string;
  max_win: number;
  mbti1: string;
  mbti2: string;
  mbti3: string;
  mbti4: string;
  mbti_img: string;
  most_game: number;
  most_game_date: string;
  most_win: number;
  most_win_mode: string;
  most_win_season: string;
  mvp: number;
  nation_name: string;
  nation_score: number;
  nickname: string;
  office_level: number;
  office_level_img: string;
  office_level_name: string;
  online: number;
  qm: number;
  qm_dw: string;
  qm_rank: number;
  qm_rank_season: string;
  qm_win: number;
  sf_name: string;
  sf_score: number;
  shuai_dian: number;
  shuai_dian_rate: string;
  total_win: number;
  zzq_four: number;
  zzq_four_general_img: string;
  zzq_four_general_name: string;
  zzq_four_general_resource: string;
  zzq_kill_chess: number;
  zzq_kill_general: number;
  zzq_num: number;
  zzq_rank_img: string;
  zzq_rank_score: number;
  zzq_total_general_img: string;
  zzq_total_general_name: string;
  zzq_total_general_resource: string;
  zzq_win: number;


}
const activityMap = new Map([
  [1, "开启武庙宝箱"],
  [2, "开启神武宝箱"],
  [3, "开启谋宝箱"],
  [4, "珍宝"],
  [5, "祈福"],
  [6, "开启星河宝箱"],
  [7, "如意签"],
  [8, "纳贤"],
  [9, "招募"]
]);
const skinAcquisitionMap = new Map([
  [1, "锦绣"],
  [2, "皮肤开包"]
]);
const personalityMbtiMap = new Map([
  ["INTP", "郭嘉"],
  ["INTJ", "武诸葛亮"],
  ["ENTP", "曹操"],
  ["ENTJ", "谋周瑜"],
  ["ENFJ", "刘备"],
  ["INFJ", "姜维"],
  ["INFP", "曹植"],
  ["ENFP", "徐盛"],
  ["ESFP", "孙尚香"],
  ["ISFP", "貂蝉"],
  ["ISTP", "威张辽"],
  ["ESTP", "吕布"],
  ["ISFJ", "谋鲁肃"],
  ["ISTJ", "武关羽"],
  ["ESFJ", "甄姬"],
  ["ESTJ", "袁绍"]
]);
const personalityMap = new Map([
  ['E', '主公广结天下好友，并肩作战是你最闪耀的时刻'],
  ['I', '王者向来孤独，主公真是单枪匹马孤胆英雄！'],
  ['S', '主公品味专一，执着于经典，有着你自己的坚守'],
  ['N', '主公勇于尝试新事物，未知对你有着莫大的吸引力'],
  ['T', '主公颇为内敛，有着不以物喜，不以己悲的胸怀'],
  ['F', '主公敢爱敢恨，谁不喜欢“打直球”的人呢？'],
  ['J', '主公累计登录超过30天，“出勤率”超高！'],
  ['P', '主公累计登录不足30天，小杀期待与你更多相遇~']
]);
const imagePreviewRef = ref<any>(null);
let isHidden = ref(true)
const handleAudioHidden = (e: boolean) => {
  isHidden.value = e
  console.log('audio hidden');
}
const reportData = ref<ReportData | null>(null);
const getReportData = async () => {
  const { data: { data } } = await getReport();
  reportData.value = data;
  console.log('res', data);
};
const shareReport = async () => {
  const { data } = await getShare()
  console.log('share', data);
}
getReportData();
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
const checkSpeciality = (str: string) => {
  if (typeof str === "string" && str.length >= 2) {
    const firstTwoChars = str.slice(0, 2);
    return firstTwoChars === "专业";
  }
  return false;
}
const onSlideChange = (swiper: { activeIndex: any; }) => {
  const { activeIndex } = swiper
  // new WOW().init()
  console.log('slide change', swiper, activeIndex);
};
const modules = [Pagination, EffectFade, Autoplay];
const MBTI = computed(() => {
  return (reportData.value?.mbti1 ?? '') + (reportData.value?.mbti2 ?? '') + (reportData.value?.mbti3 ?? '') + (reportData.value?.mbti4 ?? '')
})
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
const audioSrc = 'https://yjcmndzb.sanguosha.com/bgm.mp3';
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

const handleShareReport = async () => {
  await handleSave();
  shareReport();
  // 分享给朋友
  // wx.onMenuShareAppMessage({
  //   title: 'H5页面标题', // 分享标题
  //   desc: 'H5页面', // 分享
  //   link: 'https://example.com/h5/page', // 分享链接
  //   imgUrl: 'https://example.com/h5/image.jpg', // 分享图标
  //   success: function () { }
  // });
}

const shareBox = ref<HTMLDivElement | null>(null)
const handleSave = () => {
  console.log('进入 handleSave 函数');
  if (shareBox.value) {
    console.log('shareBox.value 是有效的 DOM 元素');
    const animatedElements = shareBox.value.querySelectorAll('.animation');

    // 暂停动画并固定样式
    animatedElements.forEach((element) => {
      const computedStyle = window.getComputedStyle(element);
      // 保存动态样式
      element.style.animation = 'none';
      element.style.transform = computedStyle.transform;
      element.style.opacity = computedStyle.opacity;
      element.style.position = computedStyle.position;
    });

    requestAnimationFrame(() => {
      html2canvas(shareBox.value, {
        width: shareBox.value.offsetWidth,
        scale: 2,
        useCORS: true,
        onclone: (clonedDocument) => {
          console.log('执行 html2canvas 的 onclone 回调');
          const qrcode = clonedDocument.getElementById('qrcode');
          if (qrcode) {
            qrcode.style.display = 'block';
          }
        }
      })
        .then((canvas) => {
          console.log('html2canvas 执行成功，获取到 canvas');
          const url = canvas.toDataURL("image/png");
          if (url) {
            console.log('成功获取图片 dataURL，准备展示预览');
            imagePreviewRef.value.showPreview([url]);
            nextTick(() => showToast('已为您生成图片，请长按保存！'));
          } else {
            nextTick(() => showToast('保存失败，请稍后重试！'));
          }
          // 恢复动画
          animatedElements.forEach((element) => {
            element.style.animation = ''; // 恢复原始动画
          });
        })
        .catch((error) => {
          console.error('html2canvas 执行出错:', error);
          nextTick(() => showToast('保存失败，请稍后重试！'));
          // 恢复动画
          animatedElements.forEach((element) => {
            element.style.animation = ''; // 恢复原始动画
          });
        });
    });
  } else {
    console.log('shareBox.value 是无效的 DOM 元素');
  }
};


</script>

<style lang="scss">
.hidden {
  display: none;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
// .fade-else-enter-active,
// .fade-else-leave-active {
//   transition: opacity 0.5s ease-in-out;
// }

// .fade-else-enter,
// .fade-else-leave-to {
//   opacity: 0;
// }

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

.swiper-pagination {
  bottom: 70px !important;


  .swiper-pagination-bullet-active {
    width: 16px;
    height: 6px;
    background: #FFFFFF;
    border-radius: 3px;
  }
}
</style>
