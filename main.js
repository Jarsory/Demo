
// VARIABLES

var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');

var interval;
var frames = 0;
var multiplos = [];
var distractores = [];
var bullets = [];

var tablaInicial = Math.floor(Math.random()*(10)+2);
let numeroMultiplicador = document.getElementById('numeroMultiplicador')
numeroMultiplicador.innerHTML = 'tabla ' + tablaInicial;

var stop = false;


//CLASES
class Personaje{
    constructor(x,y,w,h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.life = 5;
        this.puntos = 0;
        this.speedx = 0;
        this.speedy = 0;
    }   
    draw(){
        ctx.fillStyle = 'green'
        ctx.fillRect(this.x,this.y,this.w,this.h);
    }
    newPos (){
        if(stop === false) {
            this.x = this.x + this.speedx;
            this.y = this.y + this.speedy;
        }
    }
    crashWith(multiplos) {
        return (this.x < multiplos.x + multiplos.w) &&
               (this.x + this.w > multiplos.x) &&
               (this.y < multiplos.y + multiplos.w) &&
               (this.y + this.w > multiplos.y)
    }
}

class Multiplos {
    constructor(x, y, w, h,n) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.n = n;
        this.randomDistractor = this.checkMultiple( tablaInicial );
    }
    draw() {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.fillStyle = 'black';
        ctx.font = "18pt sans-serif";
        ctx.fillText(this.randomDistractor, this.x+10, this.y+30);
    }
    checkMultiple(num){
        let multiNumber = 0; 
        for( let i = 1; i <= 10 ; i++ ){
            let x = Math.floor(Math.random()*(i)+1);
            multiNumber = x;
        }
        let numX = num*multiNumber;
        return numX;
    }  
}

