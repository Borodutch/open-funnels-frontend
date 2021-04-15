<template lang="pug">
v-dialog(v-model="dialog", width="400")
  template(v-slot:activator="{ on, attrs }")
    v-list-item(link, v-bind="atts", v-on="on")
      v-list-item-icon
        v-icon mdi-plus
      v-list-item-content
        v-list-item-title Add funnel
  v-progress-circular(v-if="loading")
  v-card(v-else)
    v-toolbar(flat)
      v-btn(icon, @click="dialog = false")
        v-icon mdi-close
      v-toolbar-title Add funnel
      v-spacer
      v-toolbar-items
        v-btn(text, color="green") Add step
    .px-5.pb-5
      v-text-field(label="Funnel name")
      v-text-field(label="Funnel description")
      v-select(:items="namesList", label="Step 1")
    v-card-actions
      v-spacer
      v-btn(text, color="primary") save
</template>

<script lang="ts">
import { distinctNames } from "@/services/api.service";
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class AddFunnel extends Vue {
  dialog = false;
  namesList: string[] = [];
  loading = false;

  async mounted(): Promise<void> {
    this.loading = true;
    this.namesList = await distinctNames();
    this.loading = false;
  }
}
</script>
