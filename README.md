Lambda API Gateway support for JSON Web Tokens
==============================================

API Gateway custom Lambda function for JSON Web Token: https://jwt.io/introduction/


To Generate your own private key
--------------------------------
```
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -nodes
```


Upload to AWS
-------------

Log into the AWS console and create an empty "jwtAuthorize" function using Node.js.

Create or copy your public key as "cert.pem" in this folder.


Run

```
yarn install
yarn run deploy
```

or

```
npm install
npm run deploy-npm
```

Tie this function to your AWS API Gateway
-----------------------------------------

Go to the AWS console and choose your API gateway. Under "Resources" choose "Custom Authorizers".
Create a new authorizer with the identityToken source of `method.request.header.Authorization`
and a Token validation expression of `Bearer [^\.]+\.[^\.]+\.[^\.]+` and associate it with your newly
created jwtAuthorizer Lambda function.
