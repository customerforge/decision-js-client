const Interaction = require("./interaction");

let BASE_URL = "ws://localhost:8080"

const JourneySense = function(apiKey, options = {}) {
  const {baseUrl} = options
  this.baseUrl = baseUrl || BASE_URL
  this.apiKey = apiKey
  this.profileId = null
  this.ws = null
}
JourneySense.prototype.baseUrl = function(url) {
  this.baseUrl = url
};
JourneySense.prototype._ws = function() {
  let url = new URL(this.baseUrl)
  const data = {apiKey: this.apiKey}
  if(this.profileId) {
    data.profileId = this.profileId
  }
  url.searchParams.set('q', encodeURIComponent(btoa(JSON.stringify(data))))
  if(this.ws && this.ws.url !== url.href) {
    this.ws.close()
  }
  this.ws = new WebSocket(url);
  return this.ws
}
/**
 * Track user interactions
 * @param {string} profileId - The unique user identifier in Decision
 * @param {string} event - Event title
 */
JourneySense.prototype.track = function(event) {}
/**
 * Exchange a user_id with a profile identifier
 * @param {string} user_id - The unique user identifier in your system
 * @param {Object} [properties={}] - User properties
 * @returns {string} profileId - User unique identifier in Decision
 */
JourneySense.prototype.identify = function(user_id) {
  this.profileId = 'pid'
  return this.profileId
};
/**
 * Recommendation of similar items to item_id
 * @param {string} item_id - Id of the item in your system
 * @returns {Object[]} items - An array of related items
 */
JourneySense.prototype.recommend = function(item_id) {}
/**
 * Recommendation of similar items to item_id
 * @param {string} item_id - Id of the item in your system
 * @returns {Object[]} items - An array of related items
 */
JourneySense.prototype.onJourneyCompletion = function(handler, options) {
  this._ws().addEventListener("message", (event) => {
    handler(JSON.parse(event.data))
  });
}

JourneySense.prototype.onDestinationResponse = function(handler, options) {
  this._ws().addEventListener("message", (event) => {
    handler(JSON.parse(event.data))
  });
}

const js = new JourneySense('apikey')
js.onDestinationResponse((data) => console.log(data))
js.identify('blo')
js.onDestinationResponse((data) => console.log(data))

module.exports = JourneySense
