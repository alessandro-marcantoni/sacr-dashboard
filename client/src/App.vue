<template>
  <Navbar></Navbar>
  <div class="container-fluid bg-light py-4">
    <div class="row">
      <div class="col-6 p-4">
        <Temperature></Temperature>
      </div>
      <div class="col-6 p-4">
        <Humidity></Humidity>
      </div>
    </div>
    <div class="row">
      <div class="col-12 p-4">
        <AirQuality></AirQuality>
      </div>
    </div>
  </div>
</template>

<script>
import Humidity from "@/components/Humidity";
import AirQuality from "@/components/AirQuality";
import Navbar from "@/components/Navbar";
import Temperature from "@/components/Temperature";

export default {
  name: 'App',
  components: {
    Temperature,
    Navbar,
    AirQuality,
    Humidity,
  },
}
</script>
