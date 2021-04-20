<template lang="pug">
v-snackbar(v-model="visible", center, top, text, color="red", timeout=4000) {{ snackbarText }}
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { namespace } from "vuex-class";

const SnackbarStore = namespace("SnackbarStore");

@Component
export default class Snackbar extends Vue {
  @SnackbarStore.State snackbarVisible!: boolean;
  @SnackbarStore.State snackbarText!: string;
  @SnackbarStore.Mutation setVisible!: (show: boolean) => void;

  get visible(): boolean {
    return this.snackbarVisible;
  }

  set visible(show: boolean) {
    this.setVisible(show);
  }
}
</script>