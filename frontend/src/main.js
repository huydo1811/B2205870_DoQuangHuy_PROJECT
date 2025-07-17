import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import GoogleLoginPlugin from 'vue3-google-login';

const app = createApp(App);

app.use(router);
app.use(GoogleLoginPlugin, {
  clientId: '939712010682-0186jdr3kdata70rvo9vsi6tkodq4oqh.apps.googleusercontent.com',
  flow: 'auth-code'
});

app.mount('#app');
