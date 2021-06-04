const MOVE_SPEED = 200
const INVADER_SPEED = 100
let CURRENT_SPEED = INVADER_SPEED
const LEVEL_DOWN = 100
const BULLET_SPEED = 400
const TIME_LEFT = 60

layer(['obj', 'ui'], 'obj')

addLevel([
  '!^^^^^^^^^^     &',
  '!^^^^^^^^^^     &',
  '!^^^^^^^^^^     &',
  '!^^^^^^^^^^     &',
  '!               &',
  '!               &',
  '!               &',
  '!               &',
  '!               &',
  '!               &',
  '!               &',
],{
  height: 22,
  width: 30,
  '^' : [sprite('space-invader'), 'space-invader'],
  '!' : [sprite('wall'), 'left-wall'],
  '&' : [sprite('wall'), 'right-wall'],
})

// --- PLAYER ---
const player = add([
  sprite('space-ship'),
  pos(width() / 2, height()/ 2),
  origin('center')
])

keyDown('left', () => {
  player.move(-MOVE_SPEED, 0)
})

keyDown('right', () => {
  player.move(MOVE_SPEED, 0)
})

function shoot(p) {
  add([rect(6,18), 
      pos(p), 
      origin('center'), 
      color(0.5, 0.5, 1),
      'bullet'
      ])
}

keyPress('space', () => {
  shoot(player.pos.add(0,-25))
})

action('bullet', (b) => {
   b.move(0, -BULLET_SPEED)
   if (b.pos.y < 0){
     destroy(b)
   }
})

collides('bullet', 'space-invader', (b,s) => {
  camShake(4)
  destroy(b)
  destroy(s)
  score.value++
  score.text = score.value
})
// -----------------



// --- SCORE ---
const score = add([
  text('0'),
  pos(50,50),
  layer('ui'),
  {
    value:0
  },
  'score'
])

action('score', (score) => {
  if(score.value == 40){
    go('win')
  }
})
// ------------


// --- TIMER ---
const timer = add([
  text('0'),
  pos(100,50),
  scale(2),
  layer('ui'),
  {
    time: TIME_LEFT
  },
])

timer.action(() => {
  timer.time -= dt()
  timer.text = timer.time.toFixed(2)
  if (timer.time <= 0) {
    go('lose', { score: score.value} )
  }
})
// ------------



// --- SPACE INVADERS ---
action('space-invader', (s) => {
  s.move(CURRENT_SPEED, 0)
})

collides('space-invader', 'right-wall', () => {
  CURRENT_SPEED = -INVADER_SPEED
  every('space-invader', (s) => {
    s.move(0, LEVEL_DOWN)
  })
})

collides('space-invader', 'left-wall', () => {
  CURRENT_SPEED = INVADER_SPEED
  every('space-invader', (s) => {
    s.move(0, LEVEL_DOWN)
  })
})

player.overlaps('space-invader', () => {
  go('lose', {score: score.value})
})

action('space-invader', (s) => {
  if (s.pos.y >= height()/ 2){
    go('lose', {score: score.value})
  }
})
// -----------------------