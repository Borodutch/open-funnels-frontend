<template lang="pug">
v-card(outlined)
  v-toolbar(color="blue-grey lighten-5", dense, flat)
    v-toolbar-title {{ funnelName }}
    v-spacer
    v-btn(
      icon,
      color="red lighten-3",
      :loading="loading",
      @click="removeFunnel"
    )
      v-icon mdi-delete
  v-card-subtitle {{ funnelDescription }}
  v-card-text(style="text-align: center") 
    v-skeleton-loader(v-if="loading", type="card-heading, image")
    section(v-else)
      v-row
        v-col(cols=6)
          v-select(
            filled,
            :items="listPlatforms",
            label="Platform",
            @change="updateMeta",
            prepend-inner-icon="mdi-cellphone-link",
            v-model="currentPlatform"
          )
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
                filled,
                v-model="inputDate",
                label="Date range",
                prepend-inner-icon="mdi-calendar",
                readonly,
                v-bind="attrs",
                v-on="on"
              )
            v-date-picker(v-model="dates", range, no-title, @change="saveDate")
      LineChart(:data="funnelData", :steps="steps")
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import LineChart from "@/components/LineChart.vue";
import {
  deleteFunnel,
  distinctPlatforms,
  getMeta
} from "@/services/api.service";
import moment from "moment";
import { namespace } from "vuex-class";

const SnackbarStore = namespace("SnackbarStore");

@Component({
  components: {
    LineChart
  }
})
export default class FunnelCard extends Vue {
  @SnackbarStore.Mutation showSnackbar!: (text: string) => void;
  @Prop() id!: string;
  @Prop() name!: string;
  @Prop() description!: string;
  @Prop() steps!: string[];

  loading = true;
  listPlatforms: string[] = [];
  currentPlatform = "";
  funnelData: number[] = [];
  menu = false;
  dates: string[] = ["", ""];

  async mounted(): Promise<void> {
    const startOfWeek = moment().startOf("week");
    const endOfWeek = moment().endOf("week");
    this.dates = [
      startOfWeek.format("YYYY-MM-DD"),
      endOfWeek.format("YYYY-MM-DD")
    ];
    this.loading = true;
    this.listPlatforms = await distinctPlatforms();
    this.currentPlatform = this.listPlatforms[0];
    this.funnelData = await getMeta(this.id, this.currentPlatform, [
      startOfWeek.format("x"),
      endOfWeek.format("x")
    ]);
    this.loading = false;
  }

  get funnelName(): string {
    return this.name;
  }

  get funnelDescription(): string {
    return this.description;
  }

  async updateMeta(): Promise<void> {
    this.loading = true;
    const startDate = moment(this.dates[0]).format("x");
    const endDate = moment(this.dates[1]).format("x");
    try {
      this.funnelData = await getMeta(this.id, this.currentPlatform, [
        startDate,
        endDate
      ]);
    } catch (error) {
      this.showSnackbar(error);
    } finally {
      this.loading = false;
    }
  }

  saveDate(date: string[]): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.$refs.menu as any).save(date);
    this.menu = false;
    this.updateMeta();
  }

  get inputDate(): string {
    return this.dates.join(" — ");
  }

  async removeFunnel(): Promise<void> {
    this.loading = true;
    try {
      await deleteFunnel(this.id);
      window.location.reload();
    } catch (error) {
      this.showSnackbar(error);
      this.loading = false;
    }
  }
}
</script>