<template>
    <div id="app">
        <div class="page-header">
            <h1 @click="clicker">Jake's Quiz</h1>
        </div>
        <button v-if="!selectedB & !selectedC || !selectedC" @click="selectedA=!selectedA" >
           Duke
        </button>
        <button v-if="!selectedA & !selectedC" @click="selectedB=!selectedB" >
            Math
        </button>
        <button v-if="!selectedA & !selectedB" @click="selectedC=!selectedC" >
            Pop
        </button>
        <my_app v-bind:style="{ backgroundColor:  '#FFFFFF' }" :quizName="'Duke'" :questions="questionsA" :restart="removeA" v-if="selectedA">
        </my_app>
        <my_app v-bind:style="{ backgroundColor:  '#FFF123'}" :quizName="'Math'" :questions="questionsB" :restart="removeB" v-if="selectedB">
        </my_app>
        <my_app v-bind:style="{ backgroundColor:  '#FF123F'}" :quizName="'Pop'"  :questions="questionsC" :restart="removeC" v-if="selectedC">
        </my_app>
        <!-- built files will be mounted here -->
    </div>
</template>

<script>
      import App from './components/App'
    import QuizQuestion from '../data/duke_questions'
    import Math from '../data/math.json'
    import Pop from '../data/popculture'

    export default {
        name: "quiz_main.vue",
        data: function () {
            return {
                questionsA: QuizQuestion,
                questionsB: Math,
                questionsC: Pop,
                selectedA: false,
                selectedB: false,
                selectedC: false,

            }
        },
        components: {
            my_app: App
        },
        methods: {
            clicker() {
                console.log(this.questionsA);
            },
            removeA() {
                this.selectedA = false;
            },
            removeB() {
                this.selectedB = false;
                console.log("hello");
            },
            removeC() {
                this.selectedC = false;

            },
        }
        // imported components to use in HTML template

    }
</script>

<style scoped>

</style>