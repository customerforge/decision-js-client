const Api = require('./api')

const Profile = function(profileId) {
  this.profileId = profileId
}
Profile.prototype.identify = async function(user_id, segmentId, user_properties) {
  if(!user_id) {
    throw new Error("user_id is missing")
  }
 const profile = await this.httpClient({
    url: 'profiles/identify',
    method: 'POST',
    body: {
      user_id,
      user_properties,
      ...(segmentId ? {segmentId} : null)
    }
  });
  this.profileId = profile._id
  return profile
}

module.exports = Api(Profile)
