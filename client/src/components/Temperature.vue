<template>
  <div id="temperature" class="p-2 rounded shadow bg-white"></div>
</template>

<script>
import {host, socket} from "@/main";
import Anychart from "anychart"

export default {
  name: "Temperature",
  data() {
    return {
      records: [],
      temperature: undefined,
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
          this.temperature = Anychart.data.set(this.records.map(r => {
            return [
              r.time.toLocaleString().slice(11, 19),
              r.temperature
            ]
          }))
          this.plotChart()
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
      series.color("#64BB62")
      this.chart.draw()
    },
  },
  mounted: function() {
    socket.on("tempHumidity", (msg) => {
      this.temperature.append([msg.time.toLocaleString().slice(11, 19), msg.temperature])
    })
    this.init()
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
