import { ref, computed } from 'vue';

export default function usePlaybackMode(t, audio) {
  const playbackModes = ref([
    { icon: 'fas fa-random', title: t('sui-ji-bo-fang') },
    { icon: 'fas fa-refresh', title: t('lie-biao-xun-huan') },
    { icon: '', title: t('dan-qu-xun-huan') },
    { icon: 'fas fa-bars-staggered', title: t('shun-xu-bo-fang') }
  ]);
  
  const currentPlaybackModeIndex = ref(1);
  const currentPlaybackMode = computed(() => playbackModes.value[currentPlaybackModeIndex.value]);
  // 随机播放：已播放歌曲集合 + 播放历史，保证不断从歌单中抽取未播放的新歌（不重复）
  const playedSongs = ref(new Set());
  const playHistory = ref([]);
  
  // 初始化播放模式
  const initPlaybackMode = () => {
    const savedMode = localStorage.getItem('player_playback_mode');
    currentPlaybackModeIndex.value = savedMode !== null ? parseInt(savedMode, 10) : 1;
    audio.loop = currentPlaybackModeIndex.value === 2;
    console.log('[PlaybackMode] 初始化播放模式:', currentPlaybackModeIndex.value);
  };

  // 重置随机已播放记录（换歌单或切换模式时调用）
  const resetShuffle = () => {
    playedSongs.value.clear();
    playHistory.value = [];
  };

  const setPlaybackMode = (index) => {
    currentPlaybackModeIndex.value = index;
    audio.loop = currentPlaybackModeIndex.value === 2;
    resetShuffle();
    localStorage.setItem('player_playback_mode', currentPlaybackModeIndex.value.toString());
    console.log('[PlaybackMode] 切换播放模式:', currentPlaybackModeIndex.value);
  };

  // 切换播放模式
  const togglePlaybackMode = () => {
    setPlaybackMode((currentPlaybackModeIndex.value + 1) % playbackModes.value.length);
  };
  
  return {
    playbackModes,
    currentPlaybackModeIndex,
    currentPlaybackMode,
    playedSongs,
    playHistory,
    resetShuffle,
    initPlaybackMode,
    togglePlaybackMode,
    setPlaybackMode
  };
} 
