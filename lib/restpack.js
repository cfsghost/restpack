
var httpStatus = {
	200: 'OK',
	201: 'Created',
	202: 'Accepted',
	204: 'No Content',
	301: 'Moved Permanently',
	302: 'Found',
	303: 'See Other',
	307: 'Temporary Redirect',
	304: 'Not Modified',
	409: 'Conflict',
	412: 'Precondition Failed',
	400: 'Bad Request',
	401: 'Unauthorizaed',
	403: 'Forbidden',
	404: 'Not Found',
	405: 'Method Not Allowed',
	406: 'Not Acceptable',
	422: 'Unprocessable Entity',
	428: 'Precondition Required',
	500: 'Internal Server Error',
	501: 'Not Implemented',
	503: 'Service Unavailable'
};

var RestPack = function(statusCode, data) {
	this.status = RestPack.Status.OK;
	this.errors = [];
	this.data = {};

	if (data) {

		switch(statusCode) {
			case RestPack.Status.OK.status:
			case RestPack.Status.Created.status:
				this.data = data;
				break;

			default:
				this.errors = data.errors || [];

				for (var statusSymbol in RestPack.Status) {
					var status = RestPack.Status[statusSymbol];
					if (status.status != statusCode)
						continue;

					if (status.message == data.message) {
						this.status = status;
						break;
					}

					if (status.default) {
						this.status = status;
					}
				}
		}
	}
};

RestPack.Status = {
	OK: { status: 200 },
	Created: { status: 201 },
	BadRequest: { status: 400 },
	Forbidden: { status: 403 },
	ServiceExpired: { status: 403, message: 'Service Expired' },
	AccountBlocked: { status: 403, message: 'Account Blocked' },
	PermissionDenied: { status: 403, message: 'Permission Denied' },
	NotFound: { status: 404, default: true },
	ValidationFailed: { status: 422, message: 'Validation Failed' },
	Error: { status: 500 },
	ServiceUnavailable: { status: 503, message: 'Service Unavailable' }
};

RestPack.Code = {
	Required: 1,
	Invalid: 2,
	NotExist: 3,
	AlreadyExist: 4
};

RestPack.prototype.setStatus = function(status) {
	this.status = status;

	return this;
};

RestPack.prototype.getStatusCode = function() {
	return this.status.status;
};

RestPack.prototype.appendError = function(field, code) {
	this.errors.push({
		field: field,
		code: code
	});

	return this;
};

RestPack.prototype.setData = function(data) {
	this.data = data;

	return this;
};

RestPack.prototype.getData = function() {

	switch(this.status) {
		case RestPack.Status.OK:
		case RestPack.Status.Created:
			return this.data;
	}

	return {
		message: this.status.message || httpStatus[this.status.status],
		errors: this.errors || undefined
	};
};

RestPack.prototype.getNormalizedData = function() {

	switch(this.status) {
		case RestPack.Status.OK:
		case RestPack.Status.Created:
			return this.data;
	}

	var errors;
	if (this.errors) {
		errors = [];
		for (var index in this.errors) {
			var err = this.errors[index];

			if (err.code) {

				// Clone
				var newErr = {};
				for (var key in err) {
					newErr[key] = err[key];
				}
				
				// Using string to replace code
				for (var codeName in RestPack.Code) {
					if (RestPack.Code[codeName] == newErr.code) {
						newErr.code = codeName;
						break;
					}
				}

				errors.push(newErr);
				continue;
			}

			// Old
			errors.push(err);
		}
	}

	return {
		message: this.status.message || httpStatus[this.status.status],
		errors: errors || undefined
	};
};

RestPack.prototype.sendKoa = function(koa) {
	koa.status = this.getStatusCode();
	koa.body = this.getData();

	return this;
};

module.exports = RestPack;

