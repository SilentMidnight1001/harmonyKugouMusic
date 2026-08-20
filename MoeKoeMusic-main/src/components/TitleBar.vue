<template>
  <div class="titlebar" v-if="isElectron && !isMac && $route.name !== 'VideoPlayer'">
    <div class="window-controls">
      <button class="control-button" @click="minimizeWindow" title="最小化" aria-label="最小化">
        <svg viewBox="0 0 12 12" width="12" height="12"><path d="M1 6h10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
      </button>
      <button class="control-button" @click="maximizeWindow" title="最大化" aria-label="最大化">
        <svg viewBox="0 0 12 12" width="12" height="12"><rect x="1.5" y="1.5" width="9" height="9" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>
      </button>
      <button class="control-button close" @click="closeWindow" title="关闭" aria-label="关闭">
        <svg viewBox="0 0 12 12" width="12" height="12"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
      </button>
    </div>
  </div>
</template>

<script setup>
const isElectron = typeof window !== 'undefined' && typeof window.electron !== 'undefined';
const isMac = isElectron && window.electron.platform == 'darwin';
const closeWindow = () => window.electron.ipcRenderer.send('window-control', 'close');
const minimizeWindow = () => window.electron.ipcRenderer.send('window-control', 'minimize');
const maximizeWindow = () => window.electron.ipcRenderer.send('window-control', 'maximize');
</script>

<style lang="scss" scoped>
.titlebar {
  -webkit-app-region: no-drag;
  height: 32px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  z-index: 9999;
  position: fixed;
  top: 0;
  right: 0;
  pointer-events: auto;
}

.window-controls {
  -webkit-app-region: no-drag;
  display: flex;
  height: 100%;
  color: #666;
}

html.dark .window-controls {
  color: #ccc;
}

.control-button {
  -webkit-app-region: no-drag;
  width: 46px;
  height: 32px;
  border: none;
  padding: 0;
  margin: 0;
  background: transparent;
  color: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  pointer-events: auto;
  transition: background-color 0.15s ease, color 0.15s ease;

  svg {
    display: block;
    pointer-events: none;
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.12);
  }

  &.close:hover {
    background-color: #e81123;
    color: #ffffff;
  }

  &:focus {
    outline: none;
  }
}
</style>
