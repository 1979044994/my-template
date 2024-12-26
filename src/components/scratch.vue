<template>
  <div>
    <img :src="imageUrl" alt="pic" />
    <canvas ref="canvas" :width="canvasWidth" :height="canvasHeight"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const imageUrl = ref('./test.jpg');
const canvasWidth = ref(400);
const canvasHeight = ref(300);
const maskColor = ref('grey');
const cursorRadius = ref(10);
const maxEraseArea = ref(10);
const text = ref('刮一刮');
const currPerct = ref(0);
const done = ref(false);
let posX: number | null = null;
let posY: number | null = null;
const canvas = ref<HTMLCanvasElement | null>(null);

const addCoat = () => {
  if (canvas.value) {
    const ctx = canvas.value.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.fillStyle = maskColor.value;
      ctx.fillRect(0, 0, canvasWidth.value, canvasHeight.value);
      if (text.value) {
        ctx.font = 'bold 48px serif';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text.value, canvasWidth.value / 2, canvasHeight.value / 2);
      }
    }
  }
};

const erase = (e: MouseEvent) => {
  if (canvas.value && canvas.value.getContext('2d')) {
    const ctx = canvas.value.getContext('2d');
    const x = e.clientX;
    const y = e.clientY;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x - canvasWidth.value / 2, y, cursorRadius.value, 0, Math.PI * 2);
    ctx.fill();
  }
};

const getScratchedPercentage = () => {
  if (canvas.value && canvas.value.getContext('2d')) {
    const ctx = canvas.value.getContext('2d');
    const pixels = ctx.getImageData(0, 0, canvasWidth.value, canvasHeight.value).data;
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
    if (canvas.value && canvas.value.getContext('2d')) {
      const ctx = canvas.value.getContext('2d');
      ctx.save();
      ctx.globalCompositeOperation = 'source-in';
      ctx.fillStyle = ctx.fillStyle + alpha.toString(16);
      ctx.fillRect(0, 0, canvasWidth.value, canvasHeight.value);
      ctx.restore();
      if (alpha > 210) {
        requestAnimationFrame(() => fadeOut(alpha - 1)());
      }
    }
  };
};

const firstEraseCbk = () => {
  console.log('第一次刮');
};

const lastEraseCbk = () => {
  console.log('刮开完成');
};

onMounted(() => {
  addCoat();
  if (canvas.value) {
    canvas.value.addEventListener('mousedown', (e) => {
      if (done.value) {
        return;
      }
      posX = e.clientX;
      posY = e.clientY;
      if (e.which === 1 && e.button === 0) {
        canvas.value.addEventListener('mousemove', (e) => {
          if (posX !== null && posY !== null) {
            erase(e);
          }
        });
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
        if (posX === e.clientX && posY === e.clientY) {
          erase(e);
        }
        canvas.value.removeEventListener('mousemove', (e) => {
          if (posX !== null && posY !== null) {
            erase(e);
          }
        });
        getScratchedPercentage();
        if (currPerct.value >= maxEraseArea.value) {
          done.value = true;
          requestAnimationFrame(fadeOut(255));
          lastEraseCbk();
        }
      }
    });
  }
});
</script>

<style lang="scss" scoped>
img {
  width: 400px;
  height: 300px;
  position: absolute;
  z-index: -1;
}

canvas {
  margin-left: 200px;
}
</style>
