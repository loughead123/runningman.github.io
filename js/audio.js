const AudioManager = (function () {
  const bgm = new Audio('assets/bgm.mp3');
  bgm.loop = true;
  bgm.volume = 0.6;

  let muted = false;

  function toggleMute() {
    muted = !muted;
    bgm.muted = muted;
    document.getElementById('muteBtn').textContent = muted ? '🔇' : '🔊';
  }

  return { bgm, toggleMute };
})();
