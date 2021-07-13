/*!
 * @koa/cors
 *
 * Copyright(c) 2021 koa.js and other contributors.
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

const vary = require('vary');

/**
 * Expose `cors()`.
 */

module.exports = cors;

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
 * @return {Function} cors middleware
 * @api public
 */
function cors({
  maxAge,
  allowMethods,
  allowHeaders,
  exposeHeaders,
  origin: _origin,
  keepHeadersOnError,
  credentials: _credentials
} = { allowMethods: 'GET,HEAD,PUT,PATCH,POST,DELETE' }) {
  if (Array.isArray(exposeHeaders)) exposeHeaders = exposeHeaders.join(',');
  if (Array.isArray(allowMethods)) allowMethods = allowMethods.join(',');
  if (Array.isArray(allowHeaders)) allowHeaders = allowHeaders.join(',');
  if (maxAge) maxAge = String(maxAge);
  keepHeadersOnError = keepHeadersOnError === undefined || !!keepHeadersOnError;

  return async (ctx, next) => {
    // If the Origin header is not present terminate this set of steps.
    // The request is outside the scope of this specification.
    const requestOrigin = ctx.get('Origin');

    if (!requestOrigin) return next();

    // Always set Vary header
    // https://github.com/rs/cors/issues/10
    ctx.vary('Origin');

    let origin;
    if (typeof _origin === 'function') {
      origin = _origin(ctx);
      if (origin instanceof Promise) origin = await origin;
      if (!origin) return next();
    } else origin = _origin || requestOrigin;

    let credentials;
    if (typeof _credentials === 'function') {
      credentials = _credentials(ctx);
      if (credentials instanceof Promise) credentials = await credentials;
    } else credentials = !!_credentials;

    const headersSet = {};

    function set(key, value) {
      ctx.set(key, value);
      headersSet[key] = value;
    }

    if (ctx.method !== 'OPTIONS' || !ctx.get('Access-Control-Request-Method')) {
      // Simple Cross-Origin Request, Actual Request, and Redirects
      set('Access-Control-Allow-Origin', origin);

      if (credentials === true) set('Access-Control-Allow-Credentials', 'true');
      if (exposeHeaders) set('Access-Control-Expose-Headers', exposeHeaders);
      if (!keepHeadersOnError) return next();

      return next()
      // .catch((err) => {
      //   const errHeadersSet = err.headers || {};
      //   const varyWithOrigin = vary.append(errHeadersSet.vary || errHeadersSet.Vary || '', 'Origin');
      //   delete errHeadersSet.Vary;

      //   err.headers = { ...errHeadersSet, ...headersSet, ...{ vary: varyWithOrigin } };
      //   throw err;
      // });
    }

    // --> OPTIONS Request <-- //
    // Preflight Request
    ctx.set('Access-Control-Allow-Origin', origin);
    if (credentials === true) ctx.set('Access-Control-Allow-Credentials', 'true');
    if (maxAge) ctx.set('Access-Control-Max-Age', maxAge);
    if (allowMethods) ctx.set('Access-Control-Allow-Methods', allowMethods);
    if (!allowHeaders) allowHeaders = ctx.get('Access-Control-Request-Headers');
    if (allowHeaders) ctx.set('Access-Control-Allow-Headers', allowHeaders);
    ctx.status = 204;
  };
}
