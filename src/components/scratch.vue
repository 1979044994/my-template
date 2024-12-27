<template>
  <div class="scratch-canvas">
    <img src="https://yjcmndzb.sanguosha.com/un.webp" alt="pic" />
    <canvas ref="canvas" :width="width" :height="height"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const width = 400;
const height = 300;
const canvas = ref<HTMLCanvasElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);
const done = ref(false);
const currPerct = ref(0);
const posX = ref(0);
const posY = ref(0);
const maskColor = 'grey';
const cursorRadius = 10;
const maxEraseArea = 10;
const text = '刮一刮';

const firstEraseCbk = () => {
  console.log('第一次刮的回调');
};
const lastEraseCbk = () => {
  console.log('刮开的回调');
};

const reset = () => {
  done.value = false;
  currPerct.value = 0;
  if (ctx.value) {
    ctx.value.clearRect(0, 0, width, height);
    addCoat();
  }
};

onMounted(() => {
  if (canvas.value) {
    ctx.value = canvas.value.getContext('2d');
    if (ctx.value) {
      addCoat();
    }
  }
});

const addCoat = () => {
  if (ctx.value) {
    ctx.value.beginPath();
    ctx.value.fillStyle = maskColor;
    ctx.value.fillRect(0, 0, width, height);
    if (text) {
      ctx.value.font = 'bold 48px serif';
      ctx.value.fillStyle = '#fff';
      ctx.value.textAlign = 'center';
      ctx.value.textBaseline = 'middle';
      ctx.value.fillText(text, width / 2, height / 2);
    }
  }
};

const erase = (e: MouseEvent) => {
  if (done.value) return;
  const x = e.clientX;
  const y = e.clientY;
  if (ctx.value) {
    ctx.value.globalCompositeOperation = 'destination-out';
    ctx.value.beginPath();
    ctx.value.arc(x - width / 2, y, cursorRadius, 0, Math.PI * 2);
    ctx.value.fill();
  }
};

const getScratchedPercentage = () => {
  if (ctx.value) {
    const pixels = ctx.value.getImageData(0, 0, width, height).data;
    let transparentPixels = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] < 128) {
        transparentPixels++;
      }
    }
    currPerct.value = ((transparentPixels / pixels.length * 4 * 100)).toFixed(2);
  }
};

const fadeOut = (alpha: number) => {
  return () => {
    if (ctx.value) {
      ctx.value.save();
      ctx.value.globalCompositeOperation = 'source-in';
      ctx.value.fillStyle = ctx.value.fillStyle + (alpha -= 1).toString(16);
      ctx.value.fillRect(0, 0, width, height);
      ctx.value.restore();
      if (alpha > 210) {
        requestAnimationFrame(() => fadeOut(alpha)());
      }
    }
  };
};

canvas.value?.addEventListener('mousedown', (e) => {
  console.log('mousedown');

  if (done.value) {
    return;
  }
  posX.value = e.clientX;
  posY.value = e.clientY;
  if (e.which === 1 && e.button === 0) {
    const bindEarse = erase.bind(this);
    canvas.value?.addEventListener('mousemove', bindEarse);
  }
  if (currPerct.value === 0) {
    firstEraseCbk();
  }
});

document.addEventListener('mouseup', (e) => {
  if (done.value) {
    return;
  }
  if (e.target === canvas.value) {
    if (posX.value === e.clientX && posY.value === e.clientY) {
      erase(e);
    }
    canvas.value?.removeEventListener('mousemove', erase);
    getScratchedPercentage();
    if (currPerct.value >= maxEraseArea) {
      done.value = true;
      requestAnimationFrame(fadeOut(255)());
      lastEraseCbk();
      setTimeout(() => {
        reset();
      }, 2000);
    }
  }
});
</script>

<style scoped>
.scratch-canvas {
  width: 100%;
  height: 100%;
}

img {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -1;
}

canvas {
  width: 100%;
  height: 100%;
}
</style>
