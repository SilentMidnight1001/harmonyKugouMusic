import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPersistedstate from 'pinia-plugin-persistedstate';
import App from './App.vue';
import router from './router/router';
import { formatMilliseconds, getCover, applyColorTheme, setTheme } from '../src/utils/utils';
import ModalPlugin from './plugins/ModalPlugin';
import MessagePlugin from './plugins/MessagePlugin';
import i18n from './utils/i18n';
import '@/assets/themes/dark.scss';
import { registerSW } from 'virtual:pwa-register'

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPersistedstate);
app.config.globalProperties.$getCover = getCover;
app.config.globalProperties.$formatMilliseconds = formatMilliseconds;
app.config.globalProperties.$applyColorTheme = applyColorTheme;
app.config.globalProperties.$setTheme = setTheme;
app.config.errorHandler = (err, vm, info) => {
  console.error(`全局捕获异常: ${info}`, err);
};
app.config.warnHandler = (msg, vm, trace) => {
  console.warn(`全局捕获警告: ${msg}`, trace);
};
window.addEventListener('unhandledrejection', event => {
  console.error('未处理的 Promise 拒绝:', event.reason);
  // window.$modal.alert('系统错误');
});

if (!window.electron && !import.meta.env.DEV) {
  registerSW({
    onNeedRefresh() {
      console.log('有新内容可用，请刷新页面')
    },
    onOfflineReady() {
      console.log('应用已准备好离线工作')
    }
  })
}

app.use(pinia);
app.use(router);
app.use(i18n);
app.use(ModalPlugin);
app.use(MessagePlugin);

// 从 Electron 主进程同步读取已持久化设置并回填到 localStorage。
// 鸿蒙端 webview 的 localStorage 不保证跨启动持久化，而主进程用 electron-store 落盘，
// 因此在挂载前把主进程里的设置同步回来，避免每次退出后设置被重置。
if (window.electron && window.electron.ipcRenderer && typeof window.electron.ipcRenderer.sendSync === 'function') {
    try {
        const persistedSettings = window.electron.ipcRenderer.sendSync('get-settings');
        if (persistedSettings && typeof persistedSettings === 'object' && Object.keys(persistedSettings).length > 0) {
            let localSettings = {};
            try {
                localSettings = JSON.parse(localStorage.getItem('settings') || '{}');
            } catch (e) { /* 忽略解析错误 */ }
            localStorage.setItem('settings', JSON.stringify({ ...persistedSettings, ...localSettings }));
        }
    } catch (error) {
        console.error('[main] 读取持久化设置失败:', error);
    }
}

app.mount('#app');