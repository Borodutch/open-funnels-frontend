<template lang="pug">
section
  v-text-field(
    filled,
    dense,
    rounded,
    prepend-inner-icon="mdi-magnify",
    label="Find..."
  )
  v-row
    v-col(v-for="n in 3", :key="n", cols="6")
      v-card(outlined)
        v-card-title Funnel
        v-card-subtitle Funnel description
        v-card-text(style="text-align: center") 
          v-row
            v-col(cols=6)
              v-select(:items="['iOS', 'Android', 'Web']", label="Platform")
            v-col(cols=6)
              v-menu(
                ref="menu",
                v-model="menu",
                :close-on-content-click="false",
                :return-value.sync="dates",
                transition="scale-transition",
                offset-y,
                min-width="auto"
              )
                template(v-slot:activator="{ on, attrs }")
                  v-text-field(
                    v-model="dateRangeText",
                    label="Dates",
                    prepend-inner-icon="mdi-calendar",
                    readonly,
                    v-bind="attrs",
                    v-on="on"
                  )
                v-date-picker(v-model="dates", range, no-title)
          LineChart(:chartdata="chartdata", :options="chartOptions")
        v-card-actions
          v-btn(text, color="primary") Export data
            v-icon(right, dark) mdi-share
          v-spacer
          v-btn(icon, color="red")
            v-icon mdi-delete
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
  menu = false;
  dates = ["2021-01-01", "2021-01-01"];
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

  get dateRangeText() {
    return this.dates.join(" ~ ");
  }
}
</script>
