import Stats from './Stats'
import Player from './Player'
import Item from './Item'
// import EventEmitter from 'eventemitter3'

/**
 * Class for controlling the game and emitting game events
 * @prop {HTMLElement} el - Element that game is mounted to
 * @prop {Number} width - Width of the game in pixels
 * @prop {Number} height - Height of the game in pixels
 * @prop {Boolean} paused - If the game is currently paused
 * @prop {Stats} stats - Stats controller for the game
 * @prop {Player} player - Player controller for the game
 * @prop {Item[]} items - All items currently on the screen
 * @prop {Number} startTime - Timestamp of which the game was started
 */
export default class Game {
  /**
   * Create a game controller
   * @param {String} el - Selector of element to mount the game
   */
  constructor (el) {
    this.el = document.querySelector(el)
    this.el._game = this

    this._init()
    this._frame()
  }

  get uptime () {
    return Date.now() - this.startTime
  }

  /** Initialize the game controller */
  _init () {
    this.startTime = Date.now()
    this.width = this.el.clientWidth
    this.height = this.el.clientHeight
    this.paused = false
    this.loseStreak = 0
    /** @type {Item[]} */
    this.items = []

    this.stats = new Stats(this)
    this.player = new Player(this, Math.round(this.width / 2))

    this.el.appendChild(this.stats.el)
    this.el.appendChild(this.player.el)

    this.stats.addStat('points', 'Points', 0)
    this.stats.addStat('lose', 'Dropped Candy', '- - -')
  }

  /** Animation frame for the game */
  _frame () {
    let lastItem = this.items[this.items.length - 1]
    if (!lastItem || lastItem.y > this.height) {
      let lastX = (lastItem && lastItem.x) || Math.floor(Math.random() * this.width)
      let newX = Math.round(Math.random() * 256 - 128 + lastX)
      this.newItem(newX, 64, 64)
    }
    for (let item of this.items) {
      let collision = this.player.collidesWith(item)
      if (item.y >= this.height || collision) {
        item.el.remove()
        this.items.splice(this.items.indexOf(item), 1)
        if (collision) {
          this.loseStreak = 0
          this.stats.incrStat('points', 5)
        } else {
          this.loseStreak++
        }
      } else {
        item.fallBy(Math.min(15 + this.uptime / 5000, item.height - 5))
        item.update()
      }
    }

    this.stats.setStat('lose', ('X'.repeat(this.loseStreak) + '-'.repeat(5 - this.loseStreak)).split('').join(' '))

    this.stats.update()
    this.player.update()

    
    if (this.loseStreak >= 5)
      return this.lose()

    if (!this.paused)
      requestAnimationFrame(this._frame.bind(this))
  }

  /** Pause the game */
  pause () {
    document.getElementById('paused').classList.add('show')
    this.paused = true
  }

  /** Resume the game */
  resume () {
    document.getElementById('paused').classList.remove('show')
    this.paused = false
    this._frame()
  }

  /**
   * Add a new item to the game
   * @param {Number} x Position on the x-axis of the item to be created
   */
  newItem (x, width, height) {
    let item = new Item(this, x, width, height)
    this.el.appendChild(item.el)
    this.items.push(item)
  }

  lose () {
    this.items.forEach(item => {
      item.el.remove()
    })
    this.items = []
    document.getElementById('paused').classList.add('show')
    document.getElementById('paused').querySelector('p').innerText = `You lost with ${this.stats.getStat('points')} points!`
  }
}
