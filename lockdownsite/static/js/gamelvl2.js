var character = document.querySelector(".character");
var map = document.querySelector(".map");
var atm = document.getElementById('atm');
var camera = document.querySelector(".camera");
var exercise = document.getElementById('exercise');
var overwhelm = document.getElementById('overwhelm');
var door = document.getElementById('door');
var banktable = document.getElementById('banktable');
var atmui = document.getElementById("atmui");
var newspaper = document.getElementById("newspaper");
var wallet = document.getElementById('wallet');
var escalator = document.getElementById('escalator');
var atminfo = document.querySelector("span")
var loungetable = document.getElementById('loungetable');
user_id = localStorage.getItem("user_id");
if (!user_id) {
   localStorage.clear();
   window.location = "/game/level1";
}

function get_money() {
   fetch("/get_money", {
      method: "POST",
      body: JSON.stringify({userID: user_id}),
      headers: {
         'Content-Type': 'application/json'
      },
   }).then(response => response.json())
   .then(data => {
      var status = data.status;
      if (status == 200) {
         wallet.innerHTML = `<div style='width: 136px;'>Wallet: $ ${data.wallet}</div>`;
         atminfo.innerHTML = `Savings: $ ${data.bank}<br>Wallet: $ ${data.wallet}<br>`;
      }
      else {
         alert("not ok")
      }
   })
}

setInterval(() => {
   fetch("/apply_interest", {
      method: "POST",
      body: JSON.stringify({
         userID: user_id
      }),
      headers: {
         "Content-type": "application/json",
      }
   }).then(response => response.json())
   .then(data => {
      if (data.status == 200) {
         get_money();
      }
   })
}, 120000);

get_money();

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
      atmui.style.display = 'none'
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

    //if near lounge table show information
    var loungetablexhigh = 198;
    var loungetablexlow = 169;
    var loungetableyhigh = 105;
    var loungetableylow = 75;

    loungetable.style.display = 'none';
    if (x > loungetablexlow && x < loungetablexhigh) {
        if (y > loungetableylow && y < loungetableyhigh) {
            loungetable.style.display = 'inline';
        }
        else {
            loungetable.style.display = 'none';
        }
    }
   
   //if touching escalator go to next floor
   var escalatorxhigh = 23;
   var escalatorylow = 70;
   var escalatoryhigh = 98;

   escalator.style.display = 'none';
   if (x < escalatorxhigh) {
      if (y < escalatoryhigh && y > escalatorylow) {
         escalator.style.display = 'inline';
      }
   }

   //if touching newspapers then prompt to buy one
    
   var newspapersxlow = 27;
   var newspapersxhigh = 53;
   
   newspaper.style.display = 'none'
   if (y < 21 ) {
      if (x < newspapersxhigh) {
         if (x > newspapersxlow) {
            newspaper.style.display = 'inline'
         }
      }
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
   isPressed = true;
})
document.body.addEventListener("mouseup", () => {
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


function showATMinterface() {
   atmui.style.display = "inline";
}


function withdraw() {
   var amt = document.getElementById("amt").value;
   fetch("/bank/withdraw", {
      method: "POST",
      body: JSON.stringify({operation: 'withdraw', amt: amt, userID: localStorage.getItem("user_id")}),
      headers: {
         "Content-type": "application/json"
      },
   }).then(response => response.json())
   .then(data => {
      if (data.status == 401) {
         alert("not ok");
      }
      else {
         atminfo.innerHTML = `Savings: $ ${data.bank}<br>Wallet: $ ${data.wallet}<br>`;
         wallet.innerHTML = `<div style='width: 136px;'>Wallet: $ ${data.wallet}</div>`;
         alert("all ok");
      }
   })
}

function deposit() {
   var amt = document.getElementById("amt").value;
   fetch("/bank/deposit", {
      method: "POST",
      body: JSON.stringify({operation: 'deposit', amt: amt, userID: localStorage.getItem("user_id")}),
      headers: {
         "Content-type": "application/json"
      },
   }).then(response => response.json())
   .then(data => {
      console.log(data);
      if (data.status == 401) {
         alert("not ok");
      }
      else {
         atminfo.innerHTML = `Savings: $ ${data.bank}<br>Wallet: $ ${data.wallet}<br>`;
         wallet.innerHTML = `<div style='width: 136px;'>Wallet: $ ${data.wallet}</div>`;
         alert("all ok");
      }
   })
}