/**
 * Class for controlling the player
 * @prop {Game} parent - Parent controller containing the player
 * @prop {HTMLElement} el - Element of the player
 * @prop {Number} x - Position of the player on the x-axis
 * @prop {Number} width - Width of the player in pixels
 */
export default class Player {
  /**
   * Create a player controller
   * @param {Game} parent - Parent controller containing the player
   * @param {Number=0} [x] - Initial position of the player on the x-axis
   */
  constructor (parent, x = 0) {
    this.parent = parent
    this.x = x
    
    this.init()
  }

  /** Initialize the player controller */
  init () {
    this.el = document.createElement('img')
    this.el.classList.add('player')
    this.el.src = '/assets/player.png'
  }

  /** Update the player in the DOM */
  update () {
    this.el.style.left = `${this.x - this.el.clientWidth / 2}px`
  }

  /**
   * Move a specified position
   * @param {Number} x Position to move to on the x-axis
   */
  moveTo (x) {
    this.x = Math.max(x, this.el.clientWidth / 2)
    this.x = Math.min(this.x, this.parent.width - this.el.clientWidth / 2)
  }

  /**
   * Check if the player 
   * @param {Item} item Item to check collision with
   * @returns {Boolean}
   */
  collidesWith (item) {
    let itemXLow = item.x
    let itemXHigh = item.x + item.width
    let itemY = item.y + item.height / 2
    let playerXLow = this.x - this.el.clientWidth / 2
    let playerXHigh = this.x + this.el.clientWidth / 2
    let xBounds = itemXLow <= playerXHigh && itemXHigh >= playerXLow
    let yBounds = itemY >= this.parent.height - this.el.clientHeight
      && itemY - item.height / 2 <= this.parent.height - this.el.clientHeight
    return xBounds && yBounds
  }
}
