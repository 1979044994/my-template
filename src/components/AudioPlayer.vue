<template>
  <div class="switch" :class="isPlaying ? 'pause' : 'close'"></div>
</template>

<script lang="ts" setup>
import type { Ref } from 'vue';
import { onBeforeUnmount, onMounted, ref } from 'vue';

// 接收父组件传递的音频src
const props = defineProps({
  src: {
    type: String,
    required: false
  }
})

// 定义响应式变量
const audio: Ref<HTMLAudioElement | null> = ref(null);
const isPlaying: Ref<boolean> = ref(false);

const initAudio = () => {
  audio.value = new Audio(props.src);
  audio.value.loop = true;
  audio.value.muted = true;  // 静音播放
  // 监听音频播放结束事件
  audio.value.addEventListener('ended', onAudioEnded);
};

const playAudio = () => {
  if (audio.value) {
    audio.value.muted = false;  // 取消静音
    audio.value.play();
    isPlaying.value = true;
  }
};

const pauseAudio = () => {
  if (audio.value) {
    audio.value.pause();
    isPlaying.value = false;
  }
};

const onAudioEnded = () => {
  isPlaying.value = false;
};

onMounted(async () => {
  initAudio();
  // playAudio();
});

onBeforeUnmount(() => {
  if (audio.value) {
    audio.value.removeEventListener('ended', onAudioEnded);
  }
});

// 暴露组件内部方法，供父组件调用
defineExpose({
  playAudio,
  pauseAudio,
  isPlaying
});
</script>
<style lang="scss">
.switch {
  width: 66px;
  height: 66px;

  position: absolute;
  right: 50px;
  top: 52px;
  z-index: 6;
}

.close {
  background: url(@/assets/close.png) no-repeat;
  background-size: cover;
}

.pause {
  background: url(@/assets/audio.gif) no-repeat;
  background-size: cover;
}
</style>
