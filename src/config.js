const API_URL = "http://localhost:3000/api/v1/decision/"
const SOCKET_URL = "ws://localhost:8080"

const Config = function (defaults = {}) {
  return {
    config: defaults,
    reset: function(obj = {}) {
      this.config = obj
    },
    set: function(obj) {
      this.config = {
        ...this.config,
        ...obj
      }
      return this.config
    },
    get: function(field) {
      return this.config[field]
    }
  }
}


module.exports = Config({
  baseUrl: API_URL,
  socketUrl: SOCKET_URL
})
