<template>
  <TempHumidity></TempHumidity>
</template>

<script>
import TempHumidity from "@/components/TempHumidity";

export default {
  name: 'App',
  components: {
    TempHumidity,
  }
}
</script>

<style>
#app {
  min-height: 1080px !important;
}
</style>