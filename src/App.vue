<template lang="pug">
v-app(v-if="!logged")
  Login
v-app(v-else)
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
      v-list-item(link, @click="logout")
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
import { namespace } from "vuex-class";
import { isDbOk } from "./helpers/api.helper";
import Login from "@/components/Login.vue";
import { AuthService } from "./services/auth.service";

const UserStore = namespace("UserStore");
const authService = new AuthService();

@Component({
  components: {
    Login
  }
})
export default class App extends Vue {
  @UserStore.State logged!: boolean;
  @UserStore.State token!: string;
  @UserStore.Mutation login!: () => void;
  @UserStore.Mutation logout!: () => void;

  dbStatus = false;
  loading = true;
  searchText = "";

  items = [
    { title: "Dashboard", icon: "mdi-view-dashboard", to: "/" },
    { title: "Add funnel", icon: "mdi-plus", to: "/#new" }
  ];

  async mounted(): Promise<void> {
    if (!(await authService.checkToken(this.token))) {
      this.logout();
      alert("Token invalid or expired.");
    }
    this.loading = true;
    this.dbStatus = await isDbOk();
    this.loading = false;
  }
}
</script>
