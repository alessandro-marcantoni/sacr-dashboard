<template>
  <div id="tempHumidity"></div>
</template>

<script>
import { host } from "@/main";
import Anychart from "anychart"

export default {
  name: "TempHumidity",
  data() {
    return {
      temperature: Anychart.data.set([]),
      humidity: Anychart.data.set([]),
      chart: null,
    }
  },
  methods: {
    init() {
      this.axios.get(host + "/temperatureHumidity")
        .then(res => {
          this.records = res.data.sort((a,b) => a.time - b.time)
          this.temperature = this.records.map(r => {
            return [r.time.toLocaleString().slice(11, 19), r.temperature]
          })
          this.humidity = this.records.map(r => {
            return [r.time.toLocaleString().slice(11, 19), r.humidity]
          })
        })
    },
    plotChart() {
      this.chart = Anychart.line()
      this.chart.line(this.humidity).name("Humidity")
      this.chart.line(this.temperature).name("Temperature")
      this.chart.yAxis().title("Temperature and Humidity")
      this.chart.xAxis().title("Time")
      this.chart.container("tempHumidity")
      this.chart.xScale().mode('continuous')
      this.chart.height(400)
      this.chart.draw()
    },
  },
  mounted: function() {
    console.log(this.temperature.data())
    this.init()
    this.plotChart()
    setInterval(() => {
      this.init()
    }, 5000)
  }
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
