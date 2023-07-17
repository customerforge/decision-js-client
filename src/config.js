const API_URL = "https://decision-api-dot-customerforge-prod.ts.r.appspot.com/api/v1/decision/"
const SOCKET_URL = ""

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
