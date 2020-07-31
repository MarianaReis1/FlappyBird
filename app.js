const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const floor = {
    sx: 0, 
    sy: 610,
    sWidth: 224, 
    sHeight: 112, 
    dx: 0, 
    dy: canvas.height - 112,
    //dWidth and dHeight are the same as sWidth and sH. (s goes for source and d for destination)
    
    //function (can be deleted) drawing() {
    drawing() {
        ctx.drawImage(
            sprites,
            floor.sx, floor.sy,
            floor.sWidth, floor.sHeight,
            (floor.dx + floor.sWidth ), floor.dy,
            floor.sWidth, floor.sHeight,
        );
   
        ctx.drawImage(
            sprites,
            floor.sx, floor.sy,
            floor.sWidth, floor.sHeight,
            floor.dx, floor.dy,
            floor.sWidth, floor.sHeight,
        );
    }

}

const background = {
    sx: 390, 
    sy: 0,
    sWidth: 275, 
    sHeight: 204, 
    dx: 0, 
    dy: canvas.height - 204,

    drawing() {
        ctx.fillStyle = '#70c5ce'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.drawImage(
            sprites,
            background.sx, background.sy,
            background.sWidth, background.sHeight,
            background.dx, background.dy,
            background.sWidth, background.sHeight,
        );
            
        ctx.drawImage(
            sprites,
            background.sx, background.sy,
            background.sWidth, background.sHeight,
            (background.dx + background.sWidth), background.dy,
            background.sWidth, background.sHeight,
        );
    }
}

const fBird = {
    sx: 0, 
    sy: 0,
    sWidth: 33, 
    sHeight: 24, 
    dx: 10, 
    dy: 50, 
    velocity: 0,
    gravity: 0.25,
    
    update(){
        fBird.velocity = fBird.velocity + fBird.gravity;
        fBird.dy += fBird.velocity;
        
    },
    
    drawing() {
        ctx.drawImage(
            sprites,
            fBird.sx, fBird.sy,
            fBird.sWidth, fBird.sHeight,
            fBird.dx, fBird.dy,
            fBird.sWidth, fBird.sHeight,
        );
    }
}




function loop(){
    fBird.update();
    background.drawing();
    floor.drawing();
    fBird.drawing();
    

    requestAnimationFrame(loop);
}

loop();