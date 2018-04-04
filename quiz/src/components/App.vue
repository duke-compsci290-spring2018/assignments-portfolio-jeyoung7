<template>
    <div >
        <h4> {{this.quizName }}</h4>
       <quiz_question v-if="start" :index="index" :pick="choice" :responses="responses" :question="currentQuestion"> </quiz_question>
        <button v-if="!start" @click="startGame()"> Start Game </button>
        <button v-if="start && showBack" @click="back()"> Back </button>
        <button v-if="start && showNext" @click="next()"> Next </button>
        <button v-if="start && !hideSubmit" @click="submit()"> Submit </button>

        <button v-if="lastIncorrect" @click="goToLastIncorrect()"> Last Incorrect </button>
        <label v-if="isIncorrect"> Incorrect </label>
    </div>
</template>

<script>
    // use Firebase to save data user entered
    // use local components, note .vue extension is assumed so not necessary to include
    import QuizQuestion from './QuizQuestion'

    // export anonymous object from this module so it can be accessed by others when imported
    export default {
        name: 'app',
        // NOTE in a component, data must be a function that returns a NEW version of the values
        data () {
            return {
                currentQuestion: '',
                index: 0,
                choice:'',
                showNext: true,
                showBack: false,
                hideSubmit: true,
                responses: Array(this.questions.length),
                incorrectAnswers: Array(this.questions.length),
                start: false,
                lastIncorrect: false,
                lastIndex: 0,
                isIncorrect:false,
            }
        },
        props: [
            'questions', 'restart', 'quizName'
            ],
            // connect to single Firebase resource
        components: {
            // imported components to use in HTML template
            quiz_question: QuizQuestion,

        },
        // functions you want to be called from HTML code
        methods: {
            // add book to the database after getting details from Google Books API
            goToLastIncorrect() {
                this.currentQuestion = this.questions[this.lastIndex];
                this.index=this.lastIndex;
                this.isIncorrect=true;
            },
            startGame() {
                console.log(this.questions);

                this.currentQuestion = this.questions[0];
                console.log(this.currentQuestion);
                this.start=true;
                console.log(this.questions);
            },
            next() {
                console.log(this.responses);
                console.log(this.questions);
                if (this.responses[this.index] != this.currentQuestion.choices[this.currentQuestion.correctAnswer])
                {
                    this.incorrectAnswers[this.index] = false;
                }
                else {
                    this.incorrectAnswers[this.index] = true;

                }


                if (this.index < this.questions.length )
                {
                    this.index = this.index+1;
                    this.currentQuestion = this.questions[this.index];
                    this.calculateLastCorrect();


                }
                if (this.incorrectAnswers[this.index] !=false)
                {

                    this.isIncorrect=false;
                }
                this.hideOrShow();

            },
            back() {
                if (this.responses[this.index] != this.currentQuestion.choices[this.currentQuestion.correctAnswer])
                {
                    this.incorrectAnswers[this.index] = false;
                }
                else {
                    this.incorrectAnswers[this.index] = true;

                }
                console.log(this.responses);

                if (this.index >= 0 )
                {
                    this.index = this.index-1;
                    this.currentQuestion = this.questions[this.index];
                }
                this.calculateLastCorrect();

                if (this.incorrectAnswers[this.index] !=false)
                {

                    this.isIncorrect=false;
                }
                this.hideOrShow();

            },
            hideOrShow() {
                this.showNext=true;
                this.showBack=true;
                this.hideSubmit=true;
                if (this.index===this.questions.length-1)
                {
                    this.showNext=false;
                    this.hideSubmit=false;
                }
                if (this.index===0)
                {
                    this.showBack=false;
                }


            },
            submit() {
                var scoreRight = this.calculateRight();
                var scoreWrong = this.questions.length-scoreRight;
                var scoreLine = this.calculateScoreLine(scoreRight/scoreWrong);

                alert(scoreLine+ scoreRight+'/'+scoreWrong);
                this.restart()
            },
            calculateRight() {
                var correct = 0;
                for (var i=0; i<this.responses.length; i++)
                {
                    if (this.responses[i]===true)
                    {
                        correct++;
                    }

                }
                return correct;
            },
            calculateScoreLine(x) {
                if (x<.2)
                {
                    return "YOU BOMBED IT YOU LOSER";
                }
                else if (x<.4)
                {
                    return "THAT WAS REALLY MEDIOCRE";
                }
                else if (x<.6)
                {
                    return "THAT WAS REALLY AVERAGE MATE";

                }
                else if (x<.8)
                {
                    return "C's GET DEGREES";

                }
                else
                {
                    return "WOHOOOOOOO";

                }
            },
            calculateLastCorrect() {
                console.log(this.incorrectAnswers);
                var counter = 0;
                for (var i =0; i<this.incorrectAnswers.length; i++)
                {
                    if (this.incorrectAnswers[i]===false)
                    {
                        counter++;
                        this.lastIndex=i;
                        this.lastIncorrect=true;
                        break;
                    }
                }
                if (counter===0)
                {
                    this.lastIncorrect=false;
                }
                console.log(this.lastIndex)
            },
            // given title and author, get JSON data about the book to display

        }
    }
</script>

<style lang="scss" scoped>
    /* load global variable definitions so colors can be managed in a single place if needed */
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        margin-top: 20px;
    }

</style>