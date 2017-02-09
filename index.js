'use strict';

var copy = require('copy-to');

/**
 * CORS middleware
 *
 * @param {Object} [options]
 *  - {String|Function(ctx)} origin `Access-Control-Allow-Origin`, default is request Origin header
 *  - {String|Array} allowMethods `Access-Control-Allow-Methods`, default is 'GET,HEAD,PUT,POST,DELETE,PATCH'
 *  - {String|Array} exposeHeaders `Access-Control-Expose-Headers`
 *  - {String|Array} allowHeaders `Access-Control-Allow-Headers`
 *  - {String|Number} maxAge `Access-Control-Max-Age` in seconds
 *  - {Boolean} credentials `Access-Control-Allow-Credentials`
 *  - {Boolean} keepHeadersOnError Add set headers to `err.header` if an error is thrown
 * @return {Function}
 * @api public
 */
module.exports = function (options) {
  var defaults = {
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
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

  options.keepHeadersOnError = options.keepHeadersOnError === undefined || !!options.keepHeadersOnError;

  return function* cors(next) {
    // If the Origin header is not present terminate this set of steps. The request is outside the scope of this specification.
    var requestOrigin = this.get('Origin');
    if (!requestOrigin) {
      return yield next;
    }

    var origin;

    // Always set Vary header
    // https://github.com/rs/cors/issues/10
    this.vary('Origin');

    if (typeof options.origin === 'function') {
      if (options.origin.constructor.name === 'GeneratorFunction') {
        origin = yield options.origin(this);
      } else {
        origin = options.origin(this);
      }
      if (!origin) {
        return yield next;
      }
    } else {
      origin = options.origin || requestOrigin;
    }

    var headersSet = {};

    function set(self, key, value) {
      self.set(key, value);
      headersSet[key] = value;
    }

    if (this.method !== 'OPTIONS') {
      // Simple Cross-Origin Request, Actual Request, and Redirects

      set(this, 'Access-Control-Allow-Origin', origin);

      if (options.credentials === true) {
        // If the origin is set to `*`, `credentials` can't be true, so log a warning
        // and clear the access-control-allow-credentials header.
        if (origin === '*') {
          //throw 'Invalid CORS settings for route `' + this.url + '`: if `origin` is \'*\', `credentials` cannot be `true` (setting `credentials` to `false` for you).');
          this.remove('Access-Control-Allow-Credentials');
        }
        // Otherwise set the access-control-allow-credentials header to `true`.
        else {
          set(this, 'Access-Control-Allow-Credentials', 'true');
        }
      }

      if (options.exposeHeaders) {
        set(this, 'Access-Control-Expose-Headers', options.exposeHeaders);
      }

      if (!options.keepHeadersOnError) {
        return yield next;
      }

      try {
        yield next;
      } catch (err) {
        err.headers = err.headers || {};
        copy(headersSet).to(err.headers);
        throw err;
      }
    } else {
      // Preflight Request

      // If there is no Access-Control-Request-Method header or if parsing failed,
      // do not set any additional headers and terminate this set of steps.
      // The request is outside the scope of this specification.
      if (!this.get('Access-Control-Request-Method')) {
        // this not preflight request, ignore it
        return yield next;
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
