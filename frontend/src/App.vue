<template>
  <div id="app" class="black">
    <Citas />
  </div>
</template>

<script>
import Citas from './components/Citas.vue';

export default {
  components: {
    Citas,
  },
};
</script>

<style>
.black {
  background-color: black;
  color: black;
}
</style>
