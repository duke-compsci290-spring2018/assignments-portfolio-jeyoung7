<template>
  <div>

    <!-- Modal Component -->
    <b-modal id="modal1" title="Sign Up">
      <p> Create an Account </p>
      <input type="text" v-model="email" placeholder="Email"><br>
      <input type="password"  v-model="password" placeholder="Password"><br>
      <button v-on:click="signUp"> Sign Up </button>
    </b-modal>
  </div>
</template>

<script>
  import firebase from 'firebase'

  import bModal from 'bootstrap-vue/es/components/modal/modal';
  import bModalDirective from 'bootstrap-vue/es/directives/modal/modal';
  export default {
    name: "signup-modal",
    components: {
    'b-modal': bModal
  },
  directives: {
    'b-modal': bModalDirective
  },
  data: function(){
    return{
      email:'',
      password:''
    }
  },
  methods:{
    signUp: function(){
      console.log(this.email);
      firebase.auth().createUserWithEmailAndPassword(this.email,this.password).then(
        (user) => {
          firebase.database().ref(`/Users/${user.uid}/`)
                    .set({ Email: this.email});
        },
        (err) =>  {
          alert('Oops.'+err.message)
        }
      );
    }
  }
  }
</script>

<style scoped>

</style>
