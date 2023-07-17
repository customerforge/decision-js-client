const Api = require('./api')

const Profile = function(profileId) {
  this.profileId = profileId
}
Profile.prototype.identify = async function(user_id, segment, user_properties) {
 const profile = await this.httpClient({
    url: 'profiles/identify',
    method: 'POST',
    body: {
      ...(user_id ? {user_id} : null),
      user_properties,
      ...(segment ? {segment} : null)
    }
  });
  this.profileId = profile._id
  return profile
}

module.exports = Api(Profile)
