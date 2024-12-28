<template>
  <div class="image-preview-modal" v-if="visible" @click.self="closePreview">
    <div class="image-container">
      <img class="image-content" :src="url" @click.stop />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  imageUrls: {
    type: Array,
    required: false,
  },
});

const visible = ref(false);
const url = ref('');
const showPreview = ([value]) => {
  console.log(value);
  url.value = value;

  visible.value = true;
};

const closePreview = () => {
  visible.value = false;
};

defineExpose({
  showPreview,
  closePreview,
});
</script>

<style scoped>
.image-preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.image-container {
  max-width: 80%;
  max-height: 80%;
}

.image-content {
  width: 562.5px;
  height: 1000.5px;
}
</style>
