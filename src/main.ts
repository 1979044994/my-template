
import preloadDirective from '@/directives/preload';
import VConsole from 'vconsole';
import { createApp } from 'vue';
import App from './App.vue';
import './style.css';
const vConsole = new VConsole();


createApp(App).directive('preload', preloadDirective).mount("#app");
