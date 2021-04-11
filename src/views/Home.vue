<template>
  <div class="home">
    <Capture />
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  components: {
    Capture: () => import("@/views/Capture"),
  },
}
</script>
