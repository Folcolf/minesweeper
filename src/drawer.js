import { Cell } from './model/cell.js'
import { Grid } from './model/grid.js'

class Drawer {
  /**
   * @param {HTMLElement} canvas
   */
  constructor(canvas) {
    this.canvas = canvas
  }

  /**
   * @param {Object} config
   */
  init({ width, height, mines }) {
    this.grid = new Grid(width, height, mines)
    this.canvas.width = this.grid.width * 50
    this.canvas.height = this.grid.height * 50

    this.finished = false
    this.draw()
    this.canvas.addEventListener('click', (e) => this.#eventHandler(e))
    this.canvas.addEventListener('contextmenu', (e) => this.#eventHandler(e))
  }

  /**
   * Handle click on canvas
   * 
   * @param {Event} e 
   */
  #eventHandler(e) {
    const { offsetX, offsetY } = e
    const i = Math.floor(offsetX / (this.canvas.width / this.grid.width))
    const j = Math.floor(offsetY / (this.canvas.height / this.grid.height))
    if (e.button === 0) {
      const cell = this.grid.get(i, j)
      if (cell.revealed) {
        if (cell.flags === cell.neighbors) {
          console.log(`Reveal all cells around ${cell.i}, ${cell.j}`)
          this.grid.revealAround(i, j, true)
        }
      } else if (!cell.flagged) {
        cell.reveal()
        if (cell.neighbors === 0) {
          this.grid.revealAround(i, j)
        }
      }
    } else {
      const cell = this.grid.get(i, j)
      console.log(`Flag cell ${cell.i}, ${cell.j}`)
      if (!cell.revealed) {
        cell.flag()
        this.grid.setFlagsAround(i, j, cell.flagged)
      }
    }

    if (!this.finished) {
      if (this.grid.isLost()) {
        alert('You lose!')
        this.grid.revealAll()
        this.finished = true
      }
      if (this.grid.isWon()) {
        alert('You win!')
        this.grid.revealAll()
        this.finished = true
      }
    }
    this.draw()
  }

  /**
   * Draw grid
   */
  draw() {
    console.log('Drawing...')
    const ctx = this.canvas.getContext('2d')
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    for (let i = 0; i < this.grid.width; i++) {
      for (let j = 0; j < this.grid.height; j++) {
        const cell = this.grid.get(i, j)
        this.#drawCell(ctx, cell)
      }
    }
  }

  /**
   * Draw a cell in the canvas
   *
   * @param {*} ctx
   * @param {Cell} cell
   */
  #drawCell(ctx, cell) {
    const x = (cell.i * this.canvas.width) / this.grid.width
    const y = (cell.j * this.canvas.height) / this.grid.height
    const size = this.canvas.width / this.grid.width
    // Set color depending on cell state
    if (cell.flagged) {
      ctx.fillStyle = '#ff0000'
    } else if (cell.revealed) {
      if (cell.mined) {
        ctx.fillStyle = '#000000'
      } else {
        ctx.fillStyle = '#ffffff'
      }
    } else {
      ctx.fillStyle = '#424242'
    }

    ctx.strokeRect(x, y, size, size)
    ctx.fillRect(x, y, size, size)
    if (cell.revealed && !cell.mined) {
      // Draw number of mines around
      if (cell.neighbors > 0) {
        ctx.font = '30px Arial'
        ctx.fillStyle = '#000000'
        ctx.fillText('' + cell.neighbors, x + size / 2, y + size / 2)
      }
    }
  }
}

export { Drawer }
