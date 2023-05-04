const Api = require('./api')

const Interaction = function(profileId) {
  this.profileId = profileId
}
Interaction.prototype.track = async function(eventTitle, optionals) {
  if(!this.profileId) {
    throw new Error("ProfileId is missing")
  }
  return this.httpClient({
    url: `/interactions/${this.profileId}`,
    method: 'POST',
    data: {
    }
  });
}

module.exports = Api(Interaction)
