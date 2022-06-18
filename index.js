import { Drawer } from './src/drawer.js'

const canvas = document.getElementById('board')
const body = document.querySelector('body')
const difficulty = document.getElementById('difficulty')
const reload = document.getElementById('reload')
body.oncontextmenu = (e) => {
  e.preventDefault()
  return false
}

const drawer = new Drawer(canvas)
const strDifficulty = localStorage.getItem('difficulty')
let diff

console.log(strDifficulty)

if (strDifficulty !== null) {
  diff = Number.parseInt(strDifficulty)
} else {
  diff = 2
}

const config = {
  width: diff * 5,
  height: diff * 5,
  mines: Math.pow(diff, 2) * 4,
}

drawer.init(config)

difficulty.oninput = ({ target }) => {
  const { value } = target

  difficulty.value = value
  localStorage.setItem('difficulty', value)
  if (value === diff) return
  location.reload()
}

difficulty.oninput({
  target: { value: diff },
})

reload.onclick = () => {
  location.reload()
}