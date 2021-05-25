function apiCall() {
  return {
    owner: 'Fabien',
    lastCheck: '2021-05-24T15:40:12.306Z',
    currencies: ['eur'],
    wallet: [
      {
        symbol: 'shib',
        value: 0.00000784,
        qty: '10000000'
      },
      {
        symbol: 'doge',
        value: 0.266931,
        qty: '200'
      },
      {
        symbol: 'cro',
        value: 0.097199,
        qty: '2850'
      },
      {
        symbol: 'cspr',
        value: 0.279167,
        qty: '100'
      }
    ]
  }
}

function retrieveFromStorage() {
  let local = localStorage.getItem('cryptoslow')
  if (!local) return { wallet: [] }
  else return JSON.parse(local)
}

function getValuesFromWallet(wallet) {
  let arr = []
  for (let el of wallet) {
    arr.push(el.symbol.toLowerCase())
  }
  return arr
}

function addValuesToDetails(values, info) {
  for (let el of info) {
    // TODO: make it work for any prefered currencies
    el.value = values[el.id].eur
  }
  return info
}

function addDiffAndQuantityToDetails(wallet, details) {
  for (let el of details) {
    let symbol = el.symbol
    for (let coin of wallet) {
      if (coin.symbol.toLowerCase() === symbol) {
        el.diff = Number((coin.value - el.value).toFixed(8))
        el.qty = Number(coin.qty)
        break
      }
    }
  }
  return details
}

async function retrieveCoinDetails(portfolio) {
  // retrieve values form wallet as array
  const values = getValuesFromWallet(portfolio.wallet)

  return await fetch('https://api.coingecko.com/api/v3/coins/list/')
    .then((raw) => raw.json())
    .then((list) => {
      let ids = []
      for (let el of list) {
        if (values.includes(el.symbol)) {
          // don't include pegged values
          if (!el.id.includes('-peg-')) ids.push({ ...el })
          // if all ids retrieved, then stop looping
          if (ids.length === values.length) return ids
        }
      }
      return ids
    })
}

async function retrieveCoinValues(values, currencies) {
  return await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${values.join(
      ','
    )}&vs_currencies=${currencies.join(',')}`
  )
    .then((raw) => raw.json())
    .then((list) => list)
}

async function retrievePortfolio() {
  const portfolio = retrieveFromStorage()
  let details = await retrieveCoinDetails(portfolio)
  const ids = details.map((el) => el.id)
  // TODO: store currency in localStorage
  let currencies = portfolio.currencies ? portfolio.currencies : ['eur']
  const values = await retrieveCoinValues(ids, currencies)
  details = addValuesToDetails(values, details)
  details = addDiffAndQuantityToDetails(portfolio.wallet, details)
  delete portfolio.wallet
  return {
    details,
    portfolio
  }
}
