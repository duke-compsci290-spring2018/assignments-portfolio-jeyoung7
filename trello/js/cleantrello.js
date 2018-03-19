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
        visibility: 'all',
        showModal: false,
        user: {
            uid: '',
            name: '',
        },
        currentIndex: 0,
        currentText: '',
        signUpModal: false,
        signInModal: false,
        currentName: '',

        form: {
            name: '',
            email: '',
            imageURL: '',
        }

    },
    firebase: {
        lists: fireLists,
        users: userList
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
            selected: false,
            assigned: {
                name: '',
                email: ''
            },
            imgTitle:'',
            newImageTitle:'',
            images: [],
        };
    },
    firebase: {
      users: userList
    },
    methods: {
        close: function () {
            this.$emit('close');
            this.title = '';
            this.about = '';
            this.images = {},
            this.assigned = {};
            console.log(this.users);
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




            fireLists.child(this.list['.key']).child('todos').push({
                title: this.title,
                about: this.about,
                assigned: { name: this.assigned.name, email: this.assigned.email },
                images: this.images,
                completed: false,
                seen: false,
            });
            this.close();

        }
    },
});

// attach Vue apps to existing DOM elements
App.$mount('#app');