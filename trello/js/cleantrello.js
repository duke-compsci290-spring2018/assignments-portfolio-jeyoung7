var config = {
    apiKey: "AIzaSyABq904mMuJqgVB-9spHtkMhGW2Cf-Wz7E",
    authDomain: "my-website-3e3ca.firebaseapp.com",
    databaseURL: "https://my-website-3e3ca.firebaseio.com",
    projectId: "my-website-3e3ca",
    storageBucket: "my-website-3e3ca.appspot.com",
    messagingSenderId: "260939014953"
};

var db = firebase.initializeApp(config).database();
var fireLists = db.ref('lists');

Vue.use(VueFire);


var users = [
    {
        name: 'jacob young',
        completed: false,
        about: "hello",
        id: 1,
        seen: false,
    },
    {
        name: 'pablo code',
        completed: false,
        about: "hello",
        id: 1,
        seen: false,

    },
];

var filters = {
    all: function (todos) {
        return todos;
    },
    active: function (todos) {
        return todos.filter(todo => !todo.completed);
    },
    completed: function (todos) {
        return todos.filter(todo => todo.completed);
    }
}
var App = new Vue({
    data: {
        newTodo: '',
        visibility: 'all',
        showModal: false,
        users: users,
        currentIndex: 0,
        currentText: '',

    },
    firebase: {
        lists: fireLists,
    },
    computed: {
        // return todos that match the currently selected filter


        // return count of the remaining active todo items
        /* remaining (list) {
             return filters.active(this.lists.list).length;
         }*/
    },
    methods: {

        //class lecture easy way to change backgroundcolor
        changeBackground: function (event) {
            document.body.style.backgroundColor = event.target.value;
        },
        setFilter(filter) {
            this.visibility = filter;
        },
        addList: function () {
            newList = [];
            newList.title = this.currentText;
            newList.selected = false;
            fireLists.push(newList);

            this.currentText = '';
        },
        checkboxToggle(list,key) {
            if
            fireLists.child(list['.key']).child('todos').child(key).remove();

        },
        // remove given todo from the list
        removeTodo(list, key) {
            fireLists.child(list['.key']).child('todos').child(key).remove();
        },
        deleteList(list) {
            fireLists.child(list['.key']).remove();
        },

        mounted() {
            console.log(this.$el);
        }
    }


});
Vue.component('modal', {
    template: '#modal-template',
    props: ['show', 'index', 'list'],
    data: () => {
        return {
            title: '',
            about: '',
            selected: false,
            users: users
        };
    },
    methods: {
        close: function () {
            this.$emit('close');
            this.title = '';
            this.about = '';
            this.selected = '';

        },
        savePost: function () {
            console.log(this.index);
            console.log(this.list);

            fireLists.child(this.list['.key']).child('todos').push({
                title: this.title,
                about: this.about,
                selected: this.selected,
                completed: false,
                seen: false,
            })
            this.close();

        }
    },
});

// attach Vue apps to existing DOM elements
App.$mount('#app');