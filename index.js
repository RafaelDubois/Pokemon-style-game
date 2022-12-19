const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024 
canvas.height = 576 


const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, 70 + i));
}

const battleZonesMap = [];
for (let i = 0; i < battleZonesData.length; i += 70) {
  battleZonesMap.push(battleZonesData.slice(i, 70 + i));
}

console.log(battleZonesMap);

const boundaries = [];
const offset = {
  x: -400,
  y: -645,
};

collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
  });
});

const battleZones = [];

battleZonesMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
      battleZones.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
  });
});

const foregroundImage = new Image();
foregroundImage.src = "./img/foregroundObject.png";

const image = new Image();
image.src = "./img/Poke-town.png";

const playerDownImage = new Image();
playerDownImage.src = "./img/playerDown.png";
const playerUpImage = new Image();
playerUpImage.src = "./img/playerUp.png";
const playerLeftImage = new Image();
playerLeftImage.src = "./img/playerLeft.png";
const playerRightImage = new Image();
playerRightImage.src = "./img/playerRight.png";

// Frames = how many frames in sprite player = 4

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2,
    y: canvas.height / 2 - 68 / 4,
    // 192 68
  },
  image: playerDownImage,
  frames: {
    max: 4,
    hold: 10
  },
  sprites: {
    up: playerUpImage,
    left: playerLeftImage,
    right: playerRightImage,
    down: playerDownImage,
  },
});

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: image,
});

const foreground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: foregroundImage,
});

const keys = {
  z: {
    pressed: false,
  },
  q: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

const movables = [background, ...boundaries, foreground, ...battleZones];
function rectangularCollision({ rectangle1, rectangle2 }) {
  // rectangle1 = player rectangle2 = boundary
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2. width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  );
}

const battle = {
  initiated: false,
}

function animate() {
  const animationId = window.requestAnimationFrame(animate);
  background.draw();
  boundaries.forEach((boundary) => {
    boundary.draw();
  });
  battleZones.forEach((battleZone) => {
    battleZone.draw();
  });
  player.draw();
  foreground.draw();


  let moving = true;
   player.animate= false;
// if true doesn't play the code
if (battle.initiated) return;

// Activate a battle
  if (keys.z.pressed || keys.q.pressed || keys.s.pressed || keys.d.pressed) {
    for (let i = 0; i < battleZones.length; i++) {
      const battleZone = battleZones[i];
      const overlappingArea =
        (Math.min(
          player.position.x + player.width,
          battleZone.position.x + battleZone.width
        ) -
        Math.max(player.position.x, battleZone.position.x)) *
          (Math.min(
            player.position.y + player.height,
            battleZone.position.y + battleZone.height
          ) -
        Math.max(player.position.y, battleZone.position.y));
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: battleZone,
        }) &&
        overlappingArea > (player.width * player.height) / 2 &&
        Math.random() < 0.01
      ) {
        
        console.log('activate battle')
        // deactivate animation loop
        window.cancelAnimationFrame(animationId)
        audio.Map.stop()
        audio.initBattle.play()
        audio.battle.play()
        battle.initiated = true;
        gsap.to('#overlappingDiv', {
          opacity: 1,
          repeat: 3,
          yoyo: true,
          duration: 0.75,
          onComplete() {
            gsap.to ('#overlappingDiv', {
              opacity: 1,
              duration: 0.75,
              onComplete() {
             // activate a new animation loop
                  initBattle();
                  animateBattle()
                  gsap.to ('#overlappingDiv', {
                    opacity: 0,
                    duration: 0.75,
                  })
              }
            })
          }
        })
        break
        
      }
    }
  }

  if (keys.z.pressed && lastKey === "z") {
    player.animate = true;
    player.image = player.sprites.up;

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 3,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.y += 3;
      });
  } else if (keys.q.pressed && lastKey === "q") {
    player.animate = true;
    player.image = player.sprites.left;

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x + 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        console.log("colliding");
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.x += 3;
      });
  } else if (keys.s.pressed && lastKey === "s") {
    player.animate = true;
    player.image = player.sprites.down;

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - 3,
            },
          },
        })
      ) {
        console.log("colliding");
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.y -= 3;
      });
  } else if (keys.d.pressed && lastKey === "d") {
    player.animate = true;
    player.image = player.sprites.right;

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x - 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        console.log("colliding");
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.x -= 3;
      });
  }
}
// animate();

let lastKey = "";
window.addEventListener("keydown", (e) => {
  // KeyboardEvent object in console has key property
  switch (e.key) {
    case "z":
      keys.z.pressed = true;
      lastKey = "z";
      break;
    case "q":
      keys.q.pressed = true;
      lastKey = "q";

      break;
    case "s":
      keys.s.pressed = true;
      lastKey = "s";

      break;
    case "d":
      keys.d.pressed = true;
      lastKey = "d";

      break;
  }
});

window.addEventListener("keyup", (e) => {
  // KeyboardEvent object in console has key property
  switch (e.key) {
    case "z":
      keys.z.pressed = false;

      break;
    case "q":
      keys.q.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
  }
});
let clicked= false
addEventListener('click', () => {
   if(!clicked) {
    audio.Map.play()
    clicked = true;
   }
})