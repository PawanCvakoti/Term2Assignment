var upPressed = false;
var downPressed = false;
var leftPressed = false;
var rightPressed = false;
var lastPressed = false;
var score = 0;
var interval = 0;
var interval1 = 0;
var interval2 = 0;

function keyup(event) {
  var player = document.getElementById('player');
  if (event.keyCode == 37) {
    leftPressed = false;
    lastPressed = 'left';
  }
  if (event.keyCode == 39) {
    rightPressed = false;
    lastPressed = 'right';
  }
  if (event.keyCode == 38) {
    upPressed = false;
    lastPressed = 'up';
  }
  if (event.keyCode == 40) {
    downPressed = false;
    lastPressed = 'down';
  }

  player.className = 'character stand ' + lastPressed;
}


function move() {
  var player = document.getElementById('player');
  var positionLeft = player.offsetLeft;
  var positionTop = player.offsetTop;
  if (downPressed) {
    var newTop = positionTop+1;

    var element = document.elementFromPoint(player.offsetLeft, newTop+32);
    if (element.classList.contains('sky') == false) {
      player.style.top = newTop + 'px'; 
    }

    if (leftPressed == false) {
      if (rightPressed == false) {
        player.className = 'character walk down';
      }
    }
  }
  if (upPressed) {
    var newTop = positionTop-1;

    var element = document.elementFromPoint(player.offsetLeft, newTop);
    if (element.classList.contains('sky') == false) {
      player.style.top = newTop + 'px'; 
    }
    
    if (leftPressed == false) {
      if (rightPressed == false) {
        player.className = 'character walk up';
      }
    }
  }
  if (leftPressed) {
    var newLeft = positionLeft-1;

    var element = document.elementFromPoint(newLeft, player.offsetTop);
    if (element.classList.contains('sky') == false) {
      player.style.left = newLeft + 'px'; 
    }


    player.className = 'character walk left';
  }
  if (rightPressed) {
    var newLeft = positionLeft+1;
    
    var element = document.elementFromPoint(newLeft+32, player.offsetTop);
    if (element.classList.contains('sky') == false) {
      player.style.left = newLeft + 'px';   
    }

    player.className = 'character walk right';
  }

}


function keydown(event) {
  if (event.keyCode == 37) {
    leftPressed = true;
  }
  if (event.keyCode == 39) {
    rightPressed = true;
  }
  if (event.keyCode == 38) {
    upPressed = true;
  }
  if (event.keyCode == 40) {
    downPressed = true;
  }
}

function remove() {
  /*To decrease the player's life when bomb hits the player*/
  var ulDiv = document.getElementsByTagName('ul')[0];
  var energy = document.getElementsByTagName('li');
  var myself = document.getElementById('player');
  myself.className = 'character hit left';
  if (myself.className == 'character hit left'){
    ulDiv.removeChild(energy[0]);
    if (energy[0] == undefined){
      myself.className = 'character dead';
      clearInterval(interval);
      clearInterval(interval1);
      clearInterval(interval2);
      clearInterval(timeout);
      document.removeEventListener('keydown', keydown);
      document.removeEventListener('keyup', keyup);
      var grenade = document.getElementsByClassName('bomb');
      for (var i=0; i < grenade.length; i++){
        grenade[i].style.display = 'none';}

      /*To print gameover on the screen when the player’s all three life is finished*/
      setTimeout(function(){
      var scoreDiv = document.getElementsByClassName('scoreDiv')[0];
      scoreDiv.style.display = 'none';
      var parent = document.getElementsByTagName('body')[0];
      var gameOver = document.createElement('div');
      gameOver.className = 'gameOver';
      gameOver.style.position = 'absolute';
      gameOver.style.top = '30%';
      gameOver.style.left = '39%';
      gameOver.style.fontSize = '55px';
      gameOver.style.color = '#FF5733';
      var gameoverText = document.createTextNode('Game Over');
      parent.appendChild(gameOver);
      gameOver.appendChild(gameoverText);
      }, 1200);

      /*To display the player's score*/
      setTimeout(function(){ 
      var Name = prompt("Enter your sweet name here");
      window.localStorage.setItem('gamer', Name);
      }, 2000);

      /*To display the Play Again button*/
      setTimeout(function(){
      var gameOver = document.getElementsByClassName('gameOver')[0];
      gameOver.style.display = 'none';
      var parent = document.getElementsByTagName('body')[0];
      var PlayerName = localStorage.getItem("gamer");
      var scoreDisplay = document.createElement('div');
      scoreDisplay.style.position = 'absolute';
      scoreDisplay.style.top = '20%';
      scoreDisplay.style.left = '33%';
      scoreDisplay.style.fontSize = '55px';
      scoreDisplay.style.color = '#FF5733';
      var scoreDisplayText = document.createTextNode(PlayerName + ' Scored: ' + score);
      parent.appendChild(scoreDisplay);
      scoreDisplay.appendChild(scoreDisplayText);
      var begin = document.getElementsByClassName('start');
      begin[0].addEventListener('click', playAgain);
      begin[0].firstChild.nodeValue='Play Again';
      begin[0].style.display = 'block';
      }, 3000);
    }
  }
}

