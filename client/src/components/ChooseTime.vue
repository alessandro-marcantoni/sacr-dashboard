<template>
  <form class="p-3">
    <div class="row">
      <div class="col-12 col-md-5">
        <label for="start-time">Start time:</label>
        <input class="form-control" type="datetime-local" id="start-time" v-bind:value="this.time.startTime">
      </div>
      <div class="col-12 col-md-5">
        <label for="end-time">End time:</label>
        <input class="form-control" type="datetime-local" id="end-time" v-bind:value="this.time.endTime">
      </div>
      <div class="col-12 col-md-2 d-flex align-content-end justify-content-around">
        <div class="btn btn-success mt-4 w-100" @click.prevent="this.selectTime">Set</div>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  name: "ChooseTime",
  props: [
      "time",
  ],
  methods: {
    selectTime() {
      this.$emit("switchTime", {
        startTime: document.getElementById("start-time").value,
        endTime: document.getElementById("end-time").value,
      })
    }
  }
}
</script>
