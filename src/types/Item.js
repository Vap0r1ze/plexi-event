const itemTypes = [
  'candy_corn',
  'candy_yellow',
  'candy_purple',
  'candy_long',
]

/**
 * Represents a falling item
 * @name Item
 * @prop {Game} parent - Parent controller containing the player
 * @prop {HTMLElement} el - Element of the item
 * @prop {Number} width - Width of the item
 * @prop {Number} height - Height of the item
 * @prop {Number} x - Position of the item on the x-axis
 * @prop {Number} y - Position of the item on the y-axis
 */
class Item {
  /**
   * Create an item
   * @param {Game} parent - Parent controller containing the player
   * @param {Number} x - Position of the item on the x-axis
   * @param {Number} width - Width of the item
   * @param {Number} height - Height of the item
   * @param {String} type - Type of item
   */
  constructor (parent, x, width, height) {
    this.parent = parent
    this.x = x
    this.width = width
    this.height = height

    this.init()
  }

  init () {
    this.type = itemTypes[Math.floor(Math.random() * itemTypes.length)]
    this.loaded = false

    this.x = Math.max(this.x, 0)
    this.x = Math.min(this.x, this.parent.width - this.width)

    this.el = document.createElement('img')
    this.el.onload = () => {
      this.loaded = true
    }
    this.el.style.height = `${this.height}px`
    this.el.style.width = `${this.width}px`
    this.el.src = `/assets/${this.type}.png`
    this.el.classList.add('item')
    this.el.style.left = `${this.x}px`
    this.el.style.transform = `rotate(${Math.floor(Math.random() * 360)}deg)`

    this.y = -this.height
  }

  /** Update the item in the DOM */
  update () {
    this.el.style.top = `${this.y}px`
  }

  /**
   * Move the item down a certain amount of pixels on the y-axis
   * @param {Number} n - Amount of pixels to move downwards
   */
  fallBy (n) {
    if (this.loaded)
      this.y += n
  }
}

export default Item
