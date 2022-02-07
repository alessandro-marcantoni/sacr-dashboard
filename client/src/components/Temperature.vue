<template>
  <div :class="this.addClass()" id="temperature"></div>
</template>

<script>
import {host, socket} from "@/main";
import Anychart from "anychart"
import moment from "moment";

export default {
  name: "Temperature",
  props: [
    "device",
    "time",
  ],
  watch: {
    device: function(newVal, oldVal) {
      if (newVal !== oldVal) {
        const elem = document.getElementById("temperature")
        if (elem.childNodes.length > 0) {
          elem.removeChild(elem.childNodes[0])
        }
        this.chart = Anychart.line()
        this.init(newVal, this.time)
      }
    },
    time: function(newVal, oldVal) {
      if (newVal !== oldVal) {
        const elem = document.getElementById("temperature")
        if (elem.childNodes.length > 0) {
          elem.removeChild(elem.childNodes[0])
        }
        this.chart = Anychart.line()
        this.init(this.device, newVal)
      }
    },
  },
  data() {
    return {
      records: [],
      temperature: undefined,
      chart: Anychart.area(),
    }
  },
  methods: {
    init(d, t) {
      this.axios.get(host + "/temperatureHumidity")
        .then(res => {
          this.records = res.data
              .filter(r => r.device === d)
              .filter(r => moment(r.time).isBetween(moment(t.startTime), moment(t.endTime)))
              .sort((a,b) => a.time - b.time)
          this.temperature = Anychart.data.set(this.records.map(r => {
            return [
              r.time.toLocaleString().slice(11, 19),
              r.temperature
            ]
          }))
          if (d !== "") {
            this.plotChart()
          }
        })
    },
    plotChart() {
      const series = this.chart.area(this.temperature)
      series.name("Temperature")
      this.chart.yAxis().title("Temperature (°C)")
      this.chart.xAxis().title("Time")
      this.chart.yScale().minimum(0)
      this.chart.yScale().maximum(40)
      this.chart.xScale().mode("continuous")
      this.chart.container("temperature")
      this.chart.height(400)
      this.chart.title("Temperature")
      series.color("#ffb89c")
      this.chart.draw()
    },
    addClass() {
      return `p-md-2 rounded shadow bg-white ${this.device === '' ? 'invisible' : ''}`
    },
  },
  mounted: function() {
    socket.on("tempHumidity", (msg) => {
      if (msg.device === this.device &&
          moment(msg.time).isBetween(moment(this.time.startTime), moment(this.time.endTime))) {
        this.temperature.append([msg.time.toLocaleString().slice(11, 19), msg.temperature])
      }
    })
    this.init("", this.time)
    //setInterval(this.init, 10000)
  },
}
</script>

<style>
#temperature, #temperature > div, svg {
  min-height: 400px !important;
}

.anychart-credits {
  display: none;
}
</style>
