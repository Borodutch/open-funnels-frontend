<template lang="pug">
v-dialog(v-model="dialog", max-width="600", persistent, scrollable)
  template(v-slot:activator="{ on, attrs }")
    v-list-item(link, v-bind="atts", v-on="on")
      v-list-item-icon
        v-icon mdi-filter-plus
      v-list-item-content
        v-list-item-title New funnel
  v-card
    v-toolbar(flat)
      v-btn(icon, @click="closePopup()")
        v-icon mdi-close
      v-toolbar-title Add funnel
    v-card-text.add-funnel-content
      v-progress-linear(v-if="loading", indeterminate)
      template(v-else)
        v-text-field(filled, label="Name", v-model="funnelName")
        v-text-field(filled, label="Description", v-model="funnelDescription")
        v-autocomplete(
          outlined,
          :label="`Step ${index + 1}`",
          v-for="(step, index) in funnelSteps",
          :items="namesList",
          v-model="step.name",
          :key="index",
          prepend-inner-icon="mdi-filter"
        )
    v-card-actions(v-if="!loading")
      v-btn(
        icon,
        large,
        color="red",
        @click="removeStep",
        :disabled="funnelSteps.length === 1"
      )
        v-icon mdi-minus
      v-btn(icon, color="green", @click="addStep", large)
        v-icon mdi-plus
      v-spacer
      v-btn(
        text,
        color="primary",
        :disabled="!funnelName",
        @click="newFunnel",
        large
      ) Save
</template>

<script lang="ts">
import { addFunnel, distinctNames } from "@/services/api.service";
import Vue from "vue";
import Component from "vue-class-component";
import { namespace } from "vuex-class";

const SnackbarStore = namespace("SnackbarStore");

@Component
export default class AddFunnel extends Vue {
  @SnackbarStore.Mutation showSnackbar!: (text: string) => void;

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

  async closePopup(): Promise<void> {
    const confirmed = await this.$confirm(
      "Do you really want to cancel creation?",
      {
        title: "Close popup",
        buttonTrueColor: "red"
      }
    );
    if (confirmed) {
      this.dialog = false;
    }
  }

  addStep(): void {
    this.funnelSteps.push({ name: this.namesList[0] });
    const content = document.getElementsByClassName("add-funnel-content")[0];
    content.scrollTop = content.scrollHeight;
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
    try {
      await addFunnel(this.funnelName, this.funnelDescription, rawSteps);
      window.location.reload();
    } catch (error) {
      this.showSnackbar(error);
      this.loading = false;
    }
  }
}
</script>
