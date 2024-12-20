<template>
  <div class="container">
    <Swiper :allow-touch-move="false" @swiper="onSwiper" @slideChange="onSlideChange" :direction="'vertical'"
      :modules="modules" class="mySwiper">
      <swiper-slide>
        <div class="squre">
          <div class="home" ref="homeRef" @touchstart="handleTouchStart" @pointerdown="handleMouseStart"
            @pointerup="handleMouseEnd" @touchend="handleTouchEnd">
            <div class="icon"></div>
            <div class="change" :class="language ? 'cn-btn' : 'en-btn'" @click="handleLanguage"></div>
            <div :class="language ? 'cn-title' : 'en-title'" class="title"></div>
            <div class="home-card">
              <div class="your" :class="language ? 'cn-your' : 'en-your'"></div>
              <div class="subject" :class="language ? 'cn-subject' : 'en-subject'"></div>


            </div>

            <div class="person">

              <div class="pop"></div>
            </div>
            <div class="bottom">

              <span :class="language ? 'cn-bottom' : 'en-bottom'"></span>
            </div>
          </div>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div class="squre fill-bg">

          <div class="content fill" ref="elementRef" @touchstart="handleTouchStart" @pointerdown="handleMouseStart"
            @pointerup="handleMouseEnd" @touchend="handleTouchEnd">
            <div class="fill-logo" :class="language ? 'cn-cp-logo' : 'en-cp-logo'"></div>
            <div class="fill-back">
              <div class="title" :class="language ? 'cn-title' : 'en-title'"></div>
              <div class="input-list">

                <input @input="validateInput" v-model="cName" :maxlength="language ? 6 : 20"
                  :placeholder="cpItemPlaceholder" type="text" :class="language ? 'cn-input' : 'en-input'">
                <input @input="validateInput" v-model="pName" :maxlength="language ? 6 : 20"
                  :placeholder="cpItemPlaceholder" type="text" :class="language ? 'cn-input' : 'en-input'">
                <div class="subject" :class="language ? 'cn-cp-subject' : 'en-cp-subject'"></div>
                <input @input="handleInput" maxlength="10" v-model="queryParams.cp" :placeholder="cpPlaceholder"
                  :class="language ? 'cn-input' : 'en-input'" type="text">
              </div>

            </div>
            <div class="confirm" @click="handleConfirm" :class="language ? 'cn-confirm' : 'en-confirm'"></div>

            <div class="bottom-last"></div>
          </div>
        </div>
      </swiper-slide>
      <swiper-slide v-for="(item, index) in questionListData.list" :key="item.id">
        <div class="squre fill-bg">
          <div ref="topicRef" class="content topic">
            <div class="fill-logo" :class="language ? 'cn-cp-logo' : 'en-cp-logo'"></div>
            <div class="topic-back">
              <div class="question">{{ index + 1 }}/{{ questionListData.list.length }} </div>
              <div class="title subject" :class="language ? 'cn-subject' : 'en-subject'"> <span class="title-content">
                  {{ item.title }}</span>
                <div class="line"></div>
              </div>

              <div class="select">
                <customRadio v-model="modelValue" :options="item.option"></customRadio>
              </div>

            </div>
            <div class="button">
              <button :class="language ? 'cn-prev' : 'en-prev'" @click="handlePrev"></button>
              <!-- <button @click="handleSubmit" class="submit" :class="language ? 'cn-submit' : 'en-submit'"
                v-if="index === questionListData.list.length - 1"></button> -->
              <button :class="language ? 'cn-next' : 'en-next'" @click="handleNext"></button>
            </div>
            <div class="bottom-last"></div>
          </div>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div class="squre result-bg">
          <div ref="shareBox" class="content result">
            <img class="result-con" :src="resultAnswer.path" alt="">
            <div class="cp-title">{{ language ? `你在【${queryParams.cp}】是` : `You are in 【${queryParams.cp}】 shipers as`
              }}</div>
            <div class="result-code">
              <div @click="handleRedo" class="redo-button" :class="language ? 'cn-redo' : 'en-redo'"> </div>
              <img class="result-title" :src="language ? cnResult : enResult" alt="">
              <img class="result-code-num" :src="language ? cnCode : enCode" alt="">
              <div @click="handleSave" class="save-button" :class="language ? 'cn-save' : 'en-save'"> </div>
            </div>
          </div>
          <ImagePreview ref="imagePreviewRef" />
        </div>
      </swiper-slide>
    </Swiper>
  </div>
  <!-- <div v-else>
    <LoadingPage :language="language" />
  </div> -->
