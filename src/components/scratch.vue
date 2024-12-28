<template>
  <div class="scratch-card">
    <img class="sourceImg" :src="props.imageUrl" alt="revealed">
    <canvas ref="canvas" :width="canvasWidth" :height="canvasHeight" :style="{ opacity: canvasOpacity }"></canvas>
  </div>
</template>

<script setup lang="ts">
import coverImage from '@/assets/un.webp';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

// 接收父组件传入的图片路径
const props = defineProps({
  imageUrl: {
    type: String,
    required: true
  },
  // 自定义未刮开时显示的内容，不传则无额外绘制
  coverContent: {
    type: String,
    default: ''
  }
});

const canvasWidth = ref(400);
const canvasHeight = ref(300);
const maskColor = ref('grey');
const cursorRadius = ref(10);
const maxEraseArea = ref(90);
const done = ref(false);
let posX: number | null = null;
let posY: number | null = null;
const canvas = ref<HTMLCanvasElement | null>(null);
const currPerct = ref(0);
const canvasOpacity = ref(1);

// 提前获取绘图上下文
let ctx: CanvasRenderingContext2D | null = null;
const initContext = () => {
  if (canvas.value) {
    ctx = canvas.value.getContext('2d', { willReadFrequently: true });
  }
};

// 添加遮罩层（刮刮乐未刮开部分）
const addCoat = () => {
  if (ctx) {
    const width = canvasWidth.value;
    const height = canvasHeight.value;
    // 先清除画布
    ctx.clearRect(0, 0, width, height);

    // 绘制遮罩层
    ctx.beginPath();
    ctx.fillStyle = maskColor.value;
    ctx.fillRect(0, 0, width, height);

    // 绘制未刮开时的图片
    const img = new Image();
    img.src = coverImage;
    img.onload = () => {
      let imgWidth = img.width;
      let imgHeight = img.height;
      // 计算等比例缩放的尺寸
      if (imgWidth > width || imgHeight > height) {
        const ratioW = width / imgWidth;
        const ratioH = height / imgHeight;
        const ratio = Math.min(ratioW, ratioH);
        imgWidth = imgWidth * ratio;
        imgHeight = imgHeight * ratio;
      }
      const x = (width - imgWidth) / 2;
      const y = (height - imgHeight) / 2;
      ctx.drawImage(img, x, y, imgWidth, imgHeight);
    }
  }
};

// 擦除操作
const erase = (e: MouseEvent | TouchEvent) => {
  if (!canvas.value || !ctx) return;

  const rect = canvas.value.getBoundingClientRect();
  let x = 0;
  let y = 0;

  if ('touches' in e && e.touches.length > 0) {
    x = e.touches[0].clientX - rect.left;
    y = e.touches[0].clientY - rect.top;
  } else if ('clientX' in e && 'clientY' in e) {
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;
  }

  if (x >= 0 && y >= 0) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, cursorRadius.value, 0, 2 * Math.PI);
    ctx.fill();

    getScratchedPercentage();
    console.log(currPerct.value, maxEraseArea.value);

    if (currPerct.value >= maxEraseArea.value) {
      canvasOpacity.value = 0;
    }
  }
};

// 获取刮开百分比
const getScratchedPercentage = () => {
  if (ctx) {
    const pixels = ctx.getImageData(0, 0, canvasWidth.value, canvasHeight.value).data;
    let transparentPixels = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] < 128) {
        transparentPixels++;
      }
    }
    currPerct.value = ((transparentPixels / (pixels.length / 4)) * 100).toFixed(2);
  }
};

// 鼠标事件处理
const startMouseScratch = (e: MouseEvent) => {
  posX = e.clientX;
  posY = e.clientY;
  if (e.button === 0) {
    canvas.value?.addEventListener('mousemove', eraseMouseMove, { passive: true });
  }
};

const eraseMouseMove = (e: MouseEvent) => {
  erase(e);
};

const endMouseScratch = (e: MouseEvent) => {
  if (e.target === canvas.value) {
    if (posX === e.clientX && posY === e.clientY) {
      erase(e);
    }
    canvas.value?.removeEventListener('mousemove', eraseMouseMove);
    getScratchedPercentage();
    if (currPerct.value >= maxEraseArea.value) {
      canvasOpacity.value = 0;
    }
  }
};

// 触摸事件处理
const startTouchScratch = (e: TouchEvent) => {
  if (e.touches.length > 0) {
    posX = e.touches[0].clientX;
    posY = e.touches[0].clientY;
    canvas.value?.addEventListener('touchmove', eraseTouchMove, { passive: true });
  }
};

const eraseTouchMove = (e: TouchEvent) => {
  erase(e);
};

const endTouchScratch = (e: TouchEvent) => {
  if (e.target === canvas.value) {
    if (posX === e.changedTouches[0].clientX && posY === e.changedTouches[0].clientY) {
      erase(e);
    }
    canvas.value?.removeEventListener('touchmove', eraseTouchMove);
    getScratchedPercentage();
    if (currPerct.value >= maxEraseArea.value) {
      canvasOpacity.value = 0;
    }
  }
};

// 初始化和添加事件监听
const onMountedCb = () => {
  initContext();
  addCoat();
  if (canvas.value) {
    canvas.value.addEventListener('mousedown', startMouseScratch);
    canvas.value.addEventListener('touchstart', startTouchScratch);
    document.addEventListener('mouseup', endMouseScratch);
    document.addEventListener('touchend', endTouchScratch);
  }
};

onMounted(onMountedCb);

// 清理事件监听
const cleanupListeners = () => {
  if (canvas.value) {
    canvas.value.removeEventListener('mousedown', startMouseScratch);
    canvas.value.removeEventListener('touchstart', startTouchScratch);
  }
  document.removeEventListener('mouseup', endMouseScratch);
  document.removeEventListener('touchend', endTouchScratch);
};

onBeforeUnmount(() => {
  cleanupListeners();
});

// 画布尺寸动态调整
const updateCanvasSize = () => {
  if (canvas.value) {
    canvasWidth.value = canvas.value.offsetWidth;
    canvasHeight.value = canvas.value.offsetHeight;
    addCoat();
  }
};

watch([canvasWidth, canvasHeight], () => {
  addCoat();
});

onMounted(() => {
  updateCanvasSize();
  window.addEventListener('resize', updateCanvasSize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateCanvasSize);
});
</script>

<style scoped>
.scratch-card {
  position: relative;
  width: 100%;
  height: 100%;
}

.sourceImg {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1;
}

.scratch-card canvas {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 2;
}
</style>
