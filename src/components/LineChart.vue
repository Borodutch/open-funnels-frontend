<script>
import { Line } from "vue-chartjs";

export default {
  extends: Line,
  props: {
    steps: {
      type: Array,
      default: null
    },
    data: {
      type: Array,
      default: null
    }
  },
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  mounted() {
    const chartdata = {
      labels: this.steps,
      datasets: [
        {
          data: this.data
        }
      ]
    };
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false
      }
    };
    this.renderChart(chartdata, chartOptions);
  }
};
</script>
