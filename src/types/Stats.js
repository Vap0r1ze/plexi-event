/**
 * Class for managing game stats
 * @prop {Game} parent - Parent controller containing the stats
 * @prop {HTMLElement} el - Element of the stats display
 * @prop {Object} data - Object containing data of the specific stat
 */
export default class Stats {
  /**
   * Create a stats controller
   * @param {Game} parent - Parent controller containing the stats
   */
  constructor (parent) {
    this.parent = parent

    this._init()
  }

  /** Initialize the stats controller */
  _init () {
    this.el = document.createElement('div')
    this.el.classList.add('stats')

    this.data = {}
  }

  /** Update the stats in the DOM */
  update () {
    for (let [key, data] of Object.entries(this.data)) {
      /** @type HTMLElement */
      let el = data.el
      if (el) {
        el.querySelector('.stat-value').innerText = data.value
      } else {
        el = data.el = document.createElement('div')
        let name = document.createElement('span')
        let value = document.createElement('span')
        el.classList.add('stat')
        name.classList.add('stat-name')
        value.classList.add('stat-value')
        name.innerText = data.name
        value.innerText = data.value
        el.appendChild(name)
        el.appendChild(value)
        this.el.appendChild(el)
      }
    }
  }

  /**
   * Add a stat to the data 
   * @param {String} key - Key for accessing the stat
   * @param {String} name - Text to display
   * @param {*} value - Data to display
   */
  addStat (key, name, value) {
    if (this.data[key])
      throw new ReferenceError(`unable to add "${key}": key already exists`)
    this.data[key] = { name, value }
  }

  /**
   * Remove a stat from the data
   * @param {String} key - Key of stat to remove
   */
  removeStat (key) {
    if (!this.data[key])
      throw new ReferenceError(`unable to remove "${key}": key does not exist`)
    delete this.data[key]
  }

  /**
   * Obtain the value of a stat by key
   * @param {String} key - Key of stat value to get
   */
  getStat (key) {
    if (!this.data[key])
      throw new ReferenceError(`unable to obtain "${key}": key does not exist`)
    return this.data[key].value
  }

  /**
   * Set the value of a stat by key
   * @param {String} key - Key of value
   * @param {*} value - Value to set in the data 
   */
  setStat (key, value) {
    if (!this.data[key])
      throw new ReferenceError(`unable to set "${key}": key does not exist`)
    this.data[key].value = value
  }

  /**
   * Increment a stat
   * @param {String} key - Key of value
   * @param {Number=1} increment - Increment to add to the value 
   */
  incrStat (key, increment = 1) {
    if (!this.data[key])
      throw new ReferenceError(`unable to increment "${key}": key does not exist`)
    this.data[key].value += increment
  }
}
