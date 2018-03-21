var config = {
    apiKey: "AIzaSyABq904mMuJqgVB-9spHtkMhGW2Cf-Wz7E",
    authDomain: "my-website-3e3ca.firebaseapp.com",
    databaseURL: "https://my-website-3e3ca.firebaseio.com",
    projectId: "my-website-3e3ca",
    storageBucket: "my-website-3e3ca.appspot.com",
    messagingSenderId: "260939014953"
};
//INITIALIZING FIREBASE

var db = firebase.initializeApp(config).database();
var fireLists = db.ref('lists');
var userList = db.ref('Users');
var categoryList = db.ref('categories');
var activityList = db.ref('pastActivity');

var storageRef = firebase.storage().ref(); //storage @DUVALL

Vue.use(VueFire);

////https://stackoverflow.com/questions/1484506/random-color-generator used to generate category colors
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
////used for getting a random color
var App = new Vue({
    data: { //central data store
        newTodo: '',
        filteredList: this.lists,
        showModal: false,
        showComments: false,
        user: {
            uid: '',
            name: '',
            email: '',
            imageURL: '',
        },
        generalCategories: {
            date: {
                title: 'date', color: '#B21287'
            },
            title: {
                title: 'date', color: '#FF00BA'
            },
            about: {
                title: 'date', color: '#14CCCC'
            },
            assigned: {
                title: 'assigned', color: '#34B2B2'
            },
        },
        newCategory: '',
        comment: '',
        currentIndex: 0,
        currentText: '',
        signUpModal: false,
        signInModal: false,
        showActivity: false,
        newTitle: '',
        currentName: '',
        newSubTodo: '',
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
        categories: categoryList,
        pastActivity: activityList,
    },
    computed: {},
    methods: {

        //class lecture easy way to change backgroundcolor
        filter: function (category) {
            var self = this;
            fireLists.once('value', function (snapshot) {
                snapshot.forEach(function (snapshot) {
                    snapshot.child('todos').forEach(function (todoref) {
                        var todo = todoref.val();
                        if (todo.category.title != category.title) {
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
            fireLists.once('value', function (snapshot) {
                snapshot.forEach(function (snapshot) {
                    snapshot.child('todos').forEach(function (todoref) {
                        var todo = todoref.val();

                        fireLists.child(snapshot.key).child('todos').child(todoref.key).child('visible').set(true);


                    });
                });
            });

        },  //allthefunctional methods
        addCategory() {
            categoryList.push({title: this.newCategory, color: getRandomColor()});
            console.log(this.newCategory);

            this.newCategory = '';
        },
        changeBackground: function (event) {
            document.body.style.backgroundColor = event.target.value;
        },
        addSubTodo: function (list, key) {
            fireLists.child(list['.key']).child('todos').child(key).child('tasks').push({
                title: this.newSubTodo
            });
            this.addToActivity(this.newSUBTODO+this.user.name, "SUBTODO Added");

            this.newSubTodo = '';

        }, //addcomment

        addComment: function (list, todo, key) {
            console.log(firebase.database.ServerValue.TIMESTAMP);
            this.addToActivity(todo.title, "COMMENT ADDED");

            fireLists.child(list['.key']).child('todos').child(key).child('comments').push({
                content: this.comment,
                createdAt: firebase.database.ServerValue.TIMESTAMP,
                author: this.user.name,
            });

        },
//savepost
        save: function (list, key, todo) {

            this.addToActivity(todo.title, "TODO EDITED");

            if (!todo.images) {
                todo.images = [];
            }
            if (!todo.tasks) {
                todo.tasks = [];
            }
            if (!todo.comments) {
                todo.comments = [];
            }
            fireLists.child(list['.key']).child('todos').child(key).set({
                title: todo.title,
                about: todo.about,
                deadline: todo.deadline,
                assigned: todo.assigned,
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
        addToActivity: function (title, action) {


            activityList.push({
                title: title,
                action: action,
                createdAt: firebase.database.ServerValue.TIMESTAMP,
                author: this.user.name,
            });
        }
        ,
        setFilter(filter) {
            this.visibility = filter;
        }, //addlist
        addList: function () {
            newList = [];
            newList.title = this.currentText;
            newList.selected = false;
            newList.expand = true;

            this.addToActivity(newList.title, "LIST ADDED");
            fireLists.push(newList);

            this.currentText = '';
        },
        checkboxToggle(list, key) {
            console.log(this.users);

            fireLists.child(list['.key']).child('todos').child(key).remove();

        },
        removeTodo(todo,list, key) {
            this.addToActivity(todo.title, "TODO REMOVED");

            fireLists.child(list['.key']).child('todos').child(key).remove();
        },
        deleteList(list) {
            this.addToActivity(list.title, "LIST REMOVED");

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
        assign: function() {
            if (this.assigned ) {
                this.assignedList.push(this.assigned);
            }
        },
        closePop(todo) {
            this.$emit('close');

            todo.seen = false;

        },
        addToCard: function (list, key) {
            this.addToActivity(todo.title, "TODO ADDED");
//adds image to existing card

            var input = document.getElementById('newImage');
            var temp = this;
            // have all fields in the form been completed
            var fileName = '';
            if (this.newTitle.length > 0 && input.files.length > 0) {
                var file = input.files[0];
                // get reference to a storage location and
                var fileAddress = storageRef.child('images/' + file.name)
                    .put(file)
                    .then(snapshot => db.ref('lists').child(list['.key']).child('todos').child(key).child('images').push({
                        title: this.newTitle,
                        url: snapshot.downloadURL,
                    }).catch(error => console.log(error)));

                // reset input values so user knows to input new data
                input.value = '';
            }
        },
        removeImageLink: function (list, key, index, todo, event) {
            this.addToActivity(todo.title, "IMAGE REMOVED");
//removes image from existing card
            db.ref('lists').child(list['.key']).child('todos').child(key).child('images').child(index).remove();
            if (event) {
                event.preventDefault()
            }
            todo.seen = true;

        },
        moveList: function (index, direction) {

//moveslist left and right
            if ((this.lists.length - 1 > index && direction === 1) || (index > 0 && direction === -1)) {

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
        moveTodo: function (todo, key, index, direction) {
//moves todoelft and right
            if ((this.lists.length - 1 > index && direction === 1) || (index > 0 && direction === -1)) {

                var action = todo.title+' moved from '+this.lists[index].title+' to '+this.lists[index+direction].title;
                    this.addToActivity(todo.title, action);

                db.ref('lists').child(this.lists[index + direction]['.key']).child('todos').push(todo);
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
                    .then(snapshot => db.ref('Users').push({name: name, email: email, imageURL: snapshot.downloadURL}))
                    .catch(error => console.log(error));
                // reset input values so user knows to input new data
                input.value = '';
            }
            this.signUpModal = false;
            this.close();
        },
        signIn: function (event) {
            var th = this;
//note on sign in, all it does is change active user which affects activity log and a little style
                db.ref('Users').orderByChild('name').equalTo(this.form.name).on("value", function (snapshot) {
                    if (snapshot) {
                        snapshot.forEach(function (data) {
                            th.user.name = data.val().name;
                            th.user.uid = data.key;
                            th.user.imageURL = data.val().imageURL;
                        });
                    }
                    else {
                        alert("doesn't exist");
                    }
                });


                db.ref('Users').orderByChild('email').equalTo(this.form.email).on("value", function (snapshot) {
                    if (snapshot) {
                        console.log(snapshot.val());
                        snapshot.forEach(function (data) {
                            th.user.name = data.val().name;
                            th.user.uid = data.key;
                            th.user.imageURL = data.val().imageURL;

                        });
                    } else {
                        alert("doesn't exist");
                    }
                });

            if (this.user.name.length=== 0) {
                alert("doesn't exist");

            }
            th.signUpModal = false;
            th.close();


        },
    }

});
// USED FOR MY POST FORM
Vue.component('modal', {
    template: '#modal-template',
    props: ['show', 'index', 'list'],
    data: () => {
        return {
            title: '',
            about: '',
            deadline: "yyyy-MM-dd",
            selected: false,
            assigned : {name: '',
            email: ''},
            assignedList: [],
            imgTitle: '',
            newImageTitle: '',
            images: [],
            category: {
                title: '',
                color: '#FFFFFF',
            },
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


                this.assigned = [];
            this.deadline = "MM-dd-yyyy";
            this.category = {title: '',
                color: '',};
        },
        assign: function() {
            if (this.assigned ) {
                this.assignedList.push({
                  name: this.assigned.name,
                email: this.assigned.email,});
            }
        },
        addImage: function () {
            var input = document.getElementById('entryFile');
            var temp = this;
            // have all fields in the form been completed
            console.log(this.newImageTitle);
            var fileName = '';
            if (this.newImageTitle.length > 0 && input.files.length > 0) {
                console.log("hello");
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
        addToList(title, url) {
            this.images.push({
                title: title,
                url: url
            });
            this.newImageTitle = '';
        },
        addToActivity: function (title, action) {

            console.log(this.assignedList);

            activityList.push({
                title: title,
                action: action,
                createdAt: firebase.database.ServerValue.TIMESTAMP,
                author: this.assigned.name,
            });
        },
        savePost: function () {
            this.addToActivity(this.title,"CARD ADDED");
            console.log(this.index);
            console.log(this.list);

            if (!this.category) {
                this.category.title = '';
                this.category.color = '#FFFFFF';

            }
            if (!this.assignedList) {
                this.assignedList = [];

            }

            console.log(this.assignedList);
            fireLists.child(this.list['.key']).child('todos').push({
                title: this.title,
                about: this.about,
                deadline: this.deadline,
                assigned: this.assignedList,
                images: this.images,
                tasks: [],
                completed: false,
                seen: false,
                comments: [],
                visible: true,
                category: {title: this.category.title, color: this.category.color}
            });

            this.close();

        },

    },
});

// attach Vue apps to existing DOM elements
App.$mount('#app');