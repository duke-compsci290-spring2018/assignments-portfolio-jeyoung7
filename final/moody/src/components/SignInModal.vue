
<template>
  <div class="signin">

    <!-- Modal Component -->
    <b-modal id="modal2" title="Sign In">
      <input type="text" v-model="email" placeholder="Email"><br>
      <input type="password" v-model="password" placeholder="Password"><br>
      <button v-on:click="signIn"> Sign In </button>
    </b-modal>
  </div>
</template>

<script>
  import firebase from 'firebase'
  import bModal from 'bootstrap-vue/es/components/modal/modal';
  import bModalDirective from 'bootstrap-vue/es/directives/modal/modal';
  export default {
    name: "signin-modal",
    data: function(){
      return {
        email: '',
        password: ''
      }
    },
    methods:{
      signIn: function() {
        firebase.auth().signInWithEmailAndPassword(this.email,this.password).then(
          (user)=> {
            this.$router.replace('Home');
          },
          (err) => {
            alert('Oops.'+err.message)
          }
        )
      }
    },
    components: {
    'b-modal': bModal
  },
  directives: {
    'b-modal': bModalDirective
  }
  }
</script>

<style scoped>

</style>
