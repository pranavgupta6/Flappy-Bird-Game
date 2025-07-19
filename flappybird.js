//board
let board;
let boardWidth=360;
let boardHeight=640;
let context;

//bird
let birdWidth=34;
let birdHeight=24;
let birdX=boardWidth/8;
let birdY=boardHeight/2;
let birdImg;

//pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth
let pipeY = 0;
let topPipeImg;
let bottomPipeImg;

let bird = {
    x: birdX,
    y: birdY,
    width : birdWidth,
    height : birdHeight
}

//physics
let velocityX = -2; //pipes moving left speed
let velocityY = 0; //bird jump speed
let gravity = 0.4;

let gameOver= false;
let score = 0;

window.onload = function(){
    board=document.querySelector("#board");
    board.height=boardHeight;
    board.width=boardWidth;
    context = board.getContext('2d'); // for drawing on board

    //draw flappy bird
    context.fillStyle = 'green' ;
    context.fillRect(bird.x, bird.y, bird.width, bird.height);

    //load bird image
    birdImg = new Image();
    birdImg.src = "./flappybird0.png";
    birdImg.onload = function(){
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    //load pipe images
    topPipeImg = new Image();
    topPipeImg.src="./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src="./bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes,1500); 

    //setting jump
    document.addEventListener("keydown", moveBird);
}


function update(){
    requestAnimationFrame(update);
    if(gameOver){
        return;
    }
    context.clearRect(0,0,boardWidth,boardHeight);

    //drawing bird for each fram again and again
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0); //apply gravity to bird and also limit the bird.y position to top of canvas
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if(bird.y > board.height){
        gameOver=true;
    }

    //pipes
    for (let i=0; i < pipeArray.length; i++ ){
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if(!pipe.passed && bird.x > pipe.x + pipe.width){
            score += 0.5; // adding half for both pipes-bottom and top 
            pipe.passed = true;
        }
        
        if (detectCollision(bird,pipe)){
            gameOver = true;
        }
    }    

    //clear pipes from array to avoid memory issues
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth){
        pipeArray.shift(); // removes first element from pipeArray
    }
    
    //maintain score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);

    if (gameOver){
        context.fillText("GAME OVER", 5, 90);
    }

}


function placePipes(){
    if(gameOver){
        return;
    }
    
    //creating random heights for pipe
    let randomPipeY = pipeY - pipeHeight/4 - Math.random() * pipeHeight/2 ; 
    let openingspace = board.height/4;

    let topPipe = {
        img : topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(topPipe);
    
    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingspace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e){
    if ( e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX"){
        //jump
        velocityY = -6;

        //reset the game
        if(gameOver){
            bird.y=birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

function detectCollision (bird,pipe) {
    return  bird.x < pipe.x + pipe.width &&  //bird's top left corner doesn't reach pipe's top right corner
            bird.x + bird.width > pipe.x &&  // bird's top right corner passes pipe's top left corner
            bird.y < pipe.y + pipe.height && //bird's top left corner doesn't reach pipe's bottom left corner
            bird.y + bird.height > pipe.y;   //bird's bottom left corner passes pipe's top left corner
}
