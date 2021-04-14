<template lang="pug">
v-app
  v-navigation-drawer(app, permanent, tag="aside")
    v-list-item
      v-list-item-content
        v-list-item-title.title Funnels
        v-list-item-subtitle alpha version
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

@Component
export default class App extends Vue {
  items = [
    { title: "Dashboard", icon: "mdi-view-dashboard", to: "/" },
    { title: "Add funnel", icon: "mdi-plus", to: "/#new" }
  ];
}
</script>
