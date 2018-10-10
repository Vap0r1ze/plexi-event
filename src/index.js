import './assets/style.scss'
import Game from './types/Game'

// Create game
let game = new Game('#game')

// Window Events
window.addEventListener('resize', () => {
  setImmediate(() => {
    alert('This game does not support window resizing, you must refresh the game for it to work again')
  })
})

// Keyboard events
document.addEventListener('keyup', e => {
  if (e.keyCode === 32) {
    if (game.paused)
      game.resume()
    else
      game.pause()
  }
})

// Mouse events
document.addEventListener('mousedown', () => {
  if (game.paused)
    game.resume()
})
document.addEventListener('mousemove', e => {
  game.player.moveTo(e.pageX)
})
