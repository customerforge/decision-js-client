const Api = function(constructor) {
  constructor.prototype.httpClient = async function(reqConfig) {
    try {
      const response = await fetch("http://localhost:3000/api/v1/decision/interactions/123", {
        method: "POST",
        headers: {
          "X-token": "apikey"
        },
        body: {}
      })
      return await reponse.json()
    } catch (err) {
      console.error("Error:", err);
    }
  }
  return constructor
}

module.exports = Api