</template>
<script setup lang="ts">
interface QuestionItem {
  id: string,
  title: string,
  option: {
    a: string,
    b: string,
    c: string
  }
}
interface QuestionData {
  cp_temp: string,
  list: QuestionItem[]
}
// Import Swiper Vue.js components
import customRadio from '@/components/CustomRadio.vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
// import required modules
import useDebounce from '@/hooks/useDebounce';
import type { Question } from '@/service/api';
import { questionAnswer, questionList, questionSubmit } from '@/service/api';
import { Mousewheel, Navigation, Pagination } from 'swiper/modules';
import message from './components/message/index';
// Import Swiper styles
import { downloadByBinary, getAssetsImages, getEnvironment, showToast } from "@/utils/image";
import html2canvas from 'html2canvas';
import 'swiper/css';
import 'swiper/css/mousewheel';
import 'swiper/css/pagination';
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watchEffect } from 'vue';
import './style.css';

import ImagePreview from '@/components/ImagePreview.vue';

let fontLoaded = ref(false);
const fontName = 'erzhuotong'; // 替换为你的字体名称
const fontURL = getAssetsImages('font/HYETouSongW-2.ttf')
const font = new FontFace(fontName, `url(${fontURL})`); // 替换为你的字体包路径

font.load().then(() => {
  fontLoaded.value = true;
  document.fonts.add(font);
  console.log(`${fontName} font load completed`);
}).catch((error) => {
  console.error(`${fontName} font failed to load:`, error);
});
const modelValue = ref('a')
let cnResult = getAssetsImages('cn-join-code.png')
let enResult = getAssetsImages('en-join-code.png')
let cnCode = getAssetsImages('cn-down-code.png')
let enCode = getAssetsImages('en-down-code.png')

let swiperInstance = ref()
let alreadySubmit = ref(false)
const rewardRecord = ref<string[]>([])
const resultAnswer = ref({
  path: '',
  title: '',
  answer: {}
})
const imagePreviewRef = ref<any>(null);
const elementRef = ref(null);
const homeRef = ref(null);
const topicRef = ref(null);
console.log(topicRef);

function setScale(dom: any) {
  if (dom.value && window.innerWidth >= 750) {
    const vh = window.innerHeight;
    const scale = vh / 1334;
    dom.value.style.transform = `scale(${scale})`;
  }
  //  else {
  //   if (dom.value) {
  //     dom.value.style.transform = `scale(1)`;
  //   }
  // }
}

onMounted(() => {
  setScale(elementRef);
  setScale(homeRef);
  setScale(topicRef);
  setScale(shareBox);
  window.addEventListener('resize', setScale);
  const browserLanguage = navigator.language || queryParams.lang;
  let title;
  if (browserLanguage.startsWith('en')) {
    title = 'Sensei！I like you so much! - Fangirl Test';
  } else if (browserLanguage.startsWith('zh')) {
    title = '太太！我喜欢你！-同人女类型测试H5';
  } else {
    title = '太太！我喜欢你！-同人女类型测试H5';
  }
  document.title = title;
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', setScale);
});



const cpPlaceholder = computed(() => {
  return queryParams.lang === 'cn' ? '各取第一个字生成' : 'Enter name '
})
const cpItemPlaceholder = computed(() => {
  return queryParams.lang === 'cn' ? '输入1-6字姓名' : 'Enter a name of 1-20 characters'
})
let cName = ref('')
let pName = ref('')
const fetchQuestionSubmit = async (value: { id: number; option: string; }) => {
  const info = {
    lang: queryParams.lang,
    cp_name: questionListData.cp_temp,
    id: value.id,
    option: value.option
  }
  rewardRecord.value.push(value.option)
  const { code } = await questionSubmit(info)
  if (code == 0) {
    alreadySubmit.value = true
  }
}

