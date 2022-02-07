<template>
  <div :class="this.addClass()" id="airQuality"></div>
</template>

<script>
import Anychart from "anychart";
import { host, socket } from "@/main"
import moment from "moment";

export default {
  name: "AirQuality",
  props: [
    "device",
    "time",
  ],
  watch: {
    device: function(newVal, oldVal) {
      if (newVal !== oldVal) {
        const elem = document.getElementById("airQuality")
        if (elem.childNodes.length > 0) {
          elem.removeChild(elem.childNodes[0])
        }
        this.chart = Anychart.line()
        this.init(newVal, this.time)
      }
    },
    time: function(newVal, oldVal) {
      if (newVal !== oldVal) {
        const elem = document.getElementById("airQuality")
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
      airQuality: undefined,
      chart: Anychart.line(),
    }
  },
  methods: {
    init(d, t) {
      this.axios.get(host + "/airQuality")
        .then(res => {
          this.records = res.data
              .filter(r => r.device === d)
              .filter(r => moment(r.time).isBetween(moment(t.startTime), moment(t.endTime)))
              .sort((a,b) => a.time - b.time)
          this.airQuality = Anychart.data.set(this.records.map(r => {
            return [
                r.time.toLocaleString().slice(11, 19),
                r.concentration
            ]
          }))
          if (d !== "") {
            this.plotChart()
          }
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
    addClass() {
      return `p-md-2 rounded shadow bg-white ${this.device === '' ? 'invisible' : ''}`
    },
  },
  mounted: function() {
    socket.on("airQuality", (msg) => {
      if (msg.device === this.device &&
          moment(msg.time).isBetween(moment(this.time.startTime), moment(this.time.endTime))) {
        this.airQuality.append([msg.time.toLocaleString().slice(11, 19), msg.concentration])
      }
    })
    this.init("", this.time)
  },
}
</script>
