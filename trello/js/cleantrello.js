var todoList = [
    {
        title: 'Download code',
        completed: false,
        about: "hello",
        id: 1,
        seen: false,

    },
    {
        title: 'Study code',
        completed: false,
        about: "hello",
        id: 1,
        seen: false,

    },
    {
        title: 'Finish code',
        completed: false,
        about: "hello",
        id: 1,
        seen: false,

    }
];
var todoList2 = [
    {
        title: 'Download code',
        completed: false,
        about: "hello",
        id: 1,
        seen: false,
    },
    {
        title: 'Study code',
        completed: false,
        about: "hello",
        id: 1,
        seen: false,

    },
    {
        title: 'Finish code',
        completed: false,
        about: "hello",
        id: 1,
        seen: false,

    }
];

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
var lsts =[];
fireLists.once('value',function(snap) {
    snap.forEach(function(item) {
        var itemVal = item.val();
        lsts.push(itemVal);
    });

});
Vue.use(VueFire);
console.log(lsts);
var store = {
    state: {
        lists: fireLists



    }

}

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
todoList.title ="One";
todoList2.title ="Two";

todoList2.edit =false;


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
    data() {
        return {
            lists: lsts,
            newTodo: '',
            visibility: 'all',
            showModal: false,
            users: users,
            currentIndex: 0,
            currentText: '',
        }
    },
    computed: {
        // return todos that match the currently selected filter


        // return count of the remaining active todo items
       /* remaining (list) {
            return filters.active(this.lists.list).length;
        }*/
    },
    methods: {

        //frlass lecture
        changeBackground: function (event) {
            document.body.style.backgroundColor = event.target.value;
        },
        setFilter(filter) {
            this.visibility = filter;
        },
        addList: function () {
         newList = [];
         newList.title = this.currentText;
         this.lists.push(newList);
         fireLists.push(newList);
        this.currentText='';
        },
        // add newly entered todo item if it exists and clear it to prepare for the next one
        addTodo(list) {
            this.newTodo = this.newTodo.trim();
            console.log(list['.key']);
            if (this.newTodo) {
                this.list.push({
                    title: this.newTodo,
                    completed: false
                });
                fireLists.ref(list.key).push({ title: this.newTodo,
                    completed: false});
                // text input displays this value, so clear it to indicate ready to type a new one
                this.newTodo = '';


            }
        },


        // remove given todo from the list
        removeTodo(list,todo) {
            console.log(list);
            console.log(todo);
            list.splice(list.indexOf(todo), 1)
        },
        deleteList(list){

            console.log(list);
            this.lists.splice(this.lists.indexOf(list), 1)

        },
        // remove all completed todos from the list

        mounted() {
            console.log(this.$el);
        }
    }


});
Vue.component('modal', {
    template: '#modal-template',
    props: ['show','index'],
    data: function () {
        return {
            title: '',
            about: '',
            selected: '',

            users: users
        };
    },
    methods: {
        close: function () {
            this.$emit('close');
            this.title = '';
            this.about = '';

        },
        savePost: function () {
            console.log(this.index);
            //this.list.push({title: this.title, about: this.about, completed: false, seen: false, assigned: this.selected });

            //fireLists.ref(list).push({title: this.title, about: this.about, completed: false, seen: false, assigned: this.selected });

            this.close();

        }
    },
});

// attach Vue apps to existing DOM elements
App.$mount('#app');