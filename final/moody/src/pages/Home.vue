<template>
  <div>
    <h1>
      Moody.
  </h1>
  <button v-on:click="logout">Sign Out</button>
  </div>
</template>
<script>
  import firebase from 'firebase';
  export default {
        name: "Home",

    data () {
      return {
      msg: "welcome"
    }
    },
    methods: {
      logout:function() {
        firebase.auth().signOut().then(() => {
          this.$router.replace('/')
        })
      }
    }
  }
</script>

<style scoped>

</style>
