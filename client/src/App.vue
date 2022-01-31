<template>
  <div class="container-fluid mt-5">
    <div class="row">
      <div class="col-6 p-5">
        <TempHumidity></TempHumidity>
      </div>
    </div>
  </div>
</template>

<script>
import TempHumidity from "@/components/TempHumidity";

export default {
  name: 'App',
  components: {
    TempHumidity,
  },
}
</script>

<style>
#app {
  min-height: 1080px !important;
}
</style>