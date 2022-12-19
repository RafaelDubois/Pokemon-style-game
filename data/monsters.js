
const monsters = {
    Emby: {
        position:{
          x:280,
          y:325
          // 280
          // 325
        },
        image: {
            src: './img/embySprite.png'
        },
        frames:{
          max: 4,
          hold:30
        },
        animate: true,
        name: 'Emby',
        attacks: [attacks.Tackle, attacks.Fireball, attacks.Energyball, attacks.Slash],
        health: 100
      },
      Draggle : {
        position:{
          x:800,
          y:100
          // 280
          // 325
        },
        image: {
            src: './img/draggleSprite.png'
        },
        frames:{
          max: 4,
          hold:30
        },
        animate: true,
        isEnemy: true,
        name: 'Draggle',
        attacks: [attacks.Tackle, attacks.Fireball],
        health: 100
      }
}