<template lang="pug">
v-app
  Snackbar
  section
    Aside(v-if="logged")
    v-main(tag="main")
      v-container(fluid)
        router-view
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { namespace } from "vuex-class";
import { AuthService } from "./services/auth.service";

import Snackbar from "@/components/Snackbar.vue";
import Aside from "@/components/Aside.vue";

const UserStore = namespace("UserStore");
const authService = new AuthService();

@Component({
  components: {
    Aside,
    Snackbar
  }
})
export default class App extends Vue {
  @UserStore.State logged!: boolean;
  @UserStore.State token!: string;
  @UserStore.Mutation login!: () => void;
  @UserStore.Mutation logout!: () => void;

  searchText = "";

  async mounted(): Promise<void> {
    try {
      if (!(await authService.checkToken(this.token))) {
        this.logout();
      }
    } catch (error) {
      this.logout();
    }
  }
}
</script>
