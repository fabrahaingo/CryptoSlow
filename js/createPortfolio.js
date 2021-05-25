function returnEmoji(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function updateLocalStorage(newData) {
  let local = retrieveFromStorage()
  if (!local.wallet) return
  else {
    local.wallet = newData
    localStorage.setItem('cryptoslow', JSON.stringify(local))
  }
}

async function createPortfolio() {
  const positiveEmoji = ['🤑', '😎', '😋', '😍']
  const neutralEmoji = ['🤔', '😶', '🙃']
  const negativeEmoji = ['😵', '😥', '🤢', '🙄', '😤']

  const pf = await retrievePortfolio()
  console.log(pf)

  let anchor = document.getElementById('portfolio')
  for (let el of pf.details) {
    let div = document.createElement('div')
    div.classList.add('crypto')

    let emoji = document.createElement('p')
    emoji.classList.add('emoji')
    emoji.textContent = returnEmoji(negativeEmoji)

    let name = document.createElement('p')
    name.classList.add('name')
    name.textContent = el.name

    let price = document.createElement('p')
    price.classList.add('price')
    let difference = Number((el.diff * el.qty).toFixed(2))
    difference = difference.toString()
    difference = difference.replace('.', ',')
    price.textContent = `${difference} €`

    div.appendChild(emoji)
    div.appendChild(name)
    div.appendChild(price)
    anchor.appendChild(div)
  }
  return pf.details
}
