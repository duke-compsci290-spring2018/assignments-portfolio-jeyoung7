/*
* "Constants"
*/
// frames per second to run game
var FPS = 50;
// color for everything
var COLOR = "#0095DD";
// ball specific values
var BALL_IMAGE = "images/ball.gif";
var BALL_SPEED = 4;
var BALL_SIZE = 15;
// paddle specific values
var PADDLE_SOUND = "sounds/pong_beep.wav";
var TRUMP_SOUND = "sounds/trump.mp3";
var PADDLE_SPEED = 5;
var PADDLE_SIZE = 10;
var  bricks =[];
var startGame = false;
var ticker = 0;
var used = false;
/*
 * Image and Sound manager
 */
class ResourceManager {
    constructor () {
        this.numImagesLeftToLoad = 0;
        this.numSoundsLeftToLoad = 0;
    }
    starterText(ctx) {

    }
    // these need to be called BEFORE the game starts so they are loaded and available DURING the game
    loadImage (url) {
        // create actual HTML element and note when it finishes loading
        var img = new Image();
        var self = this;
        img.onload = function () {
            self.numImagesLeftToLoad -= 1;
            console.log(url + ' loaded');
            // reset so it is only counted once (just in case)
            this.onload = null;
        };
        img.onerror = function () {
            console.log('ERROR: could not load ' + url);
        };
        img.src = url;
        this.numImagesLeftToLoad += 1;
        return img;
    }

    loadSound (url) {
        // create actual HTML element and note when it finishes loading
        var snd = new Audio();
        var self = this;
        snd.oncanplay = function () {
            self.numSoundsLeftToLoad -= 1;
            console.log(url + ' loaded');
            // reset so it is only counted once (just in case)
            this.oncanplay = null;
        };
        snd.onerror = function () {
            console.log('ERROR: could not load ' + url);
        };
        snd.src = url;
        this.numSoundsLeftToLoad += 1;
        return snd;
    }

    isLoadingComplete () {
        return this.numImagesLoaded === this.numImagesExpected &&
            this.numSoundsLoaded === this.numSoundsExpected;
    }
}


/*
 * Key and mouse input manager
 */
class InputManager {
    constructor (canvas) {
        this.canvas = canvas;
        this.leftPressed = false;
        this.rightPressed = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.paddleIncrease = false;
        this.paddleDecrease = false;
        this.addLife=false;
    }

    get leftPressed () {
        return this._leftPressed;
    }
    get paddleIncrease () {
        return this._paddleIncrease;

    }
    get paddleDecrease () {
        return this._paddleDecrease;

    }
    get rightPressed () {
        return this._rightPressed;
    }
    get addLife () {
        return this._addLife;
    }
    set leftPressed (pressed) {
        this._leftPressed = pressed;
    }
    set rightPressed (pressed) {
        this._rightPressed = pressed;
    }
    set paddleIncrease (pressed) {
        this._paddleIncrease = pressed;
    }
    set paddleDecrease (pressed) {
        this._paddleDecrease = pressed;
    }
    set addLife (pressed) {
        this._addLife = pressed;
    }
    keyDownHandler (e) {
        if (e.keyCode === 32) { // space!
            startGame = true;
        }
        else if (e.keyCode=== 37) {
            this.leftPressed = true;
        }
        else if (e.keyCode === 80) {
            this.paddleIncrease=true;
        }
        else if (e.keyCode===79){
            this.paddleDecrease=true;
        }
        else if (e.keyCode === 39) {
            this.rightPressed = true;

        } else if (e.keyCode===68) {
            this.addLife = true;

        }
    }

    keyUpHandler (e) {
        if (e.keyCode === 37) {
            this.leftPressed = false;
        }
        else if (e.keyCode === 39) {
            this.rightPressed = false;
        }
        else if (e.keyCode === 80) {
            this.paddleIncrease=false;
        }
        else if (e.keyCode === 79) {
            this.paddleDecrease=false;
        }
        else if (e.keyCode===68) {
            this.addLife = false;

        }

    }

    // get the mouse coordinates relative to the canvas rather than the page
    mouseMoveHandler (e) {
        this.mouseX = e.clientX - this.canvas.offsetLeft;
        this.mouseY = e.clientY - this.canvas.offsetTop;
    }

    mouseInBounds () {
        return this.mouseX > 0 && this.mouseX < this.canvas.width &&
            this.mouseY > 0 && this.mouseY < this.canvas.height;
    }
}


/*
 * Generic game element that can move and be drawn on the canvas.
 */
class Sprite {
    constructor (x, y, width, height, dx, dy) {
        this.startX = x;
        this.startY = y;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.dx = dx;
        this.dy = dy;
    }

    get x () {
        return this._x;
    }

    get y () {
        return this._y;
    }

    get dx () {
        return this._dx;
    }

    get dy () {
        return this._dy;
    }

