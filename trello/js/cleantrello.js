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
var userList = db.ref('Users');
var categoryList = db.ref('categories');
var storageRef = firebase.storage().ref(); //storage @DUVALL

Vue.use(VueFire);




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
        filteredList: this.lists,
        showModal: false,
        showComments: false,
        user: {
            uid: '',
            name: '',
        },
        newCategory: '',
        comment: '',
        currentIndex: 0,
        currentText: '',
        signUpModal: false,
        signInModal: false,
        newTitle: '',
        currentName: '',
        newSubTodo:'',
        edit: false,
        form: {
            name: '',
            email: '',
            imageURL: '',
        },


    },
    firebase: {
        lists: fireLists,
        users: userList,
        categories: categoryList
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
        filter: function (category) {
            var self = this;
            fireLists.once('value', function(snapshot) {
                snapshot.forEach(function (snapshot) {
                    snapshot.child('todos').forEach(function (todoref) {
                        var todo = todoref.val();
                        if (todo.category != category.title) {
                            fireLists.child(snapshot.key).child('todos').child(todoref.key).child('visible').set(false);
                        }
                        else {
                            fireLists.child(snapshot.key).child('todos').child(todoref.key).child('visible').set(true);
                        }

                    });
                });
            });

        },
        all: function () {
            var self = this;
            fireLists.once('value', function(snapshot) {
                snapshot.forEach(function (snapshot) {
                    snapshot.child('todos').forEach(function (todoref) {
                        var todo = todoref.val();

                            fireLists.child(snapshot.key).child('todos').child(todoref.key).child('visible').set(true);


                    });
                });
            });

        },
        addCategory() {
            categoryList.push({title: this.newCategory});
            console.log(this.newCategory)

            this.newCategory='';
        },
        changeBackground: function (event) {
            document.body.style.backgroundColor = event.target.value;
        },
        addSubTodo: function (list,key)  {
            fireLists.child(list['.key']).child('todos').child(key).child('tasks').push({
                title: this.newSubTodo
            });
            this.newSubTodo = '';

        },
        addComment: function(list,todo,key) {
            console.log(firebase.database.ServerValue.TIMESTAMP);
            fireLists.child(list['.key']).child('todos').child(key).child('comments').push({
                content: this.comment,
                createdAt: firebase.database.ServerValue.TIMESTAMP,
                author: this.user.name,
            });
            todo.seen = true;

        },
        removeSubTodo: function(list,key,task) {


            fireLists.child(list['.key']).child('todos').child(key).child('tasks').child(task).remove();
            event.preventDefault()
        }
        ,
        save: function(list,key,todo) {
            console.log(todo);
            console.log(key);
            if (!todo.images)
            {
                todo.images = [];
            }
            if (!todo.tasks)
            {
                todo.tasks = [];
            }
            if (!todo.comments)
            {
                todo.comments = [];
            }
            fireLists.child(list['.key']).child('todos').child(key).set({
                title: todo.title,
                about: todo.about,
                deadline: todo.deadline,
                assigned: {name: todo.assigned.name, email: todo.assigned.email},
                images: todo.images,
                tasks: todo.tasks,
                completed: todo.completed,
                seen: false,
                comments: todo.comments,
                category: todo.category,
                visible: true
            });

            todo.seen = true;
            this.edit = false;
        },
        setFilter(filter) {
            this.visibility = filter;
        },
        addList: function () {
            newList = [];
            newList.title = this.currentText;
            newList.selected = false;
            newList.expand = true;

            fireLists.push(newList);

            this.currentText = '';
        },
        checkboxToggle(list, key) {
            console.log(this.users);

            fireLists.child(list['.key']).child('todos').child(key).remove();

        },
        removeTodo(list, key) {
            fireLists.child(list['.key']).child('todos').child(key).remove();
        },
        deleteList(list) {
            fireLists.child(list['.key']).remove();
        },
        close: function () {
            this.$emit('close');
            this.signUpModal = false;
            this.signInModal = false;
            this.form.name = '';
            this.form.email = '';

        }, //ROBERT DUVALL TO STORE IMAGES
        mounted() {
            console.log(this.$el);
        },
        closePop(todo) {
            this.$emit('close');

            todo.seen = false;

        },
        addToCard: function(list,key) {
            var input = document.getElementById('newImage');
            var temp = this;
            // have all fields in the form been completed
            var fileName = '';
            if (this.newTitle.length > 0  && input.files.length > 0) {
                var file = input.files[0];
                // get reference to a storage location and
                var fileAddress = storageRef.child('images/' + file.name)
                    .put(file)
                    .then(snapshot =>  db.ref('lists').child(list['.key']).child('todos').child(key).child('images').push({
                        title: this.newTitle,
                        url: snapshot.downloadURL,
                    }).catch(error => console.log(error)));

                // reset input values so user knows to input new data
                input.value = '';
            }
        },
        removeImageLink: function(list,key,index,todo) {
           db.ref('lists').child(list['.key']).child('todos').child(key).child('images').child(index).remove();
        },
        moveList: function(index,direction) {


            if ((this.lists.length-1 > index && direction === 1) || (index>0 && direction === -1)) {

                var temp = this.lists[index];
                var tempRight = this.lists[index + direction];
                if (!tempRight.todos) {
                    tempRight.todos = '';
                }
                if (!temp.todos) {
                    temp.todos = '';
                }
                db.ref('lists').child(temp['.key']).set({
                    expand: true,
                    selected: false,
                    title: tempRight.title,
                    todos: tempRight.todos,
                });
                db.ref('lists').child(tempRight['.key']).set({
                    expand: true,
                    selected: false,
                    title: temp.title,
                    todos: temp.todos,
                });
            }

        },
        moveTodo: function(todo,key, index,direction) {
            if ((this.lists.length-1 > index && direction === 1) || (index>0 && direction === -1)) {

                db.ref('lists').child(this.lists[index+direction]['.key']).child('todos').push(todo);
                db.ref('lists').child(this.lists[index]['.key']).child('todos').child(key).remove();
            }
        },
        signUp: function () {
            var input = document.getElementById('files');
            var email = this.form.email;
            var name = this.form.name;
            // have all fields in the form been completed
            var fileName = '';
            if (input.files.length > 0) {
                var file = input.files[0];
                // get reference to a storage location and
                storageRef.child('images/' + file.name)
                    .put(file)
                    .then(snapshot =>  db.ref('Users').push({name: name, email: email, imageURL: snapshot.downloadURL}))
                    .catch(error => console.log(error));
                // reset input values so user knows to input new data
                input.value = '';
            }
            this.signUpModal = false;
            this.close();

        },
        signIn: function (event) {
            var th = this;
            if (this.form.name.length> 0) {
                db.ref('Users').orderByChild('name').equalTo(this.form.name).on("value", function (snapshot) {
                    console.log(snapshot.val());
                    if (snapshot){
                        console.log(snapshot.val());
                        snapshot.forEach(function(data) {
                            th.user.name = data.val().name;
                            th.user.uid = data.key;
                            console.log(data);
                        });
                    }
                    else {
                        alert("doesn't exist");
                    }
                });
            }
            else if (this.form.email.length>0) {
                db.ref('Users').orderByChild('email').equalTo(this.form.email).on("value", function (snapshot) {
                    if (snapshot){
                        console.log(snapshot.val());
                        snapshot.forEach(function(data) {
                            th.user.name = data.val().name;
                            th.user.uid = data.key;
                            console.log(data);
                        });
                    } else {
                        alert("doesn't exist");
                    }
                });
            }


            console.log(th.user.name);
                    th.signUpModal = false;
                    th.close();



        },
    }

});

