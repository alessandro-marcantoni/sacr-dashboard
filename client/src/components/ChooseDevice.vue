<template>
  <form class="p-3">
    <label for="room-select">Choose a room to monitor:</label>
    <select class="form-select" name="rooms" id="room-select" @change="this.switchDevice($event)">
      <option value="">--Please choose an option--</option>
      <option v-for="room in this.rooms" :value="room.device" :key="room">{{ room.room }}</option>
    </select>
  </form>
</template>

<script>
import {host} from "@/main";

export default {
  name: "ChooseDevice",
  data() {
    return {
      rooms: [],
    }
  },
  methods: {
    init() {
      this.axios.get(host + "/rooms")
        .then(res => {
          this.rooms = res.data
        })
    },
    switchDevice(event) {
      this.$emit("switchDevice", event.target.value);
    }
  },
  mounted: function() {
    this.init()
  },
}
</script>
