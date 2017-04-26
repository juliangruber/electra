const electra = require('.')

// synchronous

electra(`
  return window.location.href
`)
.then(location => {
  console.log(location)
})

electra(() => {
  return window.location.href
})
.then(location => {
  console.log(location)
})

// promise

electra(() => {
  return fetch('/')
    .then(res => res.status)
})
.then(status => {
  console.log(status)
})

electra(`
  return fetch('/')
    .then(res => res.status)
`)
.then(status => {
  console.log(status)
})

// callback

electra(cb => {
  cb(null, window.location.href)
})
.then(location => {
  console.log(location)
})

// errors

electra(() => {
  throw new Error('oops')
})
.catch(err => {
  console.log('error:', err.message)
})

electra(() => {
  return fetch('https://github.com/')
    .then(res => res.status)
})
.catch(err => {
  console.log('error:', err.message)
})

electra(cb => {
  cb(new Error('oops'))
})
.catch(err => {
  console.log('error:', err.message)
})
