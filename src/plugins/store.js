import { defineStore } from 'pinia'
/* eslint-disable no-debugger */
export const vueStore = defineStore('UserInfo', {
  state: () => ({
    userInfo: {
      isAuthenticated: false,
      token: '',
      userName: '',
      organizationId: '',
      role: '',
      homepage: null,
      firstName: null, 
      lastName: null
    }
  }),
  getters: {
    user: (state) => { return (state.userInfo) }
  },
  actions: {
    RevokeToken() {
      this.$state.userInfo.token = null;
      this.$state.userInfo.userName = null;
      this.$state.userInfo.isAuthenticated = false;
      this.$state.userInfo.role = null;
      this.$state.userInfo.homepage = null;
      this.$state.userInfo.firstName = null;
      this.$state.userInfo.lastName = null;
    },
    SetAuth(payload) {
      this.$state.userInfo.token = payload.token;
      this.$state.userInfo.isAuthenticated = true;
      this.$state.userInfo.userName = payload.userName;
      this.$state.userInfo.role = payload.role;
      this.$state.userInfo.firstName = payload.firstName;
      this.$state.userInfo.lastName = payload.lastName;

      var dashboardPage = "/AdminDashboard";

      if (payload.role == "STD") {
        dashboardPage = "/UserDashboard"
      }
      this.$state.userInfo.homepage = dashboardPage;
    }
  }
  
})