    get nextX () {
        return this._x + this._dx;
    }

    get nextY () {
        return this._y + this._dy;
    }

    get width () {
        return this._width;
    }

    get height () {
        return this._height;
    }


    set x (x) {
        this._x = x;
    }

    set y (y) {
        this._y = y;
    }

    set dx (dx) {
        this._dx = dx;
    }

    set dy (dy) {
        this._dy = dy;
    }

    set width (w) {
        this._width = w;
    }

    set height (h) {
        this._height = h;
    }

    reset () {
        this.x = this.startX;
        this.y = this.startY;
    }

    move (canvas) {
    }

    draw (ctx) {
    }
}

class Ball extends Sprite {
    constructor (image, x, y, size, dx, dy) {
        super(x, y, size, size, dx, -dy);
        this.image = image;
        this.canvas = canvas;
    }

    get size () {
        return this.width;
    }

    move () {
        if ((this.x +this.dx )>this.canvas.width || (this.x+this.dx)<=0) {
            this.dx = -this.dx;
        }
        if ((this.y+this.dy)<=0) {
            this.dy = -this.dy;
        }
        this.x += this.dx;

        this.y += this.dy;

    }

    draw (ctx) {
        if (this.image !== null) {
            ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
        }
        else {
            // set features first, so they are active when the rect is drawn
            ctx.beginPath();
            ctx.fillStyle = COLOR;
            ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI*2);
            ctx.fill();
            ctx.closePath();
        }
    }
}
/* bricks, controls my brick wall, class */
class Bricks  {
    constructor (brickRows, brickColumns, brickWidth, brickHeight, brickPadding, brickOffsetTop, brickOffsetLeft)
    {
        this.brickRows = brickRows;
        this.brickColumns = brickColumns;
        this.brickWidth = brickWidth;
        this.brickHeight = brickHeight;
        this.brickPadding = 0;
        this.brickOffsetTop = brickOffsetTop;
        this.brickOffsetLeft = brickOffsetLeft;
        for(var c=0; c<brickColumns; c++) {
            bricks[c] = [];
            for(var r=0; r<brickRows; r++) {
                bricks[c][r] = { x: 0, y: 0, show: true };
            }
        }
    }
    isHit(x,y,c,r) {


        if (x > bricks[c][r].x && x < bricks[c][r].x + this.brickWidth && y > bricks[c][r].y && y < bricks[c][r].y + this.brickHeight)
        {
            return true;
        }

        return false;
    }
    checkHit(x,y) {


        for (var c = 0; c < this.brickColumns; c++) {
            for (var r = 0; r < this.brickRows; r++) {


                if (this.isHit(x, y, c, r) === true && bricks[c][r].show===true)
                {
                    bricks[c][r].show= false;
                    return 1;
                }

            }
        }
        return 0;

    }
    draw (ctx) {
        for(var c=0; c<this.brickColumns; c++) {
            for(var r=0; r<this.brickRows; r++) {
                var brickX = (c*(this.brickWidth+this.brickPadding))+this.brickOffsetLeft;
                var brickY = (r*(this.brickHeight+this.brickPadding))+this.brickOffsetTop;
                if (!bricks[c][r].show)
                {
                    continue;
                }
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, this.brickWidth, this.brickHeight);
                ctx.strokeStyle="#000000";
                if (c===0) {
                    ctx.fillStyle = "#0095DD";
                }else if (c===1) {
                    ctx.fillStyle= "#ff0000";
                }
                else if (c===2)
                {
                    ctx.fillStyle= "#40FF40";
                }
                else   if (c===3)
                {
                    ctx.fillStyle = "#FFE1B8";
                }
                else  if (c===4) {
                    ctx.fillStyle = "#CC74A0";
                }
                else  if (c===5) {
                    ctx.fillStyle = "#859799";
                }
                else if (c===6){
                    ctx.fillStyle= "#FF8D78";
                }
                else  if (c===7){
                    ctx.fillStyle= "#CC9C74";
                }
                else {
                    ctx.fillStyle= "#FFFFFF";
                }

                ctx.stroke();
                ctx.fill();
                ctx.closePath();
            }
        }
    }
    getGridCol(x) {
        return Math.floor((x-this.brickOffsetLeft)/this.brickWidth);

    }
    getGridRow(y) {
        return Math.floor((y-this.brickOffsetTop)/this.brickHeight);

    }
}
/* controls the paddle */
class Paddle extends Sprite {
    constructor (x, y, width, height, dx, dy) {
        super(x, y, width, height, dx, dy);
    }

    move (canvas) {
        if (input.rightPressed && this.x < canvas.width - this.width) {
            this.x += 5;/*this.dx;*/
        }
        else if (input.leftPressed && this.x > 0) {
            this.x -=  5;
        }
        else if (input.mouseInBounds()) {
            this.x = input.mouseX - this.width / 2;
        }
    }

