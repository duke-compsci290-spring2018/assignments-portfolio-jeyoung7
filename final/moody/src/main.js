// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import firebase from 'firebase'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


Vue.use(BootstrapVue);

Vue.config.productionTip = false
let app;
let config = {
    apiKey: "AIzaSyD161dPAI_b742rQe__nXH5DdDcB_k9T5o",
    authDomain: "moody-ffd08.firebaseapp.com",
    databaseURL: "https://moody-ffd08.firebaseio.com",
    projectId: "moody-ffd08",
    storageBucket: "moody-ffd08.appspot.com",
    messagingSenderId: "41821573502"
  };
firebase.initializeApp(config);
firebase.auth().onAuthStateChanged(function(user) {
/* eslint-disable no-new */
if (!app) {
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
}

});
