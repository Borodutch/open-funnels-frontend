<template lang="pug">
v-main(tag="main")
  v-container
    .d-flex.justify-center.pt-10
      v-card(style="min-width: 300px", flat)
        v-card-title Open funnels dashboard
        v-card-subtitle Admin account required
        v-card-text 
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
            color="primary",
            @click="login",
            :disabled="!inputPassword || !inputLogin"
          ) Login
</template>

<script lang="ts">
import { AuthService } from "@/services/auth.service";
import { Vue, Component } from "vue-property-decorator";
import { namespace } from "vuex-class";

const UserStore = namespace("UserStore");
const authService = new AuthService();

@Component
export default class Login extends Vue {
  @UserStore.Mutation setToken!: (token: string) => Promise<void>;
  @UserStore.State token!: string;

  inputLogin = "";
  inputPassword = "";

  async login(): Promise<void> {
    try {
      const token = await authService.login({
        login: this.inputLogin,
        password: this.inputPassword
      });
      this.setToken(token.access_token);
    } catch (error) {
      alert(error);
    }
  }
}
</script>