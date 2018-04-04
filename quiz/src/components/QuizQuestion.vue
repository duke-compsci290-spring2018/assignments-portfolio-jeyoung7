<template>
    <div>
    <h2> Question {{(index+1)}} </h2>
        <h3> {{question.question}} </h3>
    <div v-for="choice in question.choices">
        <input type="radio"  v-bind:value="choice" v-model="responses[index]">  {{choice}}
    </div>
    </div>
</template>

<script>
    // export anonymous object from this module so it can be accessed by others when imported
    export default {
        name: 'Quiz',
        // these values will be filled in by parent component, values must match tag's attribute names
        props: [
            'responses',
            'question',
            'index',
            'pick'
        ]
    }
</script>

<style lang="scss" scoped>
    /* load global variable definitions so colors can be managed in a single place if needed */
    .first {
        width: 1%;
    }
    .top {
        height: 1.5em;
    }
</style>