<template>
  <b-container>
    <video id="player" autoplay></video>
    <canvas id="canvas" width="320px" height="240px"></canvas>
    <button
      id="capture-btn"
      class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
    >
      Capture
    </button>
  </b-container>
</template>

<script>
export default {
  name: "Capture",
};
</script>

<style>
</style>