<template>
  <div id="tempHumidity"></div>
</template>

<script>
import {host, socket} from "@/main";
import Anychart from "anychart"

export default {
  name: "TempHumidity",
  data() {
    return {
      records: [],
      temperature: undefined,
      humidity: undefined,
      chart: Anychart.line(),
    }
  },
  methods: {
    init() {
      this.axios.get(host + "/temperatureHumidity")
        .then(res => {
          this.records = res.data
              //.filter(r => !this.temperature.data().map(t => t.time).includes(r.time.toLocaleString().slice(11, 19)))
              .sort((a,b) => a.time - b.time)
          this.temperature = Anychart.data.set(this.records.map(r => {
            return [
              r.time.toLocaleString().slice(11, 19),
              r.temperature
            ]
          }))
          this.humidity = Anychart.data.set(this.records.map(r => {
            return [
              r.time.toLocaleString().slice(11, 19),
              r.humidity
            ]
          }))
          this.plotChart()
          console.log(this.temperature.data())
        })
    },
    plotChart() {
      this.chart.line(this.humidity).name("Humidity")
      this.chart.line(this.temperature).name("Temperature")
      this.chart.yAxis().title("Temperature and Humidity")
      this.chart.xAxis().title("Time")
      this.chart.container("tempHumidity")
      this.chart.height(400)
      this.chart.draw()
    },
  },
  mounted: function() {
    socket.on("tempHumidity", (msg) => {
      this.humidity.append([msg.time.toLocaleString().slice(11, 19), msg.humidity])
      this.temperature.append([msg.time.toLocaleString().slice(11, 19), msg.temperature])
    })
    this.init()
    //setInterval(this.init, 10000)
  },
}
</script>

<style>
#tempHumidity, #tempHumidity > div, svg {
  min-height: 400px !important;
}

.anychart-credits {
  display: none;
}
</style>
