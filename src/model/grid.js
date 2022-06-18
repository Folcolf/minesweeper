import { Cell } from '../model/cell.js'

class Grid {
  /**
   * @param {number} width
   * @param {number} height
   */
  constructor(width, height, mines) {
    this.width = width
    this.height = height
    this.grid = []
    this.init(mines)
  }

  /**
   * Initialize grid with mines
   *
   * @param {number} mines
   */
  init(mines) {
    for (let i = 0; i < this.width; i++) {
      this.grid[i] = []
      for (let j = 0; j < this.height; j++) {
        this.grid[i][j] = new Cell(i, j)
      }
    }
    this.#placeMines(mines)
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        const cell = this.grid[i][j]
        cell.neighbors = this.#getMineAround(i, j)
      }
    }
  }

  /**
   * Get cell
   *
   * @param {number} i
   * @param {number} j
   * @returns {Cell}
   */
  get(i, j) {
    return this.grid[i][j]
  }

  /**
   * Reveal all cells
   */
  revealAll() {
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        this.get(i, j).reveal()
      }
    }
  }

  /**
   * Reveal cells around a cell
   *
   * @param {number} x
   * @param {number} y
   */
  revealAround(x, y, flag) {
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if (
          x + i >= 0 &&
          x + i < this.width &&
          y + j >= 0 &&
          y + j < this.height
        ) {
          const revealedNeigbors = this.#getMineAround(x + i, y + j)
          const revealedCell = this.get(x + i, y + j)
          if (revealedCell.revealed || revealedCell.flagged) {
            continue
          }
          revealedCell.reveal()
          if (revealedNeigbors === 0) {
            this.revealAround(x + i, y + j)
          }
          if (flag && revealedCell.mined) {
            this.revealAll()
            return
          }
        }
      }
    }
  }

  /**
   * Get all cells in 1 range around a cell
   *
   * @param {number} i
   * @param {number} j
   * @returns {Array<Cell>}
   */
  #getNeighbors(i, j) {
    const neighbors = []
    for (let x = i - 1; x <= i + 1; x++) {
      for (let y = j - 1; y <= j + 1; y++) {
        if (
          x >= 0 &&
          x < this.width &&
          y >= 0 &&
          y < this.height &&
          !(x === i && y === j)
        ) {
          neighbors.push(this.get(x, y))
        }
      }
    }
    return neighbors
  }

  /**
   * Place mines randomly on the grid
   *
   * @param {number} mines
   */
  #placeMines(mines) {
    const minesPlaced = []
    while (minesPlaced.length < mines) {
      const i = Math.floor(Math.random() * this.width)
      const j = Math.floor(Math.random() * this.height)
      if (!this.grid[i][j].mined) {
        this.grid[i][j].mined = true
        minesPlaced.push(this.grid[i][j])
      }
    }
  }

  /**
   * Get number of mines in neighbors
   *
   * @param {number} i
   * @param {number} j
   * @returns {number}
   */
  #getMineAround(i, j) {
    const neighbors = this.#getNeighbors(i, j)
    return neighbors.filter((cell) => cell.mined).length
  }

  /**
   * Set number of flags around a cell
   *
   * @param {number} i
   * @param {number} j
   * @param {boolean} value
   */
  setFlagsAround(i, j, value) {
    const neighbors = this.#getNeighbors(i, j)
    neighbors.forEach((cell) => {
      if (value) {
        cell.flags++
      } else {
        cell.flags--
      }
    })
  }

  /**
   * Check if all mines are flagged
   *
   * @returns {boolean}
   */
  isWon() {
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        const cell = this.grid[i][j]
        if (cell.mined && !cell.flagged) {
          return false
        }
      }
    }
    return true
  }

  /**
   * Check if a mine is revealed
   *
   * @returns {boolean}
   */
  isLost() {
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        if (this.grid[i][j].mined && this.grid[i][j].revealed) {
          return true
        }
      }
    }
    return false
  }

  /**
   * Check if all cells are revealed
   *
   * @returns {boolean}
   */
  isAllRevealed() {
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        if (!this.grid[i][j].revealed) {
          return false
        }
      }
    }
    return true
  }
}

export { Grid }
