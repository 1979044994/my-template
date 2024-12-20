<template>
  <div class="animation-container">
    <canvas ref="canvas" id="canvas"></canvas>
  </div>
</template>

<script lang="ts" setup>
import { getAssetsImages } from '@/utils/image';
import { onMounted, ref } from 'vue';
// 定义画布和图片帧的引用
const canvas = ref<HTMLCanvasElement | null>(null);
const frameImages = ref<HTMLImageElement[]>([]); // 存储序列帧
let frameIndex = 0; // 当前帧索引
const totalFrames = 28; // 假设有30帧动画
// 加载序列帧图像
const loadImages = (): Promise<void[]> => {
  const imagePromises = [];

  for (let i = 0; i < totalFrames; i++) {
    const img = new Image();
    img.src = getAssetsImages(`hand/hand${i}.png`);
    // 使用 Promise 来确保图片加载完成
    const imageLoadPromise = new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Image failed to load: frame${i}.png`));
    });
    frameImages.value.push(img);
    imagePromises.push(imageLoadPromise);
  }

  return Promise.all(imagePromises);
};

const canvasWidth = 800; // 原始动画尺寸
const canvasHeight = 600; // 原始动画尺寸

// 动态设置Canvas的尺寸
// const resizeCanvas = () => {
//   if (!canvas.value) return;

//   // 获取窗口尺寸并按比例调整
//   const scaleFactor = window.innerWidth / canvasWidth * window.devicePixelRatio;
//   canvas.value.width = window.innerWidth * window.devicePixelRatio;
//   canvas.value.height = canvasHeight * scaleFactor;
// };


// 渲染动画帧
const drawFrame = (ctx: CanvasRenderingContext2D) => {
  // 清空画布
  ctx.clearRect(0, 0, canvas.value!.width, canvas.value!.height);
  // 绘制当前帧
  ctx.drawImage(frameImages.value[frameIndex], 0, 0);
  // 更新帧索引，循环播放动画
  frameIndex = (frameIndex + 1) % totalFrames;
  // 请求下一帧动画
  requestAnimationFrame(() => drawFrame(ctx));
};

onMounted(() => {
  if (!canvas.value) return;
  const ctx = canvas.value.getContext('2d');
  if (!ctx) return;

  // 调整 canvas 尺寸
  // resizeCanvas();

  // 加载图片并开始绘制动画
  loadImages().then(() => {
    drawFrame(ctx);
  });

  // 监听窗口大小变化
  // window.addEventListener('resize', resizeCanvas);
});

// onBeforeUnmount(() => {
//   // 移除resize事件监听
//   window.removeEventListener('resize', resizeCanvas);
// });


</script>

<style scoped lang="scss">
.animation-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 341px;
  width: 801px;
  background-color: transparent;
  margin: 0;
}

#canvas {
  width: 100%;
  height: 100%;
}

// canvas {
//   border: 1px solid #ccc;
// }
</style>
