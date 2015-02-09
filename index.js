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
 *  - {String|Function(ctx)} origin `Access-Control-Allow-Origin`, default is request Origin header
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
    // If the Origin header is not present terminate this set of steps. The request is outside the scope of this specification.
    var requestOrigin = this.get('Origin');
    if (!requestOrigin) {
      return yield* next;
    }

    var origin;
    if (typeof options.origin === 'function') {
      origin = options.origin(this);
      if (!origin) {
        return yield* next;
      }
    } else {
      origin = options.origin || requestOrigin;
    }

    if (this.method !== 'OPTIONS') {
      // Simple Cross-Origin Request, Actual Request, and Redirects

      this.set('Access-Control-Allow-Origin', origin);

      if (options.credentials === true) {
        this.set('Access-Control-Allow-Credentials', 'true');
      }

      if (options.exposeHeaders) {
        this.set('Access-Control-Expose-Headers', options.exposeHeaders);
      }

      yield* next;
    } else {
      // Preflight Request

      // If there is no Access-Control-Request-Method header or if parsing failed,
      // do not set any additional headers and terminate this set of steps.
      // The request is outside the scope of this specification.
      if (!this.get('Access-Control-Request-Method')) {
        // this not preflight request, ignore it
        return yield* next;
      }

      this.set('Access-Control-Allow-Origin', origin);

      if (options.credentials === true) {
        this.set('Access-Control-Allow-Credentials', 'true');
      }

      if (options.maxAge) {
        this.set('Access-Control-Max-Age', options.maxAge);
      }

      if (options.allowMethods) {
        this.set('Access-Control-Allow-Methods', options.allowMethods);
      }

      var allowHeaders = options.allowHeaders;
      if (!allowHeaders) {
        allowHeaders = this.get('Access-Control-Request-Headers');
      }
      if (allowHeaders) {
        this.set('Access-Control-Allow-Headers', allowHeaders);
      }

      this.status = 204;
    }
  };
};
