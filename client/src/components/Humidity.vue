<template>
  <div id="humidity" class="p-2 rounded shadow bg-white"></div>
</template>

<script>
import {host, socket} from "@/main";
import Anychart from "anychart"

export default {
  name: "Humidity",
  data() {
    return {
      records: [],
      humidity: undefined,
      chart: Anychart.area(),
    }
  },
  methods: {
    init() {
      this.axios.get(host + "/temperatureHumidity")
          .then(res => {
            this.records = res.data
                //.filter(r => !this.temperature.data().map(t => t.time).includes(r.time.toLocaleString().slice(11, 19)))
                .sort((a,b) => a.time - b.time)
            this.humidity = Anychart.data.set(this.records.map(r => {
              return [
                r.time.toLocaleString().slice(11, 19),
                r.humidity
              ]
            }))
            this.plotChart()
          })
    },
    plotChart() {
      const series = this.chart.area(this.humidity)
      series.name("Humidity")
      this.chart.yAxis().title("Humidity (%)")
      this.chart.xAxis().title("Time")
      this.chart.yScale().minimum(0)
      this.chart.yScale().maximum(100)
      this.chart.xScale().mode("continuous")
      this.chart.container("humidity")
      this.chart.height(400)
      this.chart.title("Humidity")
      series.color("#1E8120")
      this.chart.draw()
    },
  },
  mounted: function() {
    socket.on("tempHumidity", (msg) => {
      this.humidity.append([msg.time.toLocaleString().slice(11, 19), msg.humidity])
      //this.temperature.append([msg.time.toLocaleString().slice(11, 19), msg.temperature])
    })
    this.init()
    //setInterval(this.init, 10000)
  },
}
</script>

<style>
#humidity, #humidity > div, svg {
  min-height: 400px !important;
}

.anychart-credits {
  display: none;
}
</style>
