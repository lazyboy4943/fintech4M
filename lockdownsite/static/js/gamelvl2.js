var character = document.querySelector(".character");
var map = document.querySelector(".map");
var atm = document.getElementById('atm');
var camera = document.querySelector(".camera");
var paperonfloor = document.getElementById('paperonfloor');
var exercise = document.getElementById('exercise');
var overwhelm = document.getElementById('overwhelm');
var door = document.getElementById('door');
var banktable = document.getElementById('banktable');
var ATMinterface = document.getElementById("ATMinterface");
console.log('it works 1')


//start in the middle of the map
var x = 109;
var y = 105;
var held_directions = []; //State of which arrow keys we are holding down
var speed = 1; //How fast the character moves in pixels per frame

function sleep(milliseconds) {
   const date = Date.now();
   let currentDate = null;
   do {
     currentDate = Date.now();
   } while (currentDate - date < milliseconds);
 }

function changeow() {
   var bottomright = document.getElementById('overwhelm');
   bottomright.innerHTML = "<h1>ANSWERED</h1>"
}

function changepf() {
   var bottomright = document.getElementById('paperonfloor');
   bottomright.innerHTML = "<h1>ANSWERED</h1>"
}


const placeCharacter = () => {
   
   var pixelSize = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--pixel-size')
   );
   
   const held_direction = held_directions[0];
   if (held_direction) {
      if (held_direction === directions.right) {x += speed;}
      if (held_direction === directions.left) {x -= speed;}
      if (held_direction === directions.down) {y += speed;}
      if (held_direction === directions.up) {y -= speed;}
      if (held_direction === directions.d) {x += speed;}
      if (held_direction === directions.a) {x -= speed;}
      if (held_direction === directions.s) {y += speed;}
      if (held_direction === directions.w) {y -= speed;}
      character.setAttribute("facing", held_direction);
   }

   //debug
   console.log(x, y)

   character.setAttribute("walking", held_direction ? "true" : "false");
   
   //Limits (gives the illusion of walls)
   var leftLimit = -3;
   var rightLimit = 226;
   var topLimit = 20;
   var bottomLimit = 118;

   // if touching door then go outside
   var buildinglocxhigh = 125;
   var buildinglocxlow = 101;
   var buildinglocy = 111;
   if (x < buildinglocxhigh && y >= buildinglocy && x > buildinglocxlow) {
      door.style.display = 'inline'
   } else {
      door.style.display = 'none'
      
      //document.querySelector("#info").submit();
      //sleep(2000)
   }

   // if touching atm show 
   var paperlocxlow = (16 *6)+8;
   var paperlocxhigh = 191;
   var paperlocy = -8 + 40;
   if (x < paperlocxhigh && x > paperlocxlow && y <= paperlocy) {
      atm.style.display = 'inline'
   } else {
      atm.style.display = 'none'
   }

    // if touching paper show 
    var paperlocxlow = (16 * 1)+8;
    var paperlocxhigh = (16 * 2)+8;
    var paperlocy = -8 + 140;
    var paperlocylow = -8 + 125
    if (x < paperlocxhigh && x > paperlocxlow && y <= paperlocy && y >= paperlocylow) {
        paperonfloor.style.display = 'inline'
    } else {
        paperonfloor.style.display = 'none'
    }

    // if near gym then go to gym
    var paperlocx = -7;
    var paperlocy = -8 + 110;
    var paperlocylow = -8 + 54
    if (x < paperlocx &&  y <= paperlocy && y >= paperlocylow) {
        exercise.style.display = 'inline'
    } else {
        exercise.style.display = 'none'
    }


   // if near gym then go to gym

   if (x > rightLimit - 2 ) {
      overwhelm.style.display = 'inline'
   } else {
      overwhelm.style.display = 'none'
   }


   // if touching table then dont touch table and show table ui
   var tablexlow = 51;
   var tablexhigh = 175;
   var tableyhigh = 46;


   if (x == tablexlow + 2 || x == tablexlow + 1) {
      if (y < tableyhigh) {
         x = tablexlow
      }
   }


   if (x == tablexhigh - 2 || x == tablexhigh -1) {
      if (y < tableyhigh) {
         x = tablexhigh
      }
   }

   if (y == tableyhigh - 2 || y == tableyhigh - 1) {
      if (x < tablexhigh) {
         if (x > tablexlow){
            y = tableyhigh
         }
      }
   }
   
   if (y < tableyhigh + 2 && x < tablexhigh && x > tablexlow) {
      banktable.style.display = 'inline';
   } else {
      banktable.style.display = 'none';
   }
   


   if (x < leftLimit) { x = leftLimit; }
   if (x > rightLimit) { x = rightLimit; }
   if (y < topLimit) { y = topLimit; }
   if (y > bottomLimit) { y = bottomLimit; }
   
   
   var camera_left = window.outerWidth*0.45;
   var camera_top = pixelSize * 42;
   
   map.style.transform = `translate3d( ${-x*pixelSize+camera_left}px, ${-y*pixelSize+camera_top}px, 0 )`;

   character.style.transform = `translate3d( ${x*pixelSize}px, ${y*pixelSize}px, 0 )`;  
}


//Set up the game loop
const step = () => {
   placeCharacter();
   window.requestAnimationFrame(() => {
      step();
   })
}
step(); //kick off the first step!



/* Direction key state */
const directions = {
   up: "up",
   down: "down",
   left: "left",
   right: "right",
   w: "up",
   a: "left",
   s: "down",
   d: "right",
}
const keys = {
   38: directions.up,
   37: directions.left,
   39: directions.right,
   40: directions.down,
   87: directions.w,
   65: directions.a,
   83: directions.s,
   68: directions.d
}
document.addEventListener("keydown", (e) => {
   var dir = keys[e.which];
   if (dir && held_directions.indexOf(dir) === -1) {
      held_directions.unshift(dir)
   }
})

document.addEventListener("keyup", (e) => {
   var dir = keys[e.which];
   var index = held_directions.indexOf(dir);
   if (index > -1) {
      held_directions.splice(index, 1)
   }
});



/* BONUS! Dpad functionality for mouse and touch */
var isPressed = false;
const removePressedAll = () => {
   document.querySelectorAll(".dpad-button").forEach(d => {
      d.classList.remove("pressed")
   })
}
document.body.addEventListener("mousedown", () => {
   console.log('mouse is down')
   isPressed = true;
})
document.body.addEventListener("mouseup", () => {
   console.log('mouse is up')
   isPressed = false;
   held_directions = [];
   removePressedAll();
})
const handleDpadPress = (direction, click) => {   
   if (click) {
      isPressed = true;
   }
   held_directions = (isPressed) ? [direction] : []
   
   if (isPressed) {
      removePressedAll();
      document.querySelector(".dpad-"+direction).classList.add("pressed");
   } 
}