Vue.component('modal', {
    template: '#modal-template',
    props: ['show', 'index', 'list'],
    data: () => {
        return {
            title: '',
            about: '',
            deadline: "yyyy-MM-dd",
            selected: false,
            assigned: {
                name: '',
                email: ''
            },
            imgTitle:'',
            newImageTitle:'',
            images: [],
            category: '',
        };
    },
    firebase: {
      users: userList,
        categories: categoryList
    },
    methods: {
        close: function () {
            this.$emit('close');
            this.title = '';
            this.about = '';
            this.images = {},
            this.assigned = {};
            this.deadline= "MM-dd-yyyy";
            this.category='';
        },
        addImage: function() {
            var input = document.getElementById('entryFile');
            var temp = this;
            // have all fields in the form been completed
            var fileName = '';
            if (this.newImageTitle.length > 0  && input.files.length > 0) {
                var file = input.files[0];
                // get reference to a storage location and
                var fileAddress = storageRef.child('images/' + file.name)
                    .put(file)
                    .then(snapshot => this.addToList(this.newImageTitle, snapshot.downloadURL))
                    .catch(error => console.log(error));
                // reset input values so user knows to input new data
                input.value = '';
            }
        },
        addToList (title, url) {
            this.images.push({
                title: title,
                url: url
            });
            this.newImageTitle = '';
        },
        savePost: function () {
            console.log(this.index);
            console.log(this.list);

            console.log(this.category);


            fireLists.child(this.list['.key']).child('todos').push({
                title: this.title,
                about: this.about,
                deadline: this.deadline,
                assigned: { name: this.assigned.name, email: this.assigned.email },
                images: this.images,
                tasks: [],
                completed: false,
                seen: false,
                comments: [],
                visible: true,
                category: this.category.title,
            });

            this.close();

        },

    },
});

// attach Vue apps to existing DOM elements
App.$mount('#app');