const validateInput = (inputValue: any) => {
  const regex = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/;
  if (!regex.test(inputValue.value)) {
    inputValue.value = inputValue.value.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '');
  }
};

const onSwiper = (swiper: any) => {
  swiperInstance.value = swiper
  console.log(swiper);
};

const handleLanguage = () => {
  queryParams.lang = queryParams.lang === 'cn' ? 'en' : 'cn'
  // getQuestionList(queryParams)
}

let touchStartY = ref(0)

let pointerStartY = ref(0)

const handleMouseStart = (value: PointerEvent) => {
  console.log('Mouse start', value.pageY);
  pointerStartY.value = value.pageY
  // console.log('touch start', value.changedTouches[0].clientY);

  // touchStartY.value = value.changedTouches[0].clientY
  // console.log('touch start', value.changedTouches[0].clientY);
};

const handleMouseEnd = async (value: PointerEvent) => {
  console.log('Mouse end', value.pageY);
  const pointerEndY = value.pageY
  let absoluteValue = Math.abs(pointerEndY - pointerStartY.value);
  if (absoluteValue < 50) {
    return
  }
  if (pointerEndY - pointerStartY.value < 0) {
    if (swiperInstance.value.activeIndex === 0) {
      swiperInstance.value.slideNext()
    }
  } else {
    swiperInstance.value.slidePrev()
  }
  // console.log('touch start', value.changedTouches[0].clientY);

  // touchStartY.value = value.changedTouches[0].clientY
  // console.log('touch start', value.changedTouches[0].clientY);
};

const handleTouchStart = (value: TouchEvent) => {
  console.log('touch start', value);

  console.log('touch start', value.changedTouches[0].clientY);

  touchStartY.value = value.changedTouches[0].clientY
  // console.log('touch start', value.changedTouches[0].clientY);
};


const language = computed(() => {
  return queryParams.lang === 'cn' ? true : false
})

let aready = ref(true)

const handleTouchEnd = async (value: TouchEvent) => {
  console.log('touch end', value.changedTouches[0].clientY);
  const touchEndY = value.changedTouches[0].clientY
  let absoluteValue = Math.abs(touchEndY - touchStartY.value);
  if (absoluteValue < 50) {
    return
  }
  if (touchEndY - touchStartY.value < 0) {
    if (swiperInstance.value.activeIndex === 0) {
      swiperInstance.value.slideNext()
    }
  } else {
    swiperInstance.value.slidePrev()
  }
  // console.log('touch end', value.changedTouches[0].clientY);
};

const handleConfirm = async () => {

  if ((!queryParams.cp || cName.value == '' || pName.value == '') || !aready.value) {
    if (language) {
      message({ str: '请填写完整信息', type: 'info' })

    } else {
      message({ str: 'Please fill in the information', type: 'info' })
    }

    return
  }

  const { code } = await getQuestionList(queryParams)
  if (code === 0) {
    aready.value = false
    swiperInstance.value.slideNext()
  }

}

const onSlideChange = (swiper: { activeIndex: any; }) => {
  const { activeIndex } = swiper

  console.log('slide change', swiper, activeIndex);
};

let queryParams = reactive<Question>({
  // cp_name: '',
  lang: 'cn',
  cp: '',
})

const handleRedo = () => {
  swiperInstance.value.slideTo(1)
  queryParams.cp = ''
  cName.value = ''
  pName.value = ''
  aready.value = true
  rewardRecord.value = []
  resultAnswer.value = {
    path: '',
    title: '',
    answer: {}
  };
}

const shareBox = ref<HTMLDivElement | null>(null)

