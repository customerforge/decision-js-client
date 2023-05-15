const Interaction = require("./interaction");
const Profile = require("./profile");
const Config = require("./config");

const JourneySense = function(apiKey, options = {}) {
  const {socketUrl, baseUrl} = options
  this.socketUrl = socketUrl || Config.get('socketUrl')
  this.baseUrl = baseUrl || Config.get('baseUrl')
  this.apiKey = apiKey
  Config.set({
    apiKey,
    baseUrl: this.baseUrl,
    socketUrl: this.socketUrl
  })
  this.profileId = null
  this.ws = this._ws(apiKey)
}
JourneySense.prototype._ws = function(apiKey, profileId) {
  let url = new URL(this.socketUrl)
  const data = {apiKey, ...(profileId) && {profileId}}
  url.searchParams.set('q', encodeURIComponent(btoa(JSON.stringify(data))))
  if(this.ws) {
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
JourneySense.prototype.track = async function(event) {
  const I = new Interaction(this.profileId);
  await I.track(event)
}
/**
 * Exchange a user_id with a profile identifier
 * @param {string} user_id - The unique user identifier in your system
 * @param {string} segment_id - segment id
 * @param {Object} [properties={}] - User properties
 * @returns {string} profileId - User unique identifier in Decision
 */
JourneySense.prototype.identify = async function(user_id, segmentId, user_properties = {}) {
  const P = new Profile();
  const profile = await P.identify(user_id, segmentId, user_properties)
  this.profileId = profile._id
  this._ws(this.apiKey, this.profileId)
  return this.profileId
};
/**
 * Recommendation of similar items to item_id
 * @param {string} item_id - Id of the item in your system
 * @returns {Object[]} items - An array of related items
 */
JourneySense.prototype.recommend = function(item_id) {}
JourneySense.prototype.onJourneyCompletion = function(handler, options) {
  this.ws.addEventListener("message", (event) => {
    handler(JSON.parse(event.data))
  });
}
JourneySense.prototype.onDestinationResponse = function(handler, options) {
  this.ws.addEventListener("message", (event) => {
    handler(JSON.parse(event.data))
  });
}

module.exports = JourneySense
