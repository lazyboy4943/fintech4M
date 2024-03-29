var character = document.querySelector(".character");
var map = document.querySelector(".map");
var noteonwall = document.getElementById('noteonwall')
var jumpoff = document.getElementById('jumpoff')
var door = document.getElementById('door')
var subtitle1 = document.getElementById('subtitle1')
var subtitle2 = document.getElementById('subtitle2')
var subtitle3 = document.getElementById('subtitle3')
var subtitle4 = document.getElementById('subtitle4')
var wallet = document.getElementById("wallet")

function random_id() {
   var S4 = function() {
      return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
   };
   return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

function get_money() {
   fetch("/get_money", {
      method: "POST",
      body: JSON.stringify({userID: localStorage.getItem("user_id")}),
      headers: {
         'Content-Type': 'application/json'
      },
   }).then(response => response.json())
   .then(data => {
      var status = data.status;
      if (status == 200) {
         wallet.innerHTML = `<div style='width: 136px;'>Wallet: $ ${data.wallet}</div>`;
      }
      else {
         alert("not ok")
      }
   })
}


if (!localStorage.getItem("subs_seen")) {
   subtitle1.style.display = 'inline';
   subtitle2.style.display = 'none';
   subtitle3.style.display = 'none';
   subtitle4.style.display = 'none';
   wallet.style.display = 'none';
}
else {
   get_money();
}

function gotosubtitle2() {
   subtitle1.style.display = 'none';
   subtitle2.style.display = 'inline';
   subtitle3.style.display = 'none';
   subtitle4.style.display = 'none';
}

function gotosubtitle3() {
   subtitle1.style.display = 'none';
   subtitle2.style.display = 'none';
   subtitle3.style.display = 'inline';
   subtitle4.style.display = 'none';
}

function gotosubtitle4() {
   subtitle1.style.display = 'none';
   subtitle2.style.display = 'none';
   subtitle3.style.display = 'none';
   subtitle4.style.display = 'inline';
}

function closesubtitle4() {
   subtitle1.style.display = 'none';
   subtitle2.style.display = 'none';
   subtitle3.style.display = 'none';
   subtitle4.style.display = 'none';
   wallet.style.display = 'inline';
   localStorage.setItem("subs_seen", "true");
   var user_id = random_id()
   localStorage.setItem("user_id", user_id)
   var data = {userID: user_id};
   console.log(data);
   fetch("/signinuser", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
         'Content-Type': 'application/json'
      },
   }).then(response => response.json())
   .then(data => {
      var status = data.status;
      if (status == 200) {
         alert("all ok");
         wallet.innerHTML = "<div style='width: 136px;'>Wallet: $ 1500</div>";
      }
      else {
         alert("not ok")
      }
   })
}

function sleep(milliseconds) {
   const date = Date.now();
   let currentDate = null;
   do {
     currentDate = Date.now();
   } while (currentDate - date < milliseconds);
 }

function changebr() {
   var bottomright = document.getElementById('bottomright');
   bottomright.innerHTML = "<h1>ANSWERED</h1>"
}

function changetl() {
   var bottomright = document.getElementById('topleft');
   bottomright.innerHTML = "<h1>ANSWERED</h1>"
}

function changejo() {
   var bottomright = document.getElementById('jumpoff');
   bottomright.innerHTML = "<h1>ANSWERED</h1>"
}

//start in the middle of the map
var x = 260;
var y = 50;
var held_directions = []; //State of which arrow keys we are holding down
var speed = 1; //How fast the character moves in pixels per frame

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
   character.setAttribute("walking", held_direction ? "true" : "false");
   
   //Limits (gives the illusion of walls)
   var leftLimit = -8;
   var rightLimit = (16 * 21.5)+8;
   var topLimit = -8 + 32;
   var bottomLimit = (16 * 10.2);

   // if touching door then go to next page
   var buildinglocxhigh = (16 * 16.5)+8;
   var buildinglocxlow = (16 * 14.5)+8;
   var buildinglocy = -8 + 32;
   if (x < buildinglocxhigh && y <= buildinglocy && x > buildinglocxlow ) {
      
      door.style.display = 'inline'
   } else {
      door.style.display = 'none'
      
      //document.querySelector("#info").submit();
      //sleep(2500);
   }

   // if touching paper show paper
   var paperlocxlow = (16 * 20.5)+8;
   var paperlocxhigh = (16 * 22)+8;
   var paperlocy = -8 + 32;
   if (x < paperlocxhigh && x > paperlocxlow && y <= paperlocy) {
      noteonwall.style.display = 'inline'
   } else {
      noteonwall.style.display = 'none'
   }

   // if touching paper show paper
    var bottomrightxlow = 
    bottomright.style.display = 'none'
   if (x > rightLimit - 16 && y > bottomLimit-16) {
      bottomright.style.display = 'inline'
   } 

   // if touching paper show paper

   if (x < leftLimit + 16 && y < topLimit+16 ) {
      topleft.style.display = 'inline'
   } else {
      topleft.style.display = 'none'
   }


   // if touching paper show paper

   if (x < -7 && y > 110 && y < 150) {
      jumpoff.style.display = 'inline'
   } else {
      jumpoff.style.display = 'none'
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