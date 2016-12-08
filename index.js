'use strict'
/**
 * Lambda function to support JWT.
 * Used for authenticating API requests for API Gateway
 * as a custom authorizor:
 *
 * @see https://jwt.io/introduction/
 * @see http://docs.aws.amazon.com/apigateway/latest/developerguide/use-custom-authorizer.html
 * @author Chris Moyer <cmoyer@aci.info>
 */
const jwt = require('jsonwebtoken')
const fs = require('fs')
const cert = fs.readFileSync('cert.pem')

const generatePolicyDocument = (data, effect, resource) => {
  // Make data available to the authorizer
  let authResponse = {
    context: data,
    principalId: data.id
  }

  if (effect && resource) {
    authResponse.policyDocument = {
      Version: '2012-10-17', // default version
      Statement: [
        {
          Action: 'execute-api:Invoke', // default action
          Effect: effect,
          Resource: resource
        }
      ]
    }
  }

  return authResponse
}

/**
 * Handle requests from API Gateway
 * "event" is an object with an "authorizationToken"
 */
exports.handler = (event, context) => {
  const token = event.authorizationToken.split(' ')
  if (token[0] === 'Bearer') {
    // Token-based re-authorization
    // Verify
    jwt.verify(token[1], cert, (err, data) => {
      if (err) {
        console.log('Verification Failure', err)
        context.fail('Unauthorized')
      } else if (data && data.id) {
        console.log('LOGIN', data)
        context.succeed(generatePolicyDocument(data, 'Allow', event.methodArn))
      } else {
        console.log('Invalid User', data)
        context.fail('Unauthorized')
      }
    })
  } else {
    // Require a "Bearer" token
    console.log('Wrong authorization type', token[0])
    context.fail('Unauthorized')
  }
}
