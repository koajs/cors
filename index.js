/**!
 * kcors - index.js
 *
 * Copyright(c) koajs and other contributors.
 * MIT Licensed
 *
 * Authors:
 *   fengmk2 <m@fengmk2.com> (http://fengmk2.com)
 */

'use strict';

var copy = require('copy-to');

/**
 * CORS middleware
 *
 * @param {Object} [options]
 *  - {String|Function(ctx)} origin `Access-Control-Allow-Origin`, default is '*'
 *  - {String|Array} allowMethods `Access-Control-Allow-Methods`, default is 'GET,HEAD,PUT,POST,DELETE'
 *  - {String|Array} exposeHeaders `Access-Control-Expose-Headers`
 *  - {String|Array} allowHeaders `Access-Control-Allow-Headers`
 *  - {String|Number} maxAge `Access-Control-Max-Age` in seconds
 *  - {Boolean} credentials `Access-Control-Allow-Credentials`
 * @return {Function}
 * @api public
 */
module.exports = function (options) {
  var defaults = {
    origin: function (ctx) {
      return ctx.get('origin') || '*';
    },
    allowMethods: 'GET,HEAD,PUT,POST,DELETE'
  };

  options = options || {};
  copy(defaults).to(options);

  if (Array.isArray(options.exposeHeaders)) {
    options.exposeHeaders = options.exposeHeaders.join(',');
  }

  if (Array.isArray(options.allowMethods)) {
    options.allowMethods = options.allowMethods.join(',');
  }

  if (Array.isArray(options.allowHeaders)) {
    options.allowHeaders = options.allowHeaders.join(',');
  }

  if (options.maxAge) {
    options.maxAge = String(options.maxAge);
  }

  options.credentials = !!options.credentials;

  return function* cors(next) {
    var origin = options.origin;
    if (origin === false) {
      return yield* next;
    }

    if (typeof options.origin === 'function') {
      origin = options.origin(this);
    }

    if (origin === false) {
      return yield* next;
    }

    this.set('Access-Control-Allow-Origin', origin);

    if (options.exposeHeaders) {
      this.set('Access-Control-Expose-Headers', options.exposeHeaders);
    }

    if (options.maxAge) {
      this.set('Access-Control-Max-Age', options.maxAge);
    }

    if (options.credentials === true) {
      this.set('Access-Control-Allow-Credentials', 'true');
    }

    this.set('Access-Control-Allow-Methods', options.allowMethods);

    var allowHeaders = options.allowHeaders;
    if (!allowHeaders) {
      allowHeaders = this.get('access-control-request-headers');
    }
    if (allowHeaders) {
      this.set('Access-Control-Allow-Headers', allowHeaders);
    }

    if (this.method === 'OPTIONS') {
      this.status = 204;
    } else {
      yield* next;
    }
  };
};
