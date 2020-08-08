const sprites = new Image();
sprites.src = './sprites.png';
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
let frames = 0;

const hit = new Audio();
hit.src = './sounds/hit.wav';

// --------------------------------------------

const background = {
    sx: 390, 
    sy: 0,
    width: 275, 
    height: 204, 
    dx: 0, 
    dy: canvas.height - 204,

    drawing() {
        ctx.fillStyle = '#70c5ce'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.drawImage(
            sprites,
            background.sx, background.sy,
            background.width, background.height,
            background.dx, background.dy,
            background.width, background.height,
        );
            
        ctx.drawImage(
            sprites,
            background.sx, background.sy,
            background.width, background.height,
            (background.dx + background.width), background.dy,
            background.width, background.height,
        );
    }
}

function newFloor() {
        const floor = {
            sx: 0, 
            sy: 610,
            width: 224, 
            height: 112, 
            dx: 0, 
            dy: canvas.height - 112,
            //dwidth and dHeight are the same as width and sH. (s goes for source and d for destination)
            
            //function (can be deleted) drawing() {
            drawing() {
                ctx.drawImage(
                    sprites,
                    floor.sx, floor.sy,
                    floor.width, floor.height,
                    (floor.dx + floor.width ), floor.dy,
                    floor.width, floor.height,
                );
        
                ctx.drawImage(
                    sprites,
                    floor.sx, floor.sy,
                    floor.width, floor.height,
                    floor.dx, floor.dy,
                    floor.width, floor.height,
                );
            },

            update(){
                const moveFloorBy = 1;
                const repeatAt = floor.width / 2;
                const movingFloor = floor.dx - moveFloorBy;

                floor.dx = movingFloor % repeatAt;
            }

        }
    return floor;
}

function newBird(){
        const fBird = {
            sx: 0, 
            sy: 0,
            width: 33, 
            height: 24, 
            dx: 10, 
            dy: 50, 
            velocity: 0,
            gravity: 0.25,
            jump: 4.6,

            jumping () {
                fBird.velocity = - fBird.jump;
            },

            update(){
                if(collideWithFloor(fBird, global.floor)){
                    hit.play();
                    setTimeout(() => {
                        changePage(pages.START)
                    }, 500);
                    return ;
                }

                fBird.velocity = fBird.velocity + fBird.gravity;
                fBird.dy += fBird.velocity;
            },
            moviments: [
                { sx:0, sy: 0 }, //first bird
                { sx:0, sy: 26 }, //second bird
                { sx:0, sy: 52 }, //third bird
                { sx:0, sy: 26 }, //second again 
            ],
            currentFrame: 0,
            updateFrame() {
                const intervaloDeFrames = 10;
                const passouOIntervalo = frames % intervaloDeFrames === 0;
                      
                if(passouOIntervalo) {
                    const baseDoIncremento = 1;
                    const incremento = baseDoIncremento + fBird.currentFrame;
                    const baseRepeticao = fBird.moviments.length;
                    fBird.currentFrame = incremento % baseRepeticao
                    // console.log('[incremento]', incremento);
                    // console.log('[baseRepeticao]',baseRepeticao);
                    // console.log('[frame]', incremento % baseRepeticao);
                }
            },
            drawing() {
                fBird.updateFrame();
                const { sx, sy } = fBird.moviments[fBird.currentFrame];
                                
                ctx.drawImage(
                    sprites,
                    sx, sy,
                    fBird.width, fBird.height,
                    fBird.dx, fBird.dy,
                    fBird.width, fBird.height,
                );
            }
        }

    return fBird;
}

