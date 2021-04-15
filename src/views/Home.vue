<template lang="pug">
section
  v-text-field(
    filled,
    dense,
    v-model="searchText",
    rounded,
    prepend-inner-icon="mdi-magnify",
    label="Fast search..."
  )
  v-row
    v-col(v-if="loading", cols="6")
      v-progress-circular(indeterminate)
    v-col(
      v-else,
      v-for="funnel in filteredFunnels",
      :key="funnel.name",
      cols="6"
    )
      FunnelCard(
        :id="funnel._id",
        :name="funnel.name",
        :description="funnel.description",
        :steps="funnel.steps"
      )
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import FunnelCard from "@/components/FunnelCard.vue";
import { getFunnels } from "@/services/api.service";
import { Funnel } from "@/interfaces/Funnel.interface";

@Component({
  components: {
    FunnelCard
  }
})
export default class Home extends Vue {
  funnels: Funnel[] = [];
  loading = true;
  searchText = "";

  async mounted(): Promise<void> {
    this.loading = true;
    this.funnels = await getFunnels();
    this.loading = false;
  }

  get filteredFunnels(): Funnel[] {
    return this.funnels.filter(funnel =>
      funnel.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
}
</script>
