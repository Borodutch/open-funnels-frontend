<template lang="pug">
v-main(tag="main")
  v-container
    .d-flex.justify-center.pt-10
      v-card(style="min-width: 300px", flat, dark, color="blue-grey")
        v-card-title Open funnels dashboard
        v-card-subtitle(v-if="error") {{ error }}
        v-progress-linear(v-if="loading", indeterminate)
        v-card-text(v-else)
          v-text-field.pt-5(
            outlined,
            v-model="inputLogin",
            label="Username",
            prepend-inner-icon="mdi-account"
          )
          v-text-field(
            outlined,
            v-model="inputPassword",
            type="password",
            label="Password",
            prepend-inner-icon="mdi-lock"
          )
        v-card-actions
          v-btn(
            large,
            depressed,
            block,
            @click="login",
            :disabled="!inputPassword || !inputLogin"
          ) Login
</template>

<script lang="ts">
import { AuthService } from "@/services/auth.service";
import { Vue, Component } from "vue-property-decorator";
import { namespace } from "vuex-class";

const UserStore = namespace("UserStore");
const SnackbarStore = namespace("SnackbarStore");

const authService = new AuthService();

@Component
export default class Login extends Vue {
  @UserStore.Mutation setToken!: (token: string) => Promise<void>;
  @UserStore.State token!: string;
  @SnackbarStore.Mutation showSnackbar!: (text: string) => void;

  inputLogin = "";
  inputPassword = "";
  loading = false;
  error = "";

  async login(): Promise<void> {
    try {
      this.loading = true;
      const token = await authService.login({
        login: this.inputLogin,
        password: this.inputPassword
      });
      this.setToken(token.access_token);
      window.location.reload();
    } catch (error) {
      this.showSnackbar(error);
    } finally {
      this.loading = false;
    }
  }
}
</script>