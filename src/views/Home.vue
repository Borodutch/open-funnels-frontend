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
    v-col(v-if="loading", cols="6")
      v-progress-circular(indeterminate)
    v-col(v-else, v-for="funnel in funnels", :key="funnel.name", cols="6")
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
import { getFunnels } from "@/helpers/api.helper";
import { Funnel } from "@/interfaces/Funnel.interface";

@Component({
  components: {
    FunnelCard
  }
})
export default class Home extends Vue {
  funnels: Funnel[] = [];
  loading = true;

  async mounted(): Promise<void> {
    this.loading = true;
    this.funnels = await getFunnels();
    this.loading = false;
  }
}
</script>
