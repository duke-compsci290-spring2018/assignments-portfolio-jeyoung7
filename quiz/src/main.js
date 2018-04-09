// only need to import bootstrap here for all components to have access to it
// import site specific global styles AFTER bootstrap

import Vue from 'vue'
import QuizMain from './QuizMain.vue'
// turn off the console note about switching to production mode
Vue.config.productionTip = false

// explicit installation required in module environments

// simply creating the Vue instance does all the necessary set up, so no need to name it
new Vue({
    // HTML element to attach Vue app
    el: '#app',
    // components (HTML, CSS, and JS) used by this app
    components: {
        quiz_main: QuizMain
    },
    // simply render the app component as this app
    template: '<quiz_main/>'
})