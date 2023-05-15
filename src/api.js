const Config = require('./config')

const Api = function(constructor) {
  constructor.prototype.httpClient = async function(reqConfig) {
    try {
      const {url, body, ...rest} = reqConfig
      const aUrl = new URL(url, Config.get('baseUrl')).href
      const response = await fetch(aUrl, {
        headers: {
          'X-API-KEY': Config.get('apiKey'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
        ...rest
      })
      return await response.json()
    } catch (err) {
      console.error("Error:", err);
      throw err
    }
  }
  return constructor
}

module.exports = Api
