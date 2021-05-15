<template lang="pug">
.d-flex.justify-center.pt-10
  v-card(style="min-width: 300px")
    v-card-title Open funnels dashboard
    v-card-text
      v-progress-linear(v-if="loading", indeterminate)
      template(v-else)
        div(style="text-align: center")
          img(src="@/assets/logo.png")
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
        v-btn(
          large,
          color="primary",
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

  async login(): Promise<void> {
    try {
      this.loading = true;
      const token = await authService.login({
        login: this.inputLogin,
        password: this.inputPassword
      });
      this.setToken(token.access_token);
      this.$router.push("/");
    } catch (error) {
      this.showSnackbar(error);
    } finally {
      this.loading = false;
    }
  }
}
</script>