if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
    })
  }
  
  
  axios.get('/api/users/transaction', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('user')}`
    }
  })
    .then(({ data: user }) => {
      document.getElementById('username').textContent = `Welcome ${user.username}!`
  
      user.items.forEach(item => {
        let itemElem = document.createElement('li')
        itemElem.className = item.isDone ? 'list-group-item list-group-item-success' : 'list-group-item'
        itemElem.textContent = item.text
        document.getElementById('items').append(itemElem)
      })
    })
    .catch(err => {
      console.error(err)
      // window.location = '/auth.html'
    })
  
    document.getElementById('addItem').addEventListener('click', event => {
      event.preventDefault()
  
      axios.post('/api/transaction', {
        text: document.getElementById('item').value,
        isDone: false
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('user')}`
        }
      })
        .then(({ data: item }) => {
          let itemElem = document.createElement('li')
          itemElem.className = item.isDone ? 'list-group-item list-group-item-success' : 'list-group-item'
          itemElem.textContent = item.text
          document.getElementById('items').append(itemElem)
          document.getElementById('item').value = ''
        })
        .catch(err => {
          console.error(err)
          saveItem({
            text: document.getElementById('item').value,
            isDone: false
          })
        })
    })
  
    document.getElementById('signOut').addEventListener('click', event => {
      localStorage.removeItem('user')
      window.location = '/auth.html'
    })