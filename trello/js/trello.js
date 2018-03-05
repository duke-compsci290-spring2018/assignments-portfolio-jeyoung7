/*
 *  TRELLLLLOOOOOO
 *
 * @author Jacob Young
 */

var store = {
    state: {
        todos: [],
        inProgress: [],
        complete: [],
        users: [],
        addNew:false,
    }

}
// visibility filters
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

// Define custom filter to correctly pluralize the word
Vue.filter('pluralize', function (n) {
    return n === 1 ? 'item' : 'items';
});



// app Vue instance
var todoApp = new Vue({
    // app initial state
    data: {
        todos: store.state.todos,
        newTodo: '',
        visibility: 'all',
        addNew: false,
        showModal: false,
        task: {
            name: '',
            about: '',
        }

    },

    computed: {
        // return todos that match the currently selected filter
        filteredTodos () {
            return filters[this.visibility](this.todos);
        },

        // return count of the remaining active todo items
        remaining () {
            return filters.active(this.todos).length;
        }
    },

    methods: {
        // change current filter to the given value
        setFilter (filter) {
            this.visibility = filter;
        },
        checkboxToggle(todo) {
            store.state.inProgress.push(todo);
            this.removeTodo(todo);
        },
        // add newly entered todo item if it exists and clear it to prepare for the next one
        addTodo () {
            this.newTodo = this.newTodo.trim();
            if (this.newTodo) {
                this.todos.push({
                    title: this.newTodo,
                    completed: false,

                })
                // text input displays this value, so clear it to indicate ready to type a new one
                this.newTodo = '';
            }
        },

        // remove given todo from the list
        removeTodo (todo) {
            this.todos.splice(this.todos.indexOf(todo), 1)
        },

        // remove all completed todos from the list
        removeCompleted () {
            this.todos = filters.active(this.todos)
        }
    }
})
var inProgressApp = new Vue({
    // app initial state
    data: {
        todos: store.state.inProgress,
        newTodo: '',
        visibility: 'all',
        showModal: false,
    },

    computed: {
        // return todos that match the currently selected filter
        filteredTodos () {
            return filters[this.visibility](this.todos);
        },

        // return count of the remaining active todo items
        remaining () {
            return filters.active(this.todos).length;
        }
    },

    methods: {
        // change current filter to the given value
        setFilter (filter) {
            this.visibility = filter;
        },
        checkboxToggle(todo) {
            store.state.complete.push(todo);
            this.removeTodo(todo);
        },
        // add newly entered todo item if it exists and clear it to prepare for the next one
        addTodo () {
            this.newTodo = this.newTodo.trim();
            if (this.newTodo) {
                this.todos.push({
                    title: this.newTodo,
                    completed: false
                })
                // text input displays this value, so clear it to indicate ready to type a new one
                this.newTodo = '';
            }
        },

        // remove given todo from the list
        removeTodo (todo) {
            this.todos.splice(this.todos.indexOf(todo), 1)
        },

        // remove all completed todos from the list
        removeCompleted () {
            this.todos = filters.active(this.todos)
        }
    }
})
var completedApp = new Vue({
    // app initial state
    data: {
        todos: store.state.complete,
        newTodo: '',
        visibility: 'all',
        showModal: false,
    },

    computed: {
        // return todos that match the currently selected filter
        filteredTodos () {
            return filters[this.visibility](this.todos);
        },

        // return count of the remaining active todo items
        remaining () {
            return filters.active(this.todos).length;
        }
    },

    methods: {
        // change current filter to the given value
        setFilter (filter) {
            this.visibility = filter;
        },

        // add newly entered todo item if it exists and clear it to prepare for the next one
        addTodo () {
            this.newTodo = this.newTodo.trim();
            if (this.newTodo) {
                this.todos.push({
                    title: this.newTodo,
                    completed: false
                })
                // text input displays this value, so clear it to indicate ready to type a new one
                this.newTodo = '';
            }
        },

        // remove given todo from the list
        removeTodo (todo) {
            this.todos.splice(this.todos.indexOf(todo), 1)
        },

        // remove all completed todos from the list
        removeCompleted () {
            this.todos = filters.active(this.todos)
        }
    }
})

new Vue({
    el: ".form",

    data: {
        form : {
            name: '',
            email: '',
        },
    },
    methods: {
        addUser: function(event) {
            console.log(this.form.name);
            var user = {};
            user.name=this.form.name;
            user.email=this.form.email;
            store.state.users.push(user);
            this.form.name = "";
            this.form.email = "";
            this.printUsers();
        },
        printUsers() {
            for (var i = 0; i < store.state.users.length; i++)
            {
                console.log(store.state.users[i].name);
            }
        }
    }
});

new Vue({
    el: "#users",

    data: {
        users: store.state.users
    },
    methods: {

        printUsers() {
            for (var i = 0; i < store.state.users.length; i++)
            {
                console.log(store.state.users[i].name);
            }
        }
    }
});
/*

ADDING A NEW TASK
 */
new Vue({
    el: "#newTask",

    data: {
        task : {
            name: '',
            about: '',
        },
    },
    methods: {
        addTask: function(event) {
            console.log(this.task.name);
            var task = {};
            task.name=this.task.name;
            task.email=this.task.about;
            store.state.todos.push(task);
            $emit('close');
        },
        printUsers() {
            for (var i = 0; i < store.state.users.length; i++)
            {
                console.log(store.state.users[i].name);
            }
        }
    }
});


Vue.component('modal', {
    template: '#modal-template',
    props: ['show','who'],
    data: function () {
        return {
            title: '',
            about: ''
        };
    },
    methods: {
        close: function () {
            this.$emit('close');
            this.title = '';
            this.about = '';

        },
        savePost: function () {

            console.log(this.title);
            console.log(this.who)
            if (this.who === "three") {
                store.state.complete.push({
                    title: this.title,
                    about: this.about,
                    id: store.state.todos.length+store.state.inProgress.length+store.state.complete.length,
                    seen: false,

                });
            }
            if (this.who === "two") {
                store.state.inProgress.push({
                    title: this.title,
                    about: this.about,
                    id: store.state.todos.length+store.state.inProgress.length+store.state.complete.length,
                    seen: false,

                });
            }
            if (this.who === "one") {
                store.state.todos.push({
                    title: this.title,
                    about: this.about,
                    id: store.state.todos.length+store.state.inProgress.length+store.state.complete.length,
                    seen: false,
                });
            }
            console.log(store.state.todos);
            this.close();
        }
    },
});

// mount
todoApp.$mount('#todo');
inProgressApp.$mount('#inprogress');
completedApp.$mount('#complete');

