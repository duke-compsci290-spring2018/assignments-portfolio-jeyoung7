<template>
  <div>
    <h1>
      Moody.
    </h1>

    <p>
      The Interactive website that allows you to curate the perfect environment for your night in. Whether it's food, music, or your
      ideal Netflix, Moody has the answer for you!
    </p>
    <b-btn v-b-modal.modal1>Sign Up </b-btn>
    <b-btn v-b-modal.modal2>Sign In </b-btn>

    <signup-modal/>
    <signin-modal/>


  </div>
</template>

<script>
   import SignUpModal from '../components/SignUpModal';
   import SignInModal from '../components/SignInModal';

    export default {
        name: "Landing",
      components:
        {
          signupModal: SignUpModal,
          signinModal: SignInModal
        }
    }
</script>

<style scoped>

</style>
