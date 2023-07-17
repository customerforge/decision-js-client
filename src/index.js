const Interaction = require("./interaction");
const Profile = require("./profile");
const Config = require("./config");

const motions = []

/*
document.addEventListener("mousemove", function(event) {
  const {pageX, pageY} = event
  const lastMotion = motions[motions.length - 1]
  if(!lastMotion) {
    motions.push({x: pageX, y: pageY, type: 'mousemove', timestamp: Date.now(), velocity: 0})
  }
  if(lastMotion) {
    const {x, y, timestamp} = lastMotion
    const distance = Math.sqrt(Math.pow(pageX - x, 2) + Math.pow(pageY - y, 2))
    if(distance > 30) {
      const now = Date.now()
      const velocity = distance / (now - timestamp) * 1000
      motions.push({x: pageX, y: pageY, type: 'mousemove', timestamp: now, velocity: Math.round(velocity)})
    }
  }
});
*/

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
  this.user_id = null
  if(this.socketUrl === '') {
    this.ws = null
  } else {
    this.ws = this._ws(apiKey)
  }
}

JourneySense.prototype._ws = function(apiKey, profileId) {
  let url = new URL(this.socketUrl)
  const data = {apiKey, ...(profileId) && {profileId}}
  url.searchParams.set('q', encodeURIComponent(btoa(JSON.stringify(data))))
  if(this.ws) {
    this.ws.close()
  }
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
 * @param {string} user_id - The unique user identifier in your system. If not provided, a random identifier will be generated.
 * @param {Object} segment - segment
 * @param {Object} [properties={}] - User properties
 * @returns {string} profileId - User unique identifier in Decision
 */
JourneySense.prototype.identify = async function(user_id, segment, user_properties = {}) {
  const P = new Profile();
  const profile = await P.identify(user_id || this.user_id, segment, user_properties)
  this.profileId = profile._id
  this.user_id = profile.user_id
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
  if (!this.ws) return;
  this.ws.addEventListener("message", (event) => {
    handler(JSON.parse(event.data))
  });
}
JourneySense.prototype.onDestinationResponse = function(handler, options) {
  if (!this.ws) return;
  this.ws.addEventListener("message", (event) => {
    handler(JSON.parse(event.data))
  });
}

module.exports = JourneySense
