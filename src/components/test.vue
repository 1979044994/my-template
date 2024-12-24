<template>
  <div class="animation-container">
    <slot name="icon"></slot>
    <slot name="audio"></slot>
    <canvas ref="firstCanvas" id="firstCanvas"></canvas>
    <canvas ref="secondCanvas" id="secondCanvas" style="display:none;"></canvas>
  </div>
</template>

<script lang="ts" setup>
import { debounce, getAssetsImages } from '@/utils/image';
import { onBeforeUnmount, onMounted, ref } from 'vue';

// 第一个画布及图片帧
const firstCanvas = ref<HTMLCanvasElement | null>(null);
const firstFrameImages = ref<HTMLImageElement[]>([]);
let firstFrameIndex = 0;
const firstTotalFrames = 43;

// 第二个画布及图片帧
const secondCanvas = ref<HTMLCanvasElement | null>(null);
const secondFrameImages = ref<HTMLImageElement[]>([]);
let secondFrameIndex = 0;
const secondTotalFrames = 95;

// 新增变量用于控制动画速度，0 - 1之间，越小越慢
const animationSpeed = ref(1);

// 加载第一个序列帧图像
const loadFirstImages = (): Promise<HTMLImageElement[]> => {
  const imagePromises = [];
  for (let i = 0; i < firstTotalFrames; i++) {
    const img = new Image();
    img.src = getAssetsImages(`start/back${i}.webp`);
    const imageLoadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Image failed to load: start/back${i}.webp`));
    });
    imagePromises.push(imageLoadPromise);
  }
  return Promise.all(imagePromises);
}

// 加载第二个序列帧图像
const loadSecondImages = (): Promise<HTMLImageElement[]> => {
  const imagePromises = [];
  for (let i = 0; i < secondTotalFrames; i++) {
    const img = new Image();
    img.src = getAssetsImages(`transition/transition${i + 1}.webp`);
    const imageLoadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Image failed to load: transition/transition${i + 1}.webp`));
    });
    imagePromises.push(imageLoadPromise);
  }
  return Promise.all(imagePromises);
}

interface DrawFrameParams {
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D;
  images: HTMLImageElement[];
  index: number;
}
const drawFrame = ({ canvas, ctx, images, index }: DrawFrameParams): number => {
  if (!canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const img = images[index];
  const scaleX = canvas.width / img.width;
  const scaleY = canvas.height / img.height;
  const scale = Math.max(scaleX, scaleY);
  const drawWidth = img.width * scale;
  const drawHeight = img.height * scale;
  const offsetX = (canvas.width - drawWidth) / 2;
  const offsetY = (canvas.height - drawHeight) / 2;
  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  return (index + 1) % images.length;
}

const resizeCanvas = (canvas: HTMLCanvasElement | null) => {
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
}

const debouncedResizeCanvas = debounce((canvas: HTMLCanvasElement | null) => {
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
}, 200);

const playAnimation = (canvas: HTMLCanvasElement | null, images: HTMLImageElement[], speed: number) => {
  const baseFps = 30;
  const frameInterval = Math.round(1000 / (baseFps * speed));
  let lastTime = 0;
  let currentIndex = 0;
  const draw = () => {
    const now = performance.now();
    if (now - lastTime >= frameInterval) {
      const ctx = canvas?.getContext('2d');
      if (ctx) {
        currentIndex = drawFrame({ canvas, ctx, images, index: currentIndex });
      }
      lastTime = now;
    }
    requestAnimationFrame(draw);
  };
  draw();
  return new Promise<void>((resolve) => {
    const total = images.length;
    const checkEnd = () => {
      if (currentIndex === 0) {
        resolve();
      }
    };
    checkEnd();
  });
}

let secondAnimationLoaded = false;
const playFirstAnimation = async () => {
  const loadedImages = await loadFirstImages();
  firstFrameImages.value = loadedImages;
  if (firstCanvas.value) {
    resizeCanvas(firstCanvas.value);
    await playAnimation(firstCanvas.value, firstFrameImages.value, animationSpeed.value);
  }
}

const playSecondAnimation = async () => {
  if (!secondAnimationLoaded) {
    secondFrameImages.value = await loadSecondImages();
    secondAnimationLoaded = true;
  }
  if (secondCanvas.value) {
    secondCanvas.style.display = 'block';
    firstCanvas.style.display = 'none';
    resizeCanvas(secondCanvas.value);
    await playAnimation(secondCanvas.value, secondFrameImages.value, animationSpeed.value);
    // 动画播放完发送事件给父组件
    emit('video-ended', true);
  }
}

onMounted(() => {
  firstCanvas.value = document.getElementById('firstCanvas') as HTMLCanvasElement;
  secondCanvas.value = document.getElementById('secondCanvas') as HTMLCanvasElement;

  const ctx = firstCanvas.value?.getContext('2d');
  if (!ctx) return;

  const initAnimation = async () => {
    await playFirstAnimation();
  };

  initAnimation();

  window.addEventListener('resize', () => {
    if (firstCanvas.value) debouncedResizeCanvas(firstCanvas.value);
    if (secondCanvas.value) debouncedResizeCanvas(secondCanvas.value);
  });
  // 添加触摸事件监听，这里假设是移动端上滑触发
  window.addEventListener('touchstart', (e) => {
    const startY = e.touches[0].clientY;
    const handleTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY;
      if (currentY < startY) {
        playSecondAnimation();
        window.removeEventListener('touchmove', handleTouchMove);
      }
    };
    window.addEventListener('touchmove', handleTouchMove);
  });
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', () => { });
  window.removeEventListener('touchstart', () => { });
});

// 声明 emits
const emits = defineEmits<{
  (e: 'video-ended', value: boolean): void;
}>();
</script>

<style scoped lang="scss">
.animation-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: transparent;
  margin: 0;
}
</style>
