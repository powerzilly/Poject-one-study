//L'elemento del Canvas e l'acquisizione del drawing context

canvas = document.getElementById("canvas");

contesto = canvas.getContext("2d");

function playSound(snd){

	try{
	
		snd.currentTime = 0;
		snd.play();
	}catch(e){}

}



//Punteggi

var scorea = 0, scoreb = 0;

//Elementi audio

var tick = new Audio("audio/tick2.mp3");
var tick1 = new Audio("audio/tick.mp3");
var tick2 = new Audio("audio/pong.mp3");



//Attuale posizione della pallina

var ballx = (canvas.width / 2);
var bally = (canvas.height / 2);

//I vettori di spostamento della pallina

var ballvx = 0;
var ballvy = 0;

//Posizione verticale del mouse

var posy = 150;

//Posizione verticale della barra del computer

var cpuy = 100;
var ritardo = 20;

//Faccio partire il Gioco

init();

function init() {

	canvas.addEventListener('mousemove',mousemove,false);
	canvas.addEventListener('click',mouseclick,false);
	
	//Attivo l'esecuzione di game loop
	
	intervallo = window.setInterval(gameLoop,ritardo);

}

function mousemove(ev){

	if(ev.layerX || ev.layerX == 0) {
		//Firefox
		posy = ev.layerY;
	}else if(ev.offsetX || offsetX == 0){
		//Opera&Chrome
		posy = ev.offsetY;		
	}
		
}

function mouseclick(ev){

	if(ballvx == 0){
		playSound(tick);
		ballvx = 10;
		ballvy = 0.4;
	}

}

//Abilitazione touch Screen per mobile
 window.addEventListener('load', function(){
 
 touchobj = null;
 
 canvas.addEventListener('touchstart', function(e){
  touchobj = e.changedTouches[0] 
	if(ballvx == 0){
		playSound(tick);
		ballvx = 10;
		ballvy = 0.4;
	}
  e.preventDefault() 
 }, false)
 
 canvas.addEventListener('touchmove', function(e){
  touchobj = e.changedTouches[0]; 
  posy = touchobj.clientY;
  e.preventDefault()
 }, false)
 
}, false)
		
		

function gameLoop(){

	aggiornaLogica();
	disegnaScena();

}

function pallaAlCentro(){

	ballx = (canvas.width / 2);
	bally = (canvas.height / 2);
		
	ballvx = 0, ballvy = 0;

}

function aggiornaLogica(){

	//Muovo la pallina
	ballx += ballvx;
	bally += ballvy;
	
	//Muovo la barra del computer
	if(cpuy < bally) cpuy += 6;
	if(cpuy > bally) cpuy -= 6;
	
	//Fermo le barre ai limiti dello schermo
	if(posy < 40) posy = 40;
	if(posy > canvas.height - 40) posy = canvas.height -40;
	
	if(cpuy < 40) cpuy = 40;
	if(cpuy > canvas.height - 40) cpuy = canvas.height -40;
	
	//Urti verticali
	if((ballvy > 0)&&(bally >= canvas.height -3)){
	
		playSound(tick1);
		ballvy = -ballvy;
	
	}
	
	if((ballvy < 0)&&(bally <= 3)){
	
		playSound(tick1);
		ballvy = -ballvy;
	
	}
	
	//Urti orizzontali
	if((ballvx > 0)&&(ballx >= canvas.width - 30)&&(ballx <= canvas.width -15)){
	
		if((bally >= cpuy -40)&&(bally <= cpuy + 40)){
		
			playSound(tick);
			ballvx = -((Math.random()*5)+10);
			ballvy = (Math.random()*16)-8;
		
		}
		
	}
	
	//Punto player
	if(ballx > canvas.width){
	
		playSound(tick2);
		scorea ++;
		
		pallaAlCentro();
		
	}
	
	//Urti player
	if((ballvx < 0)&&(ballx >= 25)&&(ballx <= 40)){
	
		if((bally >= posy -40)&&(bally <= posy +40)){
		
			playSound(tick);
			ballvx = ((Math.random()*5)+10);
			ballvy = ((Math.random()*16)-8);
		
		}
	
	}
	
	//Punto computer
	if(ballx < 0){
	
		playSound(tick2);
		scoreb ++;
		
		pallaAlCentro();
	
	}
}

function disegnaScena(){

	var buffer = document.createElement('canvas');
	buffer.width = canvas.width;
	buffer.height = canvas.height;
	var buffer_context = buffer.getContext('2d');
	
	//Pulisco il canvas
	contesto.clearRect(0,0,canvas.width,canvas.height);
	
	//Definisco lo stile di riempimento
	buffer_context.fillStyle = "#fff";
	
	//Disegno le barre
	buffer_context.fillRect(20,posy-40,10,80);
	buffer_context.fillRect(canvas.width-30,cpuy-40,10,80);
	
	//Disegno la pallina
	buffer_context.arc(ballx,bally,6,0,Math.PI*2,true);
	buffer_context.fill();
	
	//Scrivo i punteggi
	buffer_context.fillText("PLAYER: "+scorea,40,20);
	buffer_context.fillText("CPU: "+scoreb,canvas.width-80,20);
	
	//Applico il buffer al canvas
	contesto.drawImage(buffer,0,0);

}