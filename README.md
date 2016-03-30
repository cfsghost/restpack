# restpack

A library to pack/unpack data for restful APIs, it aims to make developer to implement restful APIs easily.

## Installation
You can install it via NPM:
```
npm install restpack
```

## Usage

RestPack can be used on server-side and client-side both, to make developers to pack/unpack data as restful APIs.

### Get Started

__Server-side__:
```js
var RestPack = require('restpack');

var restpack = new RestPack();

// Set data which is sent out to client, RestPack will be packing it
restpack.setData({
  tags: [
    'Apple', 'Orange'
  ]
});
  
// we can send result directly if server is based on Koa
restpack.sendKoa(this);
```

If you are using browserify or webpack as build tool, you are able to use RestPack what is just like you do on server-side. 

__Client-side:__
```js
var RestPack = require('restpack');

// You might access restful API with any kinds of Ajax solutions, then getting HTTP status code and response messages.
var restpack = new RestPack(statusCode, data);

// Getting data
console.log(restpack.getData());
```

### Response For Errors

Here is an example to show how to make a response from server to client.

__Server-side__:
```js
var RestPack = require('restpack');

var restpack = new RestPack();

// HTTP status code 422 is for Validation faild, and errors we set will be appended to response message.
restpack
  .setStatus(RestPack.Status.ValidationFailed)
  .appendError('username', RestPack.Code.AlreadyExist)
  .appendError('email', RestPack.Code.Invalid)
  .appendError('name', RestPack.Code.Required);
  
// we can send result directly if server is based on Koa
restpack.sendKoa(this);
```

You can use RestPack to get status and error messages by parsing data sent from server. 

__Client-side:__
```js
var RestPack = require('restpack');

// You might access restful API with any kinds of Ajax solutions, then getting HTTP status code and response messages.
var restpack = new RestPack(statusCode, data);

// It's validation failed
if (restpack.status == RestPack.Status.ValidationFailed) {

  // Getting all field errors
  restpack.errors.forEach(function(err) {
      console.log('Field:', err.field);
      
      // Type of error
      switch(err.code) {
      RestPack.Code.Required:
        console.log('Code: Required');
      RestPack.Code.Invalid:
        console.log('Code: Invalid');
      RestPack.Code.NotExist:
        console.log('Code: NotExist');
      RestPack.Code.AlreadyExist:
        console.log('Code: AlreadyExist');
      }
  });
}
```

## Status In Common Use

Several status in common use has been supported already.
```js
RestPack.Status = {
    OK: { status: 200 },
    Created: { status: 201 },
    BadRequest: { status: 400 },
    Forbidden: { status: 403 },
    ServiceExpired: { status: 403, message: 'Service Expired' },
    AccountBlocked: { status: 403, message: 'Account Blocked' },
    PermissionDenied: { status: 403, message: 'Permission Denied' },
    NotFound: { status: 404 },
    ValidationFailed: { status: 422, message: 'Validation Failed' },
    Error: { status: 500 },
    ServiceUnavailable: { status: 503, message: 'Service Unavailable' }
};
```

## Errors In Common Use

Several error code in common use has been supported already.
```js
RestPack.Code.Required
RestPack.Code.Invalid
RestPack.Code.NotExist
RestPack.Code.AlreadyExist
```

## License
Licensed under the MIT License

## Authors
Copyright(c) 2016 Fred Chien <<cfsghost@gmail.com>>
