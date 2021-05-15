<template lang="pug">
v-card(outlined)
  v-toolbar(color="blue-grey lighten-5", dense, flat)
    v-toolbar-title {{ funnelName }}
    v-spacer
    EditFunnel(
      :cardLoading="loading",
      :funnel="{ _id: id, name, description, steps }"
    )
    v-btn(
      icon,
      color="red lighten-1",
      :loading="loading",
      @click="removeFunnel"
    )
      v-icon mdi-delete
  v-card-subtitle {{ funnelDescription }}
  v-card-text(style="text-align: center") 
    v-skeleton-loader(v-if="loading", type="card-heading, image")
    .section(v-else)
      v-row
        v-col(cols=12, md=6)
          v-select(
            filled,
            :items="listPlatforms",
            label="Platform",
            @change="updateMeta",
            prepend-inner-icon="mdi-cellphone-link",
            v-model="currentPlatform",
            hide-details
          )
        v-col(cols=12, md=6)
          v-menu(
            ref="menu",
            v-model="menu",
            :close-on-content-click="false",
            :return-value.sync="dates",
            transition="scale-transition",
            offset-y,
            left,
            min-width="auto"
          )
            template(v-slot:activator="{ on, attrs }")
              v-text-field(
                filled,
                v-model="inputDate",
                label="Date range",
                prepend-inner-icon="mdi-calendar",
                readonly,
                hide-details,
                v-bind="attrs",
                v-on="on"
              )
            v-date-picker(v-model="dates", range, no-title, @change="saveDate")
      v-tabs.py-3(centered, v-model="currentTab")
        v-tab Chart
        v-tab Text
      v-tabs-items(v-model="currentTab")
        v-tab-item
          LineChart(:data="funnelData", :steps="steps")
        v-tab-item 
          .text-left
            div(v-for="i in steps.length") <b>{{ steps[i - 1] }}:</b> {{ funnelData[i - 1] }}
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
import EditFunnel from "@/components/EditFunnel.vue";

const SnackbarStore = namespace("SnackbarStore");

@Component({
  components: {
    LineChart,
    EditFunnel
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
  currentTab = null;

  async mounted(): Promise<void> {
    const startOfWeek = moment().startOf("week");
    const endOfWeek = moment().endOf("week");
    this.dates = [
      startOfWeek.format("YYYY-MM-DD"),
      endOfWeek.format("YYYY-MM-DD")
    ];
    this.loading = true;
    this.listPlatforms = await distinctPlatforms();
    this.listPlatforms.push("all");
    this.currentPlatform = "all";
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
    const confirmed = await this.$confirm(
      "Do you really want to delete this funnel?",
      {
        title: "Delete funnel",
        buttonTrueColor: "red"
      }
    );
    if (confirmed) {
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
}
</script>