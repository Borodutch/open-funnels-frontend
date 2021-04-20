import { VuexModule, Module, Mutation } from 'vuex-module-decorators';

@Module({ namespaced: true, name: 'SnackbarStore' })
export class SnackbarStore extends VuexModule {
  snackbarVisible = false;
  snackbarText = '';

  @Mutation
  showSnackbar(text: string): void {
    this.snackbarVisible = true;
    this.snackbarText = text;
  }

  @Mutation
  setVisible(show: boolean): void {
    this.snackbarVisible = show;
  }
}
