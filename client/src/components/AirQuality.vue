<template>
  <div id="airQuality" class="p-2 rounded shadow bg-white"></div>
</template>

<script>
import Anychart from "anychart";
import { host, socket } from "@/main"

export default {
  name: "AirQuality",
  data() {
    return {
      records: [],
      airQuality: undefined,
      chart: Anychart.line(),
    }
  },
  methods: {
    init() {
      this.axios.get(host + "/airQuality")
        .then(res => {
          this.records = res.data
              .sort((a,b) => a.time - b.time)
          console.log(this.records)
          this.airQuality = Anychart.data.set(this.records.map(r => {
            return [
                r.time.toLocaleString().slice(11, 19),
                r.concentration
            ]
          }))
          this.plotChart()
        })
    },
    plotChart() {
      const series = this.chart.area(this.airQuality)
      series.name("Air Quality")
      this.chart.yAxis().title("Particulate Concentration (pcs/l)")
      this.chart.xAxis().title("Time")
      this.chart.yScale().minimum(0);
      this.chart.xScale().mode("continuous")
      this.chart.container("airQuality")
      this.chart.height(400)
      this.chart.title("Air Quality")
      series.color("#ABDAA0")
      this.chart.draw()
    },
  },
  mounted: function() {
    socket.on("airQuality", (msg) => {
      this.airQuality.append([msg.time.toLocaleString().slice(11, 19), msg.concentration])
    })
    this.init()
  },
}
</script>
