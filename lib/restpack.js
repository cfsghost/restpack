
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

	if (data) {
		this.errors = data.errors || [];

		for (var statusSymbol in RestPack.Status) {
			var status = RestPack.Status[statusSymbol];
			if (status.status != statusCode)
				continue;

			if (status.message == data.message)
				this.status = status;
				break;
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
	NotFound: { status: 404 },
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
	this.errors.push([
		{
			field: field,
			code: code
		}
	]);

	return this;
};

RestPack.prototype.getData = function() {
	return {
		message: this.status.message || httpStatus[this.status.status],
		errors: this.errors || undefined
	};
};

RestPack.prototype.sendKoa = function(koa) {
	koa.status = this.getStatusCode();
	koa.body = this.getData();

	return this;
};

module.exports = RestPack;

