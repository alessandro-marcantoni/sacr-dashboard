<template>
  <Navbar></Navbar>
  <div class="container-fluid bg-light py-4 px-0 px-md-2">
    <div class="row">
      <div class="col-12 col-md-6">
        <ChooseDevice @switchDevice="this.deviceSwitched"></ChooseDevice>
      </div>
      <div class="col-12 col-md-6">
        <ChooseTime :time="this.time" @switchTime="this.timeSwitched"></ChooseTime>
      </div>
    </div>
    <div class="row">
      <div class="col-12 col-md-6 p-4">
        <Temperature :time="this.time" :device="this.device"></Temperature>
      </div>
      <div class="col-12 col-md-6 p-4">
        <Humidity :time="this.time" :device="this.device"></Humidity>
      </div>
    </div>
    <div class="row">
      <div class="col-12 p-4">
        <AirQuality :time="this.time" :device="this.device"></AirQuality>
      </div>
    </div>
  </div>
</template>

<script>
import Humidity from "@/components/Humidity";
import AirQuality from "@/components/AirQuality";
import Navbar from "@/components/Navbar";
import Temperature from "@/components/Temperature";
import ChooseDevice from "@/components/ChooseDevice";
import ChooseTime from "@/components/ChooseTime";
import moment from "moment";

export default {
  name: 'App',
  components: {
    ChooseDevice,
    Temperature,
    Navbar,
    AirQuality,
    Humidity,
    ChooseTime,
  },
  data() {
    return {
      device: "",
      time: {
        startTime: moment()
            .subtract(1, "day")
            .add(1, "hour")
            .toISOString().substring(0, 16),
        endTime: moment()
            .add(1, "day")
            .add(1, "hour")
            .toISOString().substring(0, 16),
      },
    }
  },
  methods: {
    deviceSwitched(device) {
      this.device = device
    },
    timeSwitched(time) {
      this.time = time
    }
  },
}
</script>
