const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576


const collisionsMap = []
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, 70 + i))
}

class Boundary {
  static width = 48
  static height = 48
  constructor({ position }) {
    this.position = position
    this.width = 48
    this.height = 48
  }

  draw() {
    c.fillStyle = 'rgba(255, 0, 0, 0.0)'
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
}

const boundaries = []
const offset = {
  x: -735,
  y: -650
}

collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y
          }
        })
      )
  })
})

const image = new Image()
image.src = './img/Pellet Town.png'
const playerImage = new Image()
playerImage.src = './img/playerDown.png'

class Sprite {
  constructor({ position, velocity, image }) {
    this.image = image
    this.position = position
  } 
  
  draw() {
    c.drawImage(this.image, this.position.x, this.position.y)
  }
}


const background = new Sprite({
  position: {

    x: offset.x,
    y: offset.y
  },
  image: image
})
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
  }


function animate() {
 window.requestAnimationFrame(animate)
  background.draw()
  boundaries.forEach((boundary) => {
    boundary.draw()
  })
  c.drawImage(
    playerImage,
    0,
    0,
    playerImage.width / 4,
    playerImage.height,
    canvas.width / 2 - playerImage.width / 4 / 2,
    canvas.height / 2 - playerImage.height / 2,
    playerImage.width / 4,
    playerImage.height
  )


  if (keys.z.pressed && lastKey === "z") background.position.y += 3;
  else if (keys.q.pressed && lastKey === "q") background.position.x += 3;
  else if (keys.s.pressed && lastKey === "s") background.position.y -= 3;
  else if (keys.d.pressed && lastKey === "d") background.position.x -= 3;
}
animate()