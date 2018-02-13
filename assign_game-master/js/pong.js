// global variables associated with game
// frames per second to run game
var FPS = 50;
// the area in the HTML document where the game will be played
var canvas = document.getElementById('gameCanvas');
// the actual object that handles drawing on the canvas
var ctx = canvas.getContext('2d');
// player's score (how many times they have saved the ball)
var score = 0;
var hiScore = 0;
// ball specific variables
var ballImage = loadImage('./images/ball.gif');
var ballSize = 15;
var x = canvas.width / 2;
var y = canvas.height / 2;
var dx = 4;
var dy = -4;
// paddle specific variables
var paddleSound = loadSound('./sounds/pong_beep.wav');
var paddleWidth = 60;
var paddleHeight = 10;
var paddleX = (canvas.width - paddleWidth) / 2;
var paddleY = canvas.height - paddleHeight * 3;
// key input specific variables
var leftPressed = false;
var rightPressed = false;
// handle image and sounds loading, really only needed for LOTS or BIG images and sounds
var NUM_IMAGES_EXPECTED = 1;
var numImagesLoaded = 0;
var NUM_SOUNDS_EXPECTED = 1;
var numSoundsLoaded = 0;

var bricks = [];
bricks.fill(1);
/*
 * Game loop functions:
 *   update
 *   draw
 */
function update() {
    moveBall();
    movePaddle();
    checkCollisions();
    checkBrickHit();

    // no way to win or lose, it just plays forever!
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPaddle();
    drawBricks();

    drawBall();

    drawScore();

}


/*
 * Ball functions:
 *   move
 *   draw
 */
function moveBall() {
    x += dx;
    y += dy;
}

function drawBall() {
    if (ballImage != null) {
            ctx.drawImage(ballImage, x, y, ballSize, ballSize);
        }
        else {
            // set features first, so they are active when the rect is drawn
            ctx.beginPath();
            ctx.fillStyle = '#0095DD';
            ctx.arc(x, y, ballSize / 2, 0, Math.PI*2);
            ctx.fill();
            ctx.closePath();
    }
}


/*
 * Paddle functions:
 *   move
 *   draw
 */
function movePaddle() {
    if (rightPressed && paddleY < canvas.height - paddleHeight) {
        paddleX += 5;
    }
    else if (leftPressed && paddleY > 0) {
        paddleX -= 5;
    }
}

function drawPaddle() {
    // set features first, so they are active when the rect is drawn
    ctx.fillStyle = '#0095DD';
    ctx.fillRect(paddleX, paddleY, paddleWidth, paddleHeight);
}
/*
criterion for box
 */
var brickRows = 8;
var brickColumns = 3;
var brickWidth = 50;
var brickHeight = 20;
var brickPadding = 0;
var brickOffsetTop = 50;
var brickOffsetLeft = 50;

function drawBricks() {
    for(c=0; c<brickColumns; c++) {
       for(r=0; r<brickRows; r++) {
            var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
            var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
            if (bricks[c][r]==-1)
            {
                continue;
            }
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.strokeStyle="#000000";
            if (c===0) {
                ctx.fillStyle = "#0095DD";
            }else if (c===1) {
                ctx.fillStyle= "#ff0000";
            }
            else {
                ctx.fillStyle= "#e5e500";

            }
            ctx.stroke();
            ctx.fill();
            ctx.closePath();
        }
    }
}

/*
 * Other functions:
 *   drawScore
 *   checkCollisions
 */
function drawScore() {
    // set features first, so they are active when the text is drawn
    ctx.font = '16px Arial';
    ctx.fillStyle = '#0095DD';
    ctx.fillText('Score: ' + score, 8, 20);
    ctx.fillText('Hi Score: ' + hiScore, 98, 20);
}

function checkBrickHit() {

        var newX = x+ 7.5;
        var newY = y+ 7.5;
        var rowWidth = brickHeight + brickPadding;
        var colWidth = brickWidth + brickPadding;


        if (row <= brickRows && row>= 0 && col <= brickColumns && col>=0)
        {
            if (bricks[col][row]!=-1) {
                console.log(row);
                console.log(col);
                bricks[col][row] = -1;

                var index = sideOrTop(col,row); /*returns binary */c
                console.log("index"+index);
                if (index === 0) {
                    dx = -dx;
                } else {
                    dy = -dy;
                }

            }
        }



}
/*
Function to Detect Brick Hit


 */

function sideOrTop(c,r) {
    if (x <= c*brickWidth+brickOffsetLeft+4 )
    {
        return 0;
    }
    return 1;
}
function checkCollisions() {
    var nextX = x + dx;
    var nextY = y + dy;
    var xBrick = bricks[0][0].x;
    var yBrick = bricks[0][0].y;
    var xBounds = xBrick + brickWidth*(brickPadding+brickColumns);
    var yBounds = yBrick + brickHeight*(brickPadding+brickRows);


    if (nextY > canvas.height - ballSize || nextY < 0) {
        dy = -dy;
    }
    if (nextX < 0) {
        dx = -dx;
    }
    if (nextX> canvas.width)
    {
        dx = -dx;
    }
    else if (nextY > paddleY - ballSize &&
        nextX > paddleX && nextX < paddleX + paddleWidth) {
        dy = -dy;
        paddleSound.play();
        // got it --- increase score!
        score += 1;
        if (score > hiScore) {
            hiScore = score;
        }
    }
    else if (nextY > canvas.height - ballSize) {
        x = canvas.width / 2;
        y = canvas.height / 2;
        paddleX = (canvas.width - paddleWidth) / 2;
        // missed --- reset score!
        score = 0;
    }




}

/*
 * Player input functions:
 *   key handlers
 *   mouse handler
 */
function keyDownHandler(e) {
    if (e.keyCode == 37) {
        leftPressed = true;
    }
    else if (e.keyCode == 39) {
        rightPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode == 39) {
        leftPressed = false;
    }
    else if(e.keyCode == 39) {
        rightPressed = false;
    }
}

function mouseMoveHandler(e) {
    // get the mouse coordinates relative to the canvas rather than the page
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}


/*
 * Image and Sound utilities
 */
// these need to be called BEFORE the game starts so they are loaded and available DURING the game
function loadImage (url) {
    // create actual HTML element and note when it finishes loading
    var img = new Image();
    img.onload = function () {
        numImagesLoaded += 1;
        console.log(url + " loaded");
        // reset so it is only counted once (just in case)
        this.onload = null;
    }
    img.src = url;
    return img;
}

function loadSound (url) {
    // create actual HTML element and note when it finishes loading
    var snd = new Audio();
    snd.oncanplay = function () {
        numSoundsLoaded += 1;
        console.log(url + " loaded");
        // reset so it is only counted once (just in case)
        this.oncanplay = null;
    }
    snd.src = url;
    return snd;
}

/*
 * Setup input responses
 */
// respond to both keys and mouse movements
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);


/*
 * Game loop
 */
// NOT IDEAL --- just starts when the everthing is done loading, not necessarily when the user is ready

setInterval(function() {
    if (numImagesLoaded >= NUM_IMAGES_EXPECTED && numSoundsLoaded >= NUM_SOUNDS_EXPECTED) {
        update();
        draw();
    }
}, 1000/FPS);
