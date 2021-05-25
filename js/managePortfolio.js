function setOwner(form) {
  let name = form.elements.namedItem('owner').value
  let local = JSON.parse(localStorage.getItem('cryptoslow'))
  if (!local) local = { owner: name }
  else local.owner = name
  localStorage.setItem('cryptoslow', JSON.stringify(local))
}

function deleteFromStorage(symbol) {
  local = retrieveFromStorage()
  for (let i = 0; i < local.wallet.length; i++) {
    if (local.wallet[i].symbol === symbol) {
      local.wallet.splice(i, 1)
      break
    }
  }
  localStorage.setItem('cryptoslow', JSON.stringify(local))
  displayLocalStorage()
}

function deletePreviousCryptoDivs() {
  const removeElements = (elms) => elms.forEach((el) => el.remove())
  removeElements(document.querySelectorAll('.crypto'))
}

function displayLocalStorage() {
  deletePreviousCryptoDivs()
  let anchor = document.getElementById('portfolio')
  const local = retrieveFromStorage()
  if (!local.wallet) return
  for (let el of local.wallet) {
    let div = document.createElement('div')
    div.classList.add('crypto')

    let span = document.createElement('span')
    span.classList.add('delete')
    span.textContent = 'delete'
    span.addEventListener('click', () => deleteFromStorage(el.symbol))

    let name = document.createElement('p')
    name.classList.add('name')
    name.textContent = el.name

    let qty = document.createElement('p')
    qty.classList.add('qty')
    qty.textContent = `${el.qty} ${el.symbol.toUpperCase()}`

    div.appendChild(span)
    div.appendChild(name)
    div.appendChild(qty)
    anchor.appendChild(div)
  }
  createAddCrypto()
}

function addCryptoToStorage(form) {
  let local = retrieveFromStorage()
  let newItem = {
    symbol: form.elements.namedItem('symbol').value,
    qty: form.elements.namedItem('qty').value,
    value: 0
  }
  if (!local.wallet) local.wallet = [newItem]
  else local.wallet.push(newItem)
  localStorage.setItem('cryptoslow', JSON.stringify(local))
}

function newCryptoDiv() {
  let portfolio = document.getElementById('portfolio')
  let lastChild = portfolio.lastChild
  let div = document.createElement('div')
  div.classList.add('crypto')
  div.classList.add('editing')
  div.innerHTML = `
  <form onsubmit="addCryptoToStorage(this)">
    <label for="symbol">Coin symbol</label>
    <input type="text" name="symbol" placeholder="ex: 'btc', 'eth, 'shib'..."></input>
    <label for="qty">Quantity</label>
    <input type="number" name="qty" />
    <input type="submit" value="Apply" />
  </form>
  `
  portfolio.insertBefore(div, lastChild)
}

function createAddCrypto() {
  let portfolio = document.getElementById('portfolio')
  let div = document.createElement('div')
  div.addEventListener('click', () => newCryptoDiv())
  div.classList.add('crypto')
  div.classList.add('hover')

  let para = document.createElement('p')
  para.classList.add('new')
  para.textContent = 'Add crypto'

  let plus = document.createElement('p')
  plus.classList.add('plus')
  plus.textContent = '+'

  div.appendChild(para)
  div.appendChild(plus)
  portfolio.appendChild(div)
}

displayLocalStorage()
