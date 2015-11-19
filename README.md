kcors
=======

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Gittip][gittip-image]][gittip-url]
[![David deps][david-image]][david-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/kcors.svg?style=flat-square
[npm-url]: https://npmjs.org/package/kcors
[travis-image]: https://img.shields.io/travis/koajs/cors.svg?style=flat-square
[travis-url]: https://travis-ci.org/koajs/cors
[coveralls-image]: https://img.shields.io/coveralls/koajs/cors.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/koajs/cors?branch=master
[gittip-image]: https://img.shields.io/gittip/fengmk2.svg?style=flat-square
[gittip-url]: https://www.gittip.com/fengmk2/
[david-image]: https://img.shields.io/david/koajs/cors.svg?style=flat-square
[david-url]: https://david-dm.org/koajs/cors
[download-image]: https://img.shields.io/npm/dm/kcors.svg?style=flat-square
[download-url]: https://npmjs.org/package/kcors

[Cross-Origin Resource Sharing(CORS)](https://developer.mozilla.org/en/docs/Web/HTTP/Access_control_CORS) for koa

## Installation

```bash
$ npm install kcors --save
```

## Quick start

Enable cors with default options:

- origin: *
- allowMethods: GET,HEAD,PUT,POST,DELETE

```js
const Koa = require('koa');
const cors = require('kcors');

const app = new Koa();
app.use(cors());
```

## cors(options)

```js
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
```

## License

[MIT](./LICENSE)
