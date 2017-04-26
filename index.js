'use strict'

const run = require('electron-stream')
const stringify = require('stream-to-string')

const electra = fn => {
  const script = typeof fn === 'function'
    ? `(${fn.toString()})`
    : `(() => {${fn}})`
  const browser = run()
  setImmediate(() => {
    if (typeof fn === 'string' || fn.length === 0) {
      browser.end(`
        let out
        try {
          out = ${script}()
        } catch (err) {
          console.log(JSON.stringify({
            err: {
              stack: err.stack,
              msg: err.message
            }
          }))
          window.close()
        }
        if (out && out.then) {
          out
            .then(o => {
              console.log(JSON.stringify({ out: o }))
              window.close()
            })
            .catch(err => {
              console.log(JSON.stringify({
                err: {
                  msg: err.message,
                  stack: err.stack
                }
              }))
              window.close()
            })
        } else {
          console.log(JSON.stringify({ out }))
          window.close()
        }
      `)
    } else {
      browser.end(`
        ${script}((err, out) => {
          if (err) console.log(JSON.stringify({
            err: {
              msg: err.message,
              stack: err.stack
            }
          }))
          else console.log(JSON.stringify({
            out
          }))
          window.close()
        })
      `)
    }
  })
  return stringify(browser)
  .then(json => {
    const obj = JSON.parse(json)
    if (obj.err) {
      const err = new Error(obj.err.msg)
      err.stack = obj.err.stack
      throw err
    }
    return obj.out
  })
}

module.exports = electra
