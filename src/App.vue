<template lang="pug">
v-app
  v-navigation-drawer(app, permanent, tag="aside")
    v-list-item
      v-list-item-content
        v-list-item-title.title Open funnels
        v-list-item-subtitle(v-if="loading") Loading DB status...
        v-list-item-subtitle(v-else) {{ dbStatus ? 'Connected to database' : 'Database error' }}
    v-divider
    v-list(dense, nav)
      v-list-item(
        v-for="item in items",
        :key="item.title",
        link,
        :to="item.to"
      )
        v-list-item-icon
          v-icon {{ item.icon }}
        v-list-item-content
          v-list-item-title {{ item.title }}
    v-divider
    v-list(dense, nav)
      v-list-item(link)
        v-list-item-icon
          v-icon mdi-logout
        v-list-item-content
          v-list-item-title Logout
  v-main(tag="main")
    v-container(fluid)
      router-view
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { isDbOk } from "./helpers/api.helper";

@Component
export default class App extends Vue {
  dbStatus = false;
  loading = true;

  items = [
    { title: "Dashboard", icon: "mdi-view-dashboard", to: "/" },
    { title: "Add funnel", icon: "mdi-plus", to: "/#new" }
  ];

  async mounted(): Promise<void> {
    this.loading = true;
    this.dbStatus = await isDbOk();
    this.loading = false;
  }
}
</script>
