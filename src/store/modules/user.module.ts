import { VuexModule, Module, Mutation } from 'vuex-module-decorators';

@Module({ namespaced: true, name: 'UserStore' })
export class UserStore extends VuexModule {
  token?: string;
  logged?: boolean;

  @Mutation
  setToken(token: string): void {
    this.token = token;
    this.logged = true;
  }

  @Mutation
  logout(): void {
    this.token = '';
    this.logged = false;
  }
}
