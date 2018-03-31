


var player;
var bullets;
var player2;
const fps = 400;

var shoot = false;

window.onload = function(){

    document.addEventListener('keydown', keyPush);
    player = new tank(30, 200, 'green', 90 * Math.PI / 180);

    bullets = [];
    player2 = new tank(600, 200, 'blue', -90 * Math.PI / 180);
    gameArea.start();
    
}

var gameArea = {
    canvas: document.createElement("canvas"),
    start: function(){
        this.canvas.width = 700;
        this.canvas.height = 400;
        this.context = this.canvas.getContext('2d');
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 1000/fps);
    },
    stop : function() {
        clearInterval(this.interval);
    },    
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

}

// game loop 
function updateGameArea() {
    gameArea.clear(); 
    player.draw();
    
    player2.draw();
    
    for( i = 0; i < bullets.length; i++){
        if(bullets[i]){
            bullets[i].draw();
         
            if(collisionDetection(bullets[i], player2) == true){
                delete bullets[i];
         }
        }
    }


    
}

function getDistance(x1, x2, y1, y2){
    let xDistance = x2 - x1;
    let yDistance = y2 - y1;

    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

function collisionDetection(bullet, tank){
    
    if(getDistance(bullet.bulletX, tank.x, bullet.bulletY, tank.y) <= tank.tankWitdh/2){
        return true;
    }
}

function tank(x, y, color, angle){
    this.x = x;
    this.y = y;
    this.color = color;
    this.tankWitdh = 60;
    this.tankHeight = 45;
    this.wheelWitdh = 10;
    this.wheelHeight = 60;
    this.canonWitdh = 10;
    this.canonHeight = 21;
    this.angle = angle;

    
    this.draw = function(){

        ctx = gameArea.context;
        ctx.save();
        ctx.translate(this.x+ this.tankWitdh/2, this.y+this.tankHeight/2);       
        ctx.rotate(this.angle);
        ctx.translate(-1*(this.x+ this.tankWitdh/2), -1*(this.y+this.tankHeight/2));;
        
        ctx.fillStyle = color;
        // draw body
        ctx.fillRect(this.x, this.y, this.tankWitdh, this.tankHeight);
        // draw canon
        ctx.fillRect(this.x + this.tankWitdh/2 - this.canonWitdh/2, this.y-this.canonHeight, this.canonWitdh, this.canonHeight);
        // draw left wheel
        ctx.fillRect(this.x , this.y-9, this.wheelWitdh, this.wheelHeight);
        // draw right wheel
        ctx.fillRect(this.x + this.tankWitdh-this.wheelWitdh, this.y-9, this.wheelWitdh, this.wheelHeight);
    
        ctx.restore();   
    }


}

function gun(tank){
    this.bulletX = tank.x + tank.tankWitdh/2;
    this.bulletY = tank.y+23;
    this.angle = tank.angle;

    var speed = 3;
    this.velX = Math.sin(this.angle)*speed;
    this.velY = Math.cos(this.angle)*speed;
    
    this.draw = function(){
        
        this.ctx = gameArea.context;
        this.ctx.fillStyle = tank.color;
        this.ctx.beginPath();
        this.ctx.arc(this.bulletX, this.bulletY, tank.canonWitdh/2, 0, Math.PI*2, true);
        this.ctx.fill();
      


        
        this.bulletX += this.velX
        this.bulletY -= this.velY;
      
        if(this.bulletX <= 0 || this.bulletX >= gameArea.canvas.width){
            this.velX=-this.velX;
        }
        if(this.bulletY <= 0 || this.bulletY >= gameArea.canvas.height){
            this.velY=-this.velY;
        }
        
        
    }
}


function keyPush(evt){
    // left
    if(evt.keyCode == '37'){
        player.angle -= 5 * Math.PI / 180; 
    }
    // up
    else if(evt.keyCode == '38') {
    //  player.x += Math.cos(player.angle-90* Math.PI / 180);
    //  player.y += Math.sin(player.angle-90* Math.PI / 180);
        player.x += Math.sin(player.angle);
        player.y -= Math.cos(player.angle);
    }
    // right
    else if(evt.keyCode == '39') {
        player.angle += 5 * Math.PI / 180; 
    }
    // down
    else if(evt.keyCode == '40') {
    // player.x -= Math.cos(player.angle-90* Math.PI / 180);
    // player.y -= Math.sin(player.angle-90* Math.PI / 180);
       player.x -= Math.sin(player.angle);
       player.y += Math.cos(player.angle);
       
    }
    // space
    else if(evt.keyCode == '32') {
        bullets.push(new gun(player));
        
    }
}