const handleSave = () => {
  console.log('save');
  if (shareBox.value) {
    html2canvas(shareBox.value, {
      width: shareBox.value.offsetWidth,
      // height: shareBox.value.offsetHeight,
      scale: 2
    }).then(function (canvas) {
      if (getEnvironment()) {

        const url = canvas.toDataURL("image/png")
        if (url) {
          imagePreviewRef.value.showPreview([url]);
          // showImagePreview([url])
          nextTick(() => {
            showToast('已为您生成图片，请长按保存！')
          })
        } else {
          nextTick(() => {
            showToast('保存失败，请稍后重试！')
          })
        }
      }
      else {
        canvas.toBlob((blob) => {
          if (blob) {
            //这个是下载blob文件的方法
            downloadByBinary(blob, + new Date(), "image/png")
            showToast('保存成功！')
          } else {
            showToast('保存失败，请稍后重试！')
          }
        });
      }

    })
  }
}

let isChange = ref(true)
const handleInput = (event: any) => {
  isChange.value = false;
  const value = event.target.value;
  const regex = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/;
  if (!regex.test(value)) {
    event.target.value = value.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '');
  }
}

//取俩个第一个字
watchEffect(() => {
  console.log(cName.value, pName.value);
  validateInput(cName);
  validateInput(pName);
  if (queryParams.lang === 'cn' && isChange.value) {
    queryParams.cp = cName.value.slice(0, 1) + pName.value.slice(0, 1)
  }

  setScale(elementRef);
  setScale(homeRef);

  setScale(shareBox);
})

let questionListData = reactive<QuestionData>({
  cp_temp: '',
  list: []
})

//获取题目列表
const getQuestionList = async (value: Question) => {

  const { data: { list, cp_name }, code } = await questionList(value)
  questionListData.list = list
  questionListData.cp_temp = cp_name
  console.log(list);
  return { code }

}
//获取结果
const submitQuestionAnswer = async (value: { cp_name: string; lang: string; }) => {
  const { data } = await questionAnswer(value)
  data.path = getAssetsImages(data.path)
  resultAnswer.value = data
}
//提交答案
const handleSubmit = async () => {

  await fetchQuestionSubmit({
    id: parseInt(questionListData.list[swiperInstance.value.activeIndex - 2].id),
    option: modelValue.value
  })
  await submitQuestionAnswer({
    cp_name: questionListData.cp_temp,
    lang: queryParams.lang
  })
  swiperInstance.value.slideNext()
  alreadySubmit.value = false
  modelValue.value = 'a'
}
//上一题
const handlePrev = useDebounce(() => {

  if (swiperInstance.value.activeIndex === 2) {
    aready.value = true
    rewardRecord.value = []
  }
  console.log('上一题');

  swiperInstance.value.slidePrev()
  console.log('222222');

  modelValue.value = rewardRecord.value[swiperInstance.value.activeIndex - 2]
  console.log(444444);
})
//下一题
const handleNext = useDebounce(async () => {
  console.log('下一题');
  if (swiperInstance.value.activeIndex - 2 === questionListData.list.length - 1) {
    handleSubmit();
    return;
  }

  // 如果rewardRecord.value 里面有已经提交过了那么就不再提交
  console.log(swiperInstance.value.activeIndex);
  if (!rewardRecord.value[swiperInstance.value.activeIndex - 2] || modelValue.value !== rewardRecord.value[swiperInstance.value.activeIndex - 2]) {
    await fetchQuestionSubmit({
      id: parseInt(questionListData.list[swiperInstance.value.activeIndex - 2].id),
      option: modelValue.value
    })
  }
  console.log(alreadySubmit.value);
  //重置下一题默认选项
  if (alreadySubmit.value || rewardRecord.value[swiperInstance.value.activeIndex - 2]) {
    swiperInstance.value.slideNext()
    alreadySubmit.value = false
    modelValue.value = 'a'
  }

})
const modules = [Pagination, Navigation, Mousewheel];
</script>
<style scoped lang="scss">
.mySwiper {
  width: 750px;
  height: 100vh;
}

.swiper-slide {
  height: 100% !important;
}

.content {
  height: 100vh;
  width: 750px;
  // background-color: rgb(0, 136, 255);
}

// .title {
//   margin: 20px 0;
// }

.select {

  margin: 50px 0;
}
</style>