class Distractores {
    constructor(x, y, w, h,n) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.n = n;
        this.randomDistractor = this.checkDistractor( tablaInicial );
    }
    draw() {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.fillStyle = 'black';
        ctx.font = "18pt sans-serif";
        ctx.fillText(this.randomDistractor, this.x+10, this.y+30);   
    }
    checkDistractor(num){

        let multiNumber = 0; 
        for( let i = 1; i <= 10 ; i++ ){
            let x = Math.floor(Math.random()*(i)+1);
            multiNumber = x;
        }
        let numX = num*multiNumber;
        return numX + 1; 
    }
}
class Bullet {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    draw() {
        this.y -= 2;
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
    crashWith(multiplos) {
        return (this.x < multiplos.x + multiplos.w) &&
               (this.x + this.w > multiplos.x) &&
               (this.y < multiplos.y + multiplos.w) &&
               (this.y + this.w > multiplos.y)
    }
}

//INSTANCIAS

var personaje= new Personaje(180,200,50,50);

// FUNCIONES 

function empieza1(){
    tablaInicial = Math.floor(Math.random()*(10)+2);

    numeroMultiplicador.innerHTML = 'tabla ' + tablaInicial;

    clear();
    multiplos= [];
    distractores = [];

}

function empieza2(){
    tablaInicial = Math.floor(Math.random()*(10)+2);

    numeroMultiplicador.innerHTML = 'tabla ' + tablaInicial;

    clear();
    multiplos= [];
    distractores = [];
}

function generateMultiplos() {

    let newMUltiplo = new Multiplos(Math.floor(Math.random() * 700),Math.floor(Math.random() * 400),50,50);
    let n = newMUltiplo;

    if( multiplos.length == 0 ){
        multiplos.push( newMUltiplo );
    }

    multiplos.forEach( elem => {
        let { x,y,w,h } = elem;
        if( n.x >= x && n.x <= x+w && n.y >= y && n.y <= y+h  ){  
        }else{
            if(frames % 540 === 0) {
                multiplos.push( newMUltiplo );
            }        
        }     
    })
}

function drawMultiplos() {
    multiplos.forEach(function(multiplo, i) {
        multiplo.draw();
    })
}

function generateDistractores() {

    let newDistractor = new Distractores(Math.floor(Math.random() * 700),Math.floor(Math.random() * 400),50,50);
   
    let n = newDistractor;

    if( distractores.length == 0 ){
        distractores.push( newDistractor );
    }

    distractores.forEach( elem => {
        let { x,y,w,h } = elem;
        
        if( n.x >= x && n.x <= x+w && n.y >= y && n.y <= y+h  ){
            
        }else{
            if(frames % 540 === 0) {
                distractores.push( newDistractor );
            }        
        }     
    })
}

function drawDistractores() {
    distractores.forEach(function(distractor, i) {
        distractor.draw();
    })
}
function generateBullets() {
    bullets.push(new Bullet(personaje.x+10,personaje.y-10,5,5));
}

function drawBullets() {
    bullets.forEach(function(bullet, i) {
        bullet.draw();
    })
}

function checkCollition() {
    multiplos.forEach((multiplo, mi) => {
        if(personaje.crashWith(multiplo)) {
            multiplos.splice(mi,1);
            personaje.puntos++
        }
        bullets.forEach((bullet, bi) => {
            if(bullet.crashWith(multiplo)) {
                bullets.splice(bi,1);
                multiplos.splice(mi,1);
            }
        })

    });

    distractores.forEach((distractor, di) => {
        if(personaje.crashWith(distractor)) {
            distractores.splice(di,1);
            personaje.life--;
            //console.log(snake.life)
        }
        bullets.forEach((bullet, bi) => {
            if(bullet.crashWith(distractor)) {
                bullets.splice(bi,1);
                distractores.splice(di,1);
            }
        })  
    });
}

function start (){
    let vidas = document.getElementById('vidas');
    vidas.innerHTML = 'vidas ' + personaje.life;
    
    let puntos = document.getElementById('puntos');
    puntos.innerHTML = 'puntos' + personaje.puntos;
    clear();
    generateMultiplos();
    drawMultiplos();
    personaje.draw();
    personaje.newPos();
    generateDistractores();
    drawDistractores();
    drawBullets();
    checkCollition();
    checkGame();
    
    frames += 1
}

function clear(){
    ctx.clearRect(0, 0, 800,500);
}

function gameOver() {
    clearInterval(interval);
    ctx.font = "60px Avenir";
    ctx.fillStyle = "red";
    ctx.fillText("GAME OVER", 190, 220);
    ctx.font = "40px Avenir";
    ctx.fillText("presiona la letra 'B' para reinicar", 140, 260);
    gameOver = true;
  }

  function checkGame() {
    if (personaje.life===0) {
        return gameOver();
      }
    }
interval= setInterval(start,1000/60);



// LISTENERS

window.addEventListener('keydown',function(e){
    if(e.keyCode ===37){
        if(stop) stop = false;
        if(personaje.x <= 0) {
            stop = true;
        } 
        personaje.speedx = -2;
    }
    if(e.keyCode ===38){
        if(stop) stop = false;
        if(personaje.y <= 0) {
            stop = true;
        } 
        personaje.speedy = -2;
    }
    if(e.keyCode ===39){
        if(stop) stop = false;
        if(personaje.x + personaje.w >= canvas.width) {
            stop = true;
        } 
        personaje.speedx = 2;
    }
    if (e.keyCode ===40){
        if(stop) stop = false;
        if((personaje.y + personaje.h) >= canvas.height){
                stop = true;
        }
        personaje.speedy = 2;
    }
    if(gameOver && e.keyCode === 66) {
        location.reload();
      }
});

window.addEventListener('keyup',function(e){
    if(e.keyCode ===37){
        personaje.speedx = 0;
    }
    if(e.keyCode ===38){
        personaje.speedy = 0;
    }
    if(e.keyCode ===39){
        personaje.speedx = 0;
    }
    if (e.keyCode ===40){
        personaje.speedy = 0;
    }

})

window.addEventListener('keypress', function(e) {
    if(e.keyCode === 32) {
        generateBullets();
    }
    
})