function newPipes(){
    const pipes = {
        width: 52, 
        height: 400, 

        bottom: {
            sx: 0, 
            sy: 169,
        },

        top: {
            sx: 52, 
            sy: 169,
        },
        // dx: 0, //destination x and y(dx and dy) defined inside the function bellow
        // dy: 0,
        space: 80,
        drawing() {
            pipes.pair.forEach(function(pair){
                const yRandom = pair.y;
                const spaceBetweenPipes = 90;
                    

                //TOP PIPE
                const topPipeDx = pair.x;
                const topPipeDy = yRandom;
                ctx.drawImage(
                    sprites,
                    pipes.top.sx, pipes.top.sy,
                    pipes.width, pipes.height,
                    topPipeDx, topPipeDy,
                    pipes.width, pipes.height,
                )
                //BOTTOM PIPE
                const bottomPipeDx = pair.x;
                const bottomPipeDy = pipes.height + spaceBetweenPipes + yRandom;
                ctx.drawImage(
                    sprites,
                    pipes.bottom.sx, pipes.bottom.sy,
                    pipes.width, pipes.height,
                    bottomPipeDx, bottomPipeDy,
                    pipes.width, pipes.height,
                )

                pair.topPipe = {
                    dx: topPipeDx,
                    dy: pipes.height + topPipeDy
                },

                pair.bottomPipe = {
                    dx: bottomPipeDx,
                    dy: pipes.height + bottomPipeDy
                }
            })
        },

        collideWithPipes(pair){
            const birdHead = global.fBird.dy;
            const birdFeet = global.fBird.dy + global.fBird.height;
            
            if(global.fBird.dx >= pair.x){
                
                if(birdHead <= pair.topPipe.dy){
                    return true;               
                    
                }
                if(birdFeet <= pair.bottomPipe.dy){
                    return true;
                }
            }
        },

        pair: [],
        update(){
            const after100Frames = frames % 100 === 0;
            if(after100Frames){
                pipes.pair.push({    
                    x: canvas.width,
                    y: -150 * (Math.random() + 1),
                })
            }

            pipes.pair.forEach(function(pair){
                pair.x -= 2; 

                if(pipes.collideWithPipes(pair)){
                    console.log('vc perdeu!')
                    changePage(pages.START)
                }

                if(pair.x + pipes.width <= 0){
                    pipes.pair.shift();
                }
            })


        }

    }
    return pipes;
}

function collideWithFloor (fBird, floor){
    const fBirdY = fBird.dy + fBird.height;

    if(fBirdY >= floor.dy){
        return true
    }

    return false
}



const getReady = {
    sx: 134, 
    sy: 0,
    width: 174, 
    height: 152, 
    dx: (canvas.width / 2) - (174 /2), 
    dy: 50, 
    
    drawing() {
        ctx.drawImage(
            sprites,
            getReady.sx, getReady.sy,
            getReady.width, getReady.height,
            getReady.dx, getReady.dy,
            getReady.width, getReady.height,
        );
    }
}




//
const global = {};
let pageActive = {};

function changePage(newPage){
    pageActive = newPage;

    if(pageActive.initialize){
        pageActive.initialize();
    }
}


const pages = {
    START: {
        initialize(){
            global.fBird = newBird();
            global.floor = newFloor();
            global.pipes = newPipes();
        },
        drawing(){
            background.drawing();
            global.fBird = newBird();
            global.fBird.drawing();
            
            global.floor.drawing();
            getReady.drawing();
        },
        click(){
            changePage(pages.GAME);
        },
        update(){
            global.floor.update();
            global.fBird.update();
           
        }
    },
    GAME: {
        drawing(){
            background.drawing();
            global.floor.drawing();
            global.fBird.drawing();
            global.pipes.drawing();
        }, 
        click(){
            global.fBird.jumping();
        },
        update(){
            global.floor.update();
            global.fBird.update();
            global.pipes.update();
        }
    }
}

function loopFPS(){
    
    pageActive.drawing();
    pageActive.update();

    frames += 1;
    
    requestAnimationFrame(loopFPS);
}

window.addEventListener('click', function (){
    if(pageActive.click){
        pageActive.click();
    };
})


changePage(pages.START);
loopFPS();