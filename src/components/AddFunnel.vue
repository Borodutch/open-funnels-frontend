<template lang="pug">
v-dialog(v-model="dialog", width="400")
  template(v-slot:activator="{ on, attrs }")
    v-list-item(link, v-bind="atts", v-on="on")
      v-list-item-icon
        v-icon mdi-plus
      v-list-item-content
        v-list-item-title Add funnel
  v-card
    v-toolbar(flat)
      v-btn(icon, @click="dialog = false")
        v-icon mdi-close
      v-toolbar-title Add funnel
    .px-5.pb-5
      v-progress-linear(v-if="loading", indeterminate)
      template(v-else)
        v-text-field(label="Name", v-model="funnelName")
        v-text-field(label="Description", v-model="funnelDescription")
        v-select(
          v-for="step in funnelSteps",
          :items="namesList",
          v-model="step.name",
          :key="step.name"
        )
    v-card-actions(v-if="!loading")
      v-spacer
      v-btn(
        icon,
        color="red",
        @click="removeStep",
        :disabled="funnelSteps.length === 1"
      )
        v-icon mdi-minus
      v-btn(icon, color="green", @click="addStep")
        v-icon mdi-plus
      v-btn(text, color="primary", :disabled="!funnelName", @click="newFunnel") Save
</template>

<script lang="ts">
import { addFunnel, distinctNames } from "@/services/api.service";
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class AddFunnel extends Vue {
  dialog = false;
  namesList: string[] = [];
  loading = false;

  atts = "";
  funnelName = "";
  funnelDescription = "";
  funnelSteps: { name: string }[] = [];

  async mounted(): Promise<void> {
    this.loading = true;
    this.namesList = await distinctNames();
    this.funnelSteps.push({ name: this.namesList[0] });
    this.loading = false;
  }

  addStep(): void {
    this.funnelSteps.push({ name: this.namesList[0] });
  }

  removeStep(): void {
    if (this.funnelSteps.length > 1) this.funnelSteps.pop();
  }

  async newFunnel(): Promise<void> {
    this.loading = true;
    let rawSteps: string[] = [];
    this.funnelSteps.map(step => {
      rawSteps.push(step.name);
    });
    await addFunnel(this.funnelName, this.funnelDescription, rawSteps);
    window.location.reload();
  }
}
</script>
