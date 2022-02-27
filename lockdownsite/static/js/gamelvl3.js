var character = document.querySelector(".character");
var map = document.querySelector(".map");
var atm = document.getElementById('atm');
var camera = document.querySelector(".camera");
var escalator = document.getElementById('escalator');
var stocktable = document.getElementById('stocktable');
var cryptotable = document.getElementById('cryptotable');
var stocksUIview = document.getElementById('stocksUIview');
var cryptoUIview = document.getElementById('cryptoUIview');
const user_id = localStorage.getItem("user_id")
if (!user_id) {
   localStorage.clear();
   window.location("/game/level1");
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

//if touching the stocks table open stocks
var stocktablexhigh = 66;
var stocktablexlow = 19;
var stocktableyhigh = 50;

//functions for buying and selling stocks
function buystock(stock) {
   amt = document.querySelector(`#${stock}`).value;
   fetch("/buy", {
      method: "POST",
      body: JSON.stringify({
         stock: stock,
         amt: amt,
         userID: user_id
      }),
      headers: {
         "Content-type": "application/json",
      }
   }).then(response => response.json())
   .then(data => {
      get_money();
   })
}

function sellstock(stock) {
// wait
}
   

setInterval(() => {
   fetch("/update", {
      method: "POST",
      body: JSON.stringify({
         msg: "update"
      }),
      headers: {
         "Content-type": "application/json",
      }
   }).then(response => response.json())
   .then(data => {
      if (data.status !== 200) {
         alert("not ok");
      }
      else {
         console.log(data);
         var inside = "";
         data.stocks.forEach((stock) => {
            var div = `<div class="stock-card" style="width: 30%; margin: 5px;">
                              <h5>${stock[0]}</h5>
                              <h3>${stock[1]}.</h3>
                              <h5>Cost of one share: $ ${stock[2]}</h5>
                              <br>
                              <div class="options">
                                 <input placeholder="no. of shares" type="number" min="0" id="${stock[0]}"><br>
                              </div>
                              <br>
                              <div class="options">
                                 <button class="btn" onclick="buystock('${stock[0]}')">Buy</button>
                              </div>
                              <br>
                              <div class="options">
                                 <button class="btn" onclick="sellstock('${stock[0]}')">Sell</button>
                              </div>
                        </div>`
            inside += div;
         })
         stocksUIview.innerHTML = inside;
         inside = "";
         data.cryptos.forEach((stock) => {
            var div = `<div class="stock-card" style="width: 30%; margin: 5px;">
                              <h5>${stock[0]}</h5>
                              <h3>${stock[1]}.</h3>
                              <h5>Cost of one share: $ ${stock[2]}</h5>
                              <br>
                              <div class="options">
                                 <input placeholder="no. of shares" type="number" min="0" id="${stock[0]}"><br>
                              </div>
                              <br>
                              <div class="options">
                                 <button class="btn" onclick="buystock('${stock[0]}')">Buy</button>
                              </div>
                              <br>
                              <div class="options">
                                 <button class="btn" onclick="sellstock('${stock[0]}')">Sell</button>
                              </div>
                        </div>`
            inside += div;
         })
         cryptoUIview.innerHTML = inside;
      }
   })
}, 30000);



//start in the middle of the map
var x = 177;
var y = 83;
var held_directions = []; //State of which arrow keys we are holding down
var speed = 1; //How fast the character moves in pixels per frame

function sleep(milliseconds) {
   const date = Date.now();
   let currentDate = null;
   do {
     currentDate = Date.now();
   } while (currentDate - date < milliseconds);
}


function showviewstocks() {
   stocksUIview.style.display = 'inline';
   stocktable.style.display = 'none';
}

function showcryptoview() {
   cryptotable.style.display = 'none';
   cryptoUIview.style.display = 'inline';
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
   var rightLimit = 206;
   var topLimit = 47;
   var bottomLimit = 134;


   //if touching escalator go to next floor
   var escalatorxlow = 185;
   var escalatorylow = 68;
   var escalatoryhigh = 98;

   escalator.style.display = 'none';
   if (x > escalatorxlow) {
      if (y < escalatoryhigh && y > escalatorylow) {
         escalator.style.display = 'inline';
      }
    }

    

    //if touching the cryptotable then open crypto ui
    var cryptotablexhigh = 145;
    var cryptotablexlow = 80;
    var cryptotableyhigh = 50;


    if (y < cryptotableyhigh && x > cryptotablexlow && x < cryptotablexhigh) {

      cryptotable.style.display = 'inline'

      } else {
      cryptotable.style.display = 'none';
      cryptoUIview.style.display = 'none';
        
    }

    if (x > 19 && x < 66 && y < 50) {
        stocktable.style.display = 'inline';
    } else {
        stocksUIview.style.display = 'none';
        stocktable.style.display = 'none';
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
      //banktable.style.display = 'inline';
   } else {
      //banktable.style.display = 'none';
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
      body: JSON.stringify({operation: withdraw, amt: amt, userID: localStorage.getItem("user_id")}),
      headers: {
         "Content-type": "application/json"
      },
   }).then(response => response.json())
   .then(data => console.log(data))
}

function deposit() {
   var amt = document.getElementById("amt").value;
   fetch("/bank/deposit", {
      method: "POST",
      body: JSON.stringify({operation: "deposit", amt: amt}),
      headers: {
         "Content-type": "application/json"
      },
   }).then(response => response.json())
   .then(data => console.log(data))
}