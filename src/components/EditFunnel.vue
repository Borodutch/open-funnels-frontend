<template lang="pug">
v-dialog(v-model="dialog", max-width="600", persistent, scrollable)
  template(v-slot:activator="{ on, attrs }")
    v-btn(
      text,
      color="primary lighten-1",
      v-bind="atts",
      v-on="on",
      :loading="cardLoading",
      @click="editFunnel"
    ) Edit
  v-card
    v-toolbar(flat)
      v-btn(icon, @click="closePopup()")
        v-icon mdi-close
      v-toolbar-title Edit funnel
    v-card-text.add-funnel-content
      v-progress-linear(v-if="loading", indeterminate)
      template(v-else)
        v-row
          v-col(cols=6)
            v-text-field(filled, label="Title", v-model="funnelName")
          v-col(cols=6)
            v-text-field(
              filled,
              label="Description",
              v-model="funnelDescription"
            )
        draggable(v-model="funnelSteps")
          .d-flex.flex-row.align-start(v-for="(step, index) in funnelSteps")
            v-icon.pt-2.pr-2(style="cursor: row-resize") mdi-menu
            v-autocomplete(
              dense,
              outlined,
              :label="`Step ${index + 1}`",
              :items="namesList",
              v-model="step.name",
              :key="index",
              prepend-inner-icon="mdi-filter"
            )
            v-btn.ml-2.mt-1(
              icon,
              color="red",
              @click="popStep(index)",
              :disabled="funnelSteps.length === 1"
            )
              v-icon mdi-close
    v-card-actions(v-if="!loading")
      v-btn(color="green", @click="addStep", large, text) Add step
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
import { distinctNames, updateFunnel } from "@/services/api.service";
import Vue from "vue";
import Component from "vue-class-component";
import { namespace } from "vuex-class";
import draggable from "vuedraggable";
import { Prop } from "vue-property-decorator";
import { Funnel } from "@/interfaces/Funnel.interface";

const SnackbarStore = namespace("SnackbarStore");

@Component({
  components: {
    draggable
  }
})
export default class EditFunnel extends Vue {
  @SnackbarStore.Mutation showSnackbar!: (text: string) => void;
  @Prop() cardLoading!: boolean;
  @Prop() funnel!: Funnel;

  dialog = false;
  namesList: string[] = [];
  loading = false;

  atts = "";
  funnelName = "";
  funnelDescription = "";
  funnelSteps: { name: string }[] = [];

  async mounted(): Promise<void> {
    this.loading = true;
    this.funnelName = this.funnel.name;
    this.funnelDescription = this.funnel.description;
    this.namesList = await distinctNames();
    this.funnel.steps.map((step: string) => {
      this.funnelSteps.push({ name: step });
    });
    this.loading = false;
  }

  async closePopup(): Promise<void> {
    const confirmed = await this.$confirm(
      "Do you really want to discard unpublished changes?",
      {
        title: "Discard changes"
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

  popStep(index: number): void {
    this.funnelSteps.splice(index, 1);
  }

  async newFunnel(): Promise<void> {
    this.loading = true;
    let rawSteps: string[] = [];
    this.funnelSteps.map(step => {
      rawSteps.push(step.name);
    });
    try {
      await updateFunnel({
        _id: this.funnel._id,
        name: this.funnelName,
        description: this.funnelDescription,
        steps: rawSteps
      });
      window.location.reload();
    } catch (error) {
      this.showSnackbar(error);
      this.loading = false;
    }
  }
}
</script>