/*To restart the game when Play Again button is pressed*/
function playAgain() {
  location.reload();
}

/*To hide the explosion animation after 250 millisecond*/
function finish() {
  var boom = document.getElementsByClassName('explosion');
  for (var i=0; i < boom.length; i++){
    boom[i].style.display = 'none';
  }
}

/*For collision detection*/
function touchIdentifier() {
  var grenade = document.getElementsByClassName('bomb');
  var myself = document.getElementById('player');
  for (var i=0; i<grenade.length; i++){
    if (grenade[i].offsetLeft < myself.offsetLeft + myself.offsetWidth &&
      grenade[i].offsetTop < myself.offsetTop + myself.offsetHeight &&
      grenade[i].offsetLeft + grenade[i].offsetWidth > myself.offsetLeft &&
      grenade[i].offsetTop +  grenade[i].offsetHeight > myself.offsetTop) {
      grenade[i].className = 'explosion';
      remove();
      setTimeout(finish, 250);
    }
  }
}

function bombShow() {
  /*To create bombs at the top of the screen at random positions*/
  interval = setInterval(function() { 
  var bombDiv = document.createElement('div');
  bombDiv.className = 'bomb';
  var container = document.getElementsByTagName('body')[0];
  container.appendChild(bombDiv);
  bombDiv.style.top = 1 + 'px';
  var ranPos = Math.ceil(Math.random()*1000);
  bombDiv.style.left = ranPos + 'px';
  }, 1000);
  interval1 = setInterval(function() {
  var bombDiv = document.getElementsByClassName('bomb');

  /*To drop bombs downwards and explode bombs at random heights on the grass*/
  for (var i=0; i<bombDiv.length; i++){
    var drop = parseInt(bombDiv[i].style.top);
    bombDiv[i].style.top = drop + 1 + 'px';
    var ranHeight = [];
    ranHeight[1] = '480px';
    ranHeight[2] = '490px';
    ranHeight[3] = '500px';
    ranHeight[4] = '510px';
    ranHeight[5] = '520px';
    ranHeight[6] = '530px';
  var ranNum = Math.ceil(Math.random()*6);
    if (bombDiv[i].style.top == ranHeight[ranNum]){
      bombDiv[i].className = 'explosion';
      setTimeout(finish, 250);
      scoreList();
    }
/*This condition is used to explode bombs that do not explode at random height because some bombs are passing downward
the screen without exploding at random height*/
     if (bombDiv[i].style.top == '540px'){
      bombDiv[i].className = 'explosion';
      setTimeout(finish, 250);
      scoreList();
    }     
  }
  }, 11);
}

/*To count the player's score*/
function scoreList() {
  var scoreDiv = document.getElementsByClassName('scoreDiv')[0];
  score = score + 1;
  scoreDiv.firstChild.nodeValue = 'Score ' + score;
}

function myLoadFunction() {
  timeout = setInterval(move, 10);
  document.addEventListener('keydown', keydown);
  document.addEventListener('keyup', keyup);
  var begin = document.getElementsByClassName('start');
  begin[0].style.display = 'none';
  interval2 = setInterval(touchIdentifier , 1);
  bombShow();
  var scoreContainer = document.getElementsByClassName('hud')[0];
  var scoreDiv = document.createElement('div');
  scoreDiv.className = 'scoreDiv';
  scoreDiv.style.margin = '20px';
  scoreDiv.style.fontSize = '30px';
  var scoretextNode = document.createTextNode('Score ' + score);
  scoreContainer.appendChild(scoreDiv);
  scoreDiv.appendChild(scoretextNode);
}

/*To change the text of the start button before the game starts*/
function TheGame() {
  var begin = document.getElementsByClassName('start');
  setTimeout(function(){begin[0].firstChild.nodeValue='Lets Play';}, 500);
  setTimeout(function(){begin[0].firstChild.nodeValue='The Game';}, 1300);
  setTimeout(myLoadFunction, 2000); 
}

function startGame() {
  var begin = document.getElementsByClassName('start');
  begin[0].addEventListener('click', TheGame);
}

document.addEventListener('DOMContentLoaded', startGame);