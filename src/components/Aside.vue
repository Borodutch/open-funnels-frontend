<template lang="pug">
v-navigation-drawer(app, dark, tag="aside", color="blue-grey")
  v-list-item
    v-list-item-content
      v-list-item-title.title Open funnels
      v-list-item-subtitle(v-if="loading") Loading DB status...
      v-list-item-subtitle(v-else) {{ dbStatus ? '✅ Connected to database' : '❌ Database error' }}
  v-divider
  v-list(dense, nav)
    v-list-item(link, to="/")
      v-list-item-icon
        v-icon mdi-view-dashboard
      v-list-item-content
        v-list-item-title Dashboard
    AddFunnel
  v-divider
  v-list(dense, nav)
    v-list-item(link, @click="logoutUser")
      v-list-item-icon
        v-icon mdi-logout
      v-list-item-content
        v-list-item-title Logout
</template>

<script lang="ts">
import { isDbOk } from "@/services/api.service";
import Vue from "vue";
import Component from "vue-class-component";
import { namespace } from "vuex-class";
import AddFunnel from "@/components/AddFunnel.vue";

const UserStore = namespace("UserStore");

@Component({
  components: {
    AddFunnel
  }
})
export default class Aside extends Vue {
  @UserStore.Mutation logout!: () => void;

  dbStatus = false;
  loading = true;

  async mounted(): Promise<void> {
    this.loading = true;
    this.dbStatus = await isDbOk();
    this.loading = false;
  }

  logoutUser(): void {
    this.logout();
    this.$router.push("login");
  }
}
</script>
