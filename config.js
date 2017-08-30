/**
* Converts a string to base64
* @param   {String} string       String to be converted
* @return  {String}              Converted string
*/
const toBase64 = (string) => new Buffer(string).toString('base64')

/**
 * This is an actual copied and paste function from the Meteor OAuth package.
 * This function is only defined on the client side for the OAuth and, since the
 * config.test.js is running on the server side, it needs to be defined here to
 * complete all testing.
 */
const getStateParam = (loginStyle, credentialToken, redirectUrl) => {
  var state = {
    loginStyle: loginStyle,
    credentialToken: credentialToken,
    isCordova: Meteor.isCordova
  };

  if (loginStyle === 'redirect')
    state.redirectUrl = redirectUrl || ('' + window.location);

  // Encode base64 as not all login services URI-encode the state
  // parameter when they pass it back to us.
  // Use the 'base64' package here because 'btoa' isn't supported in IE8/9.
  return toBase64(JSON.stringify(state));
};


// Hardcoded hashes
const hashs = {
  getAuthHeader: (config) => toBase64(`${config.clientId}:${config.secret}`)
}

// Hardcoded endpoints
const endpoints = {

  // Function that builds loginUrl dynamicaly with the config object
  buildLoginUrl: (config, loginStyle, credentialToken) => (
    config.rootURL + '/oauth2/authorize?response_type=code' +
    '&client_id=' + config.clientId +
    '&redirect_uri=' + config.redirectURI + '&state=' +
    (OAuth._stateParam? OAuth._stateParam(loginStyle, credentialToken) : getStateParam(loginStyle, credentialToken))
  ),

  // Function that builds getTokens Url dynamicaly with the config object
  buildGetTokensUrl: (config) => config.rootURL + '/oauth2/token',

  // Function that builds getAccounts Url dynamicaly with the config object
  buildGetAccountsUrl: (config, accessToken) => (
    config.rootURL + "/user?access_token=" + accessToken
  )
}

const config = {
  toBase64,
  endpoints,
  hashs
}

// Exporting configs
export default config