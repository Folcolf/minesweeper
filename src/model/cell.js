class Cell {
  /**
   * @param {number} i
   * @param {number} j
   */
  constructor(i, j, mined) {
    this.i = i
    this.j = j
    this.neighbors = 0
    this.flags = 0
    this.flagged = false
    this.mined = mined
    this.revealed = false
  }

  /**
   * Reveal cell
   */
  reveal() {
    this.revealed = true
  }

  /**
   * Flag cell
   */
  flag() {
    this.flagged = !this.flagged
  }
}

export { Cell }
