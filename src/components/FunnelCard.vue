<template lang="pug">
v-card(outlined)
  v-card-title {{ funnelName }}
  v-card-subtitle {{ funnelDescription }}
  v-card-text(style="text-align: center") 
    v-progress-circular(v-if="loading", indeterminate)
    section(v-else)
      v-row
        v-col(cols=6)
          v-select(:items="listPlatforms", label="Platform")
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
                label="Date range",
                prepend-inner-icon="mdi-calendar",
                readonly,
                v-bind="attrs",
                v-on="on"
              )
            v-date-picker(v-model="dates", range, no-title)
      LineChart(:data="funnelData", :steps="steps")
  v-card-actions
    v-spacer
    v-btn(icon, color="red")
      v-icon mdi-delete
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import LineChart from "@/components/LineChart.vue";
import { distinctPlatforms, getMeta } from "@/services/api.service";

@Component({
  components: {
    LineChart
  }
})
export default class FunnelCard extends Vue {
  @Prop() id!: string;
  @Prop() name!: string;
  @Prop() description!: string;
  @Prop() steps!: string[];
  listPlatforms: string[] = [];

  loading = true;
  funnelData: number[] = [];

  menu = false;
  dates = ["2021-01-01", "2021-01-01"];

  async mounted(): Promise<void> {
    this.loading = true;
    this.funnelData = await getMeta(this.id);
    this.listPlatforms = await distinctPlatforms();
    this.loading = false;
  }

  get funnelName(): string {
    return this.name;
  }

  get funnelDescription(): string {
    return this.description;
  }
}
</script>