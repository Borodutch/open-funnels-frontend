<template lang="pug">
v-navigation-drawer(app, permanent, tag="aside")
  v-list-item
    v-list-item-content
      v-list-item-title.title Open funnels
      v-list-item-subtitle(v-if="loading") Loading DB status...
      v-list-item-subtitle(v-else) {{ dbStatus ? 'Connected to database' : 'Database error' }}
  v-divider
  v-list(dense, nav)
    v-list-item(link, to="/")
      v-list-item-icon
        v-icon mdi-view-dashboard
      v-list-item-content
        v-list-item-title Dashboard
    v-list-item(link)
      v-list-item-icon
        v-icon mdi-plus
      v-list-item-content
        v-list-item-title Add funnel
  v-divider
  v-list(dense, nav)
    v-list-item(link, @click="logout")
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

const UserStore = namespace("UserStore");

@Component
export default class Aside extends Vue {
  @UserStore.Mutation logout!: () => void;

  dbStatus = false;
  loading = true;

  async mounted(): Promise<void> {
    this.loading = true;
    this.dbStatus = await isDbOk();
    this.loading = false;
  }
}
</script>