    draw (ctx) {
        // set features first, so they are active when the rect is drawn
        ctx.fillStyle = COLOR;
        if (input.paddleIncrease)
        {
            this.width = this.width + 10;
        }
        if (input.paddleDecrease)
        {
            this.width = this.width - 10;

        }
        ctx.fillRect(this.x, this.y, this.width+input.paddleIncrease, this.height);
    }
}

class Score extends Sprite {
    constructor (x, y, c, w) {
        super(x, y, 0, 0, 0, 0);
        this.score = 0;
        this.lives = 5;
        this.limit = c*w;
    }

    draw (ctx) {
        // set features first, so they are active when the text is drawn
        if (input.addLife)
        {
            this.lives = this.lives +1;
        }
        ctx.font = '16px Arial';
        ctx.fillStyle = COLOR;
        ctx.fillText('Score: ' + this.score, this.x, this.y);
        ctx.fillText('Lives: ' + this.lives, this.x + 90, this.y);
    }

    reset () {
        this.lives = this.lives-1;
        if (this.lives === 0)
        {
            alert("LOSERRRRR");
            document.location.reload();
        }
    }


    increment () {
        this.score += 1;
        if (ticker === 1)
        {
            this.score+=1;
            ticker=0;
        }

        if (this.score == this.limit) {
            alert("WE'VE GOT A winner");
            document.location.reload();

        }
    }
}


/*
 * Game class contains everything about the game and displays in a given canvas
 */
class Game {
    constructor(canvas) {
        // the area in the HTML document where the game will be played
        this.canvas = canvas;
        // the actual object that handles drawing on the canvas
        this.ctx = this.canvas.getContext('2d');
        this.paddleSound = resources.loadSound(PADDLE_SOUND);
        // elements in the game
        this.brickSound = resources.loadSound(TRUMP_SOUND);
        this.ball = new Ball(resources.loadImage(BALL_IMAGE),
            this.canvas.width / 2, this.canvas.height / 2, BALL_SIZE,
            BALL_SPEED, -BALL_SPEED);
        this.paddle = new Paddle((this.canvas.width - PADDLE_SIZE * 6) / 2, this.canvas.height - PADDLE_SIZE * 3,
            PADDLE_SIZE * 6, PADDLE_SIZE, 0, PADDLE_SPEED);
        this.score = new Score(8, 20,8,8);
        this.bricks = new Bricks(8, 8, 50, 20, 0, 50, 50);

    }

    loop() {
        if (resources.isLoadingComplete()) {
            this.update();
            this.draw();
        }
    }

    updatePaddleSize(x)
    {
        this.paddle = new Paddle((this.canvas.width - (PADDLE_SIZE + x)* 6) / 2, this.canvas.height - PADDLE_SIZE * 3,
            PADDLE_SIZE * 6, PADDLE_SIZE, 0, PADDLE_SPEED);
    }
    update() {
        if (startGame !== false) {
            this.ball.move(this.canvas);
            this.paddle.move(this.canvas);
            this.checkCollisions(this.canvas);

            // no way to win or lose, it just plays forever!
        }
    }

    draw() {
        if (startGame === false) {
            this.ctx.font = "25px Arial";
            this.ctx.fillStyle= '#000000';
            this.ctx.fillText("Space to Start",canvas.width/3, canvas.height/2);
        }
        else {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ball.draw(this.ctx);
            this.paddle.draw(this.ctx);
            this.score.draw(this.ctx);
            this.bricks.draw(this.ctx);
        }
    }


    checkCollisions() {

        var state = this.bricks.checkHit(this.ball.x,this.ball.y);
        if (state === 1 || state === 2)
        {
            this.ball.dy = -this.ball.dy;
            this.brickSound.play();
            this.score.increment();

        }


        if (this.ball.nextY > this.paddle.y - this.ball.size &&
            this.ball.nextX > this.paddle.x && this.ball.nextX < this.paddle.x + this.paddle.width) {
            this.ball.dy = -this.ball.dy;
            this.paddleSound.play();
        }
        else if (this.ball.nextY > this.canvas.height - this.ball.size) {
            this.ball.reset();
            this.paddle.reset();
            this.score.reset();
        }

    }
}


/*
 * Setup classes
 */
var canvas = document.getElementById('gameCanvas');
var resources = new ResourceManager();
var input = new InputManager(canvas);
var game = new Game(canvas);

/*
 * Setup input responses
 */
// respond to both keys and mouse movements
document.addEventListener('keydown', event => input.keyDownHandler(event), false);
document.addEventListener('keyup', event => input.keyUpHandler(event), false);
document.addEventListener('mousemove', event => input.mouseMoveHandler(event), false);

/*
 * Game loop
 */
// NOT IDEAL --- just starts when the everthing is done loading, not necessarily when the user is ready
setInterval(function() {
    game.loop();
}, 1000/FPS);

//o = smaller paddle
//p = bigger paddle
// d = addLife one