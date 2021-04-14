<template lang="pug">
section
  v-row
    v-col(v-for="n in 3", :key="n", cols="6")
      v-card(outlined)
        v-card-title Funnel
        v-card-subtitle Funnel description
        v-card-text(style="text-align: center") 
          LineChart(:chartdata="chartdata", :options="chartOptions")
        v-card-actions
          v-spacer
          v-btn(text) Export data
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import LineChart from "@/components/LineChart.vue";

@Component({
  components: {
    LineChart
  }
})
export default class Home extends Vue {
  chartdata = {
    labels: ["Login", "AddTask", "DeleteTask"],
    datasets: [
      {
        data: [40, 10, 5]
      }
    ]
  };
  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false
    }
  };
}
</script>
