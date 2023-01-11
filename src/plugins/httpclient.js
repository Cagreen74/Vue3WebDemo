import axios from 'axios'
import { vueStore } from '../plugins/store.js'

/* eslint-disable no-debugger */
const Env = {
  Prod: 'https://api.dei-inclusology.io/api',
  Local: 'https://localhost:7058/api'
}


const instance = new axios.create({
  baseURL: Env.Local,
  headers: {
    'X-Frame-Options': 'ALLOWALL',
    'Content-Type': 'application/json'
  }
});

instance.interceptors.request.use(
  config => {
    config.headers['Authorization'] = 'Bearer ' + vueStore.user.token;
    return config;
  }
);


//instance.interceptors.response.use(response => {
//  return response;
//},
//  error => {
//    if (error.response.status === 401) {
//      store.commit('RevokeToken');
//      router.push("/Login")
//    }
//    return Promise.reject(error)
//  }
//);

export default instance