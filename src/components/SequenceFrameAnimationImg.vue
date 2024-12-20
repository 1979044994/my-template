<template>
  <div class="animation-container">
    <img ref="animationImg" :src="currentFrameSrc" alt="动画帧" class="animation-img">
  </div>
</template>
<script lang="ts" setup>
import { getAssetsImages } from '@/utils/image';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

// 定义props
const props = defineProps({
  imgUrl: {
    type: String,
    required: true
  },
  start: {
    type: Boolean,
    default: true
  },
  animationSpeed: {
    type: Number,
    default: 1
  }
})

// 存储当前帧图片的路径，响应式数据
const currentFrameSrc = ref<string>('');
// 存储序列帧图片路径的数组
const frameImagePaths = ref<string[]>([]);
let frameIndex = 0;
const totalFrames = 43;

// 图片缓存数组
interface CachedImage {
  image: HTMLImageElement;
  timestamp: number;
}
const imageCache: CachedImage[] = [];
const MAX_CACHE_SIZE = 50;

// 添加图片到缓存
const addToCache = (imgPath: string, img: HTMLImageElement) => {
  const currentTime = Date.now();
  const cachedImage: CachedImage = { image: img, timestamp: currentTime };
  imageCache.push(cachedImage);
  if (imageCache.length > MAX_CACHE_SIZE) {
    // 移除最早加入缓存的图片（简单模拟LRU）
    imageCache.shift();
  }
}

// 从缓存中获取图片
const getFromCache = (imgPath: string): HTMLImageElement | undefined => {
  const index = imageCache.findIndex((cached) => cached.image.src === imgPath);
  if (index !== -1) {
    const cachedImage = imageCache.splice(index, 1)[0];
    const currentTime = Date.now();
    cachedImage.timestamp = currentTime;
    imageCache.push(cachedImage);
    return cachedImage.image;
  }
  return undefined;
}

// 预加载图片，使用Promise.all确保全部加载完成，并优化缓存
const loadImagePaths = (): Promise<void> => {
  const imagePromises: Promise<void>[] = [];
  for (let i = 0; i < totalFrames; i++) {
    let imgPath;
    if (props.start) {
      imgPath = getAssetsImages(`${props.imgUrl}/${props.imgUrl}${i}.png`);
    } else {
      imgPath = getAssetsImages(`${props.imgUrl}/${props.imgUrl}${i}.webp`);
    }

    const cachedImage = getFromCache(imgPath);
    if (cachedImage) {
      frameImagePaths.value.push(cachedImage);
      continue;
    }

    const img = new Image();
    img.src = imgPath;
    const imageLoadPromise = new Promise<void>((resolve, reject) => {
      img.onload = () => {
        addToCache(imgPath, img);
        resolve();
      };
      img.onerror = (error) => {
        console.error(`图片加载失败: ${imgPath}`, error);
        reject(error);
      };
    });
    imagePromises.push(imageLoadPromise);
  }
  return Promise.all(imagePromises).then(() => {
    frameImagePaths.value = frameImagePaths.value.concat(imagePromises.map((_, i) => {
      if (props.start) {
        return getAssetsImages(`${props.imgUrl}/${props.imgUrl}${i}.png`);
      } else {
        return getAssetsImages(`${props.imgUrl}/${props.imgUrl}${i}.webp`);
      }
    }));
  });
}

// 切换动画帧，更新当前帧图片路径
const switchFrame = (): void => {
  currentFrameSrc.value = frameImagePaths.value[frameIndex];
  frameIndex = (frameIndex + 1) % totalFrames;
}
// let frameCounter = 0;
// const switchFrame = (): void => {
//   currentFrameSrc.value = frameImagePaths.value[frameIndex];
//   frameCounter++;
//   if (frameCounter >= 2) { // 每2次调用switchFrame才更新1帧，可根据需要调整
//     frameIndex = (frameIndex + 1) % totalFrames;
//     frameCounter = 0;
//   }
// };
// const switchFrame = (): void => {
//   currentFrameSrc.value = frameImagePaths.value[frameIndex];
//   frameIndex = (frameIndex + props.animationSpeed) % totalFrames;
//   if (frameIndex < 0) {
//     frameIndex += totalFrames;
//   }
// };
// 使用 requestAnimationFrame 播放动画
let animationFrameId: number;
const playAnimation = () => {
  switchFrame();
  animationFrameId = requestAnimationFrame(playAnimation);
}

// 根据props变化决定是否重新加载图片
watch(() => [props.imgUrl, props.start], (newValues, oldValues) => {
  if (newValues[0] !== oldValues[0] || newValues[1] !== oldValues[1]) {
    // 如果imgUrl或者start属性变化了，重新加载图片
    loadImagePaths().then(() => {
      switchFrame();
      playAnimation();
    });
  }
})

onMounted(() => {
  loadImagePaths().then(() => {
    switchFrame();
    playAnimation();
  });
  const imgElement = document.querySelector('.animation-img');
  if (imgElement) {
    onBeforeUnmount(() => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      imgElement.removeEventListener('load', playAnimation);
    });
  }
})
</script>
<style scoped lang="scss">
.animation-img {
  width: 100%;
  height: 100%;
  object-fit: cover; // 保持图片比例自适应容器
}
</style>
