/**!
 * kcors - test/cors.test.js
 *
 * Copyright(c) koajs and other contributors.
 * MIT Licensed
 *
 * Authors:
 *   fengmk2 <m@fengmk2.com> (http://fengmk2.com)
 */

"use strict";

/**
 * Module dependencies.
 */

var assert = require('assert');
var koa = require('koa');
var request = require('supertest');
var cors = require('../');

describe('cors.test.js', function () {
  describe('default options', function () {
    var app = koa();
    app.use(cors());
    app.use(function* () {
      this.body = {foo: 'bar'};
    });

    it('should not set `Access-Control-Allow-Origin` when request Origin header missing', function (done) {
      request(app.listen())
      .get('/')
      .expect({foo: 'bar'})
      .expect(200, function (err, res) {
        assert(!err);
        assert(!res.headers['access-control-allow-origin']);
        done();
      });
    });

    it('should set `Access-Control-Allow-Origin` to request origin header', function (done) {
      request(app.listen())
      .get('/')
      .set('Origin', 'http://koajs.com')
      .expect('Access-Control-Allow-Origin', 'http://koajs.com')
      .expect({foo: 'bar'})
      .expect(200, done);
    });

    it('should 204 on Preflight Request', function (done) {
      request(app.listen())
      .options('/')
      .set('Origin', 'http://koajs.com')
      .set('Access-Control-Request-Method', 'PUT')
      .expect('Access-Control-Allow-Origin', 'http://koajs.com')
      .expect('Access-Control-Allow-Methods', 'GET,HEAD,PUT,POST,DELETE')
      .expect(204, done);
    });

    it('should not Preflight Request if request missing Access-Control-Request-Method', function (done) {
      request(app.listen())
      .options('/')
      .set('Origin', 'http://koajs.com')
      .expect(200, done);
    });
  });

  describe('options.origin=*', function () {
    var app = koa();
    app.use(cors({
      origin: '*'
    }));
    app.use(function* () {
      this.body = {foo: 'bar'};
    });

    it('should always set `Access-Control-Allow-Origin` to *', function (done) {
      request(app.listen())
      .get('/')
      .set('Origin', 'http://koajs.com')
      .expect('Access-Control-Allow-Origin', '*')
      .expect({foo: 'bar'})
      .expect(200, done);
    });
  });

  describe('options.origin=function', function () {
    var app = koa();
    app.use(cors({
      origin: function (ctx) {
        if (ctx.url === '/forbin') {
          return false;
        }
        return '*';
      }
    }));
    app.use(function* () {
      this.body = {foo: 'bar'};
    });

    it('should disable cors', function (done) {
      request(app.listen())
      .get('/forbin')
      .set('Origin', 'http://koajs.com')
      .expect({foo: 'bar'})
      .expect(200, function (err, res) {
        assert(!err);
        assert(!res.headers['access-control-allow-origin']);
        done();
      });
    });

    it('should set access-control-allow-origin to *', function (done) {
      request(app.listen())
      .get('/')
      .set('Origin', 'http://koajs.com')
      .expect({foo: 'bar'})
      .expect('Access-Control-Allow-Origin', '*')
      .expect(200, done);
    });
  });

  describe('options.origin=GeneratorFunction', function () {
    var app = koa();
    app.use(cors({
      origin: function* (ctx) {
        if (ctx.url === '/forbin') {
          return false;
        }
        return '*';
      }
    }));
    app.use(function* () {
      this.body = {foo: 'bar'};
    });

    it('should disable cors', function (done) {
      request(app.listen())
      .get('/forbin')
      .set('Origin', 'http://koajs.com')
      .expect({foo: 'bar'})
      .expect(200, function (err, res) {
        assert(!err);
        assert(!res.headers['access-control-allow-origin']);
        done();
      });
    });

    it('should set access-control-allow-origin to *', function (done) {
      request(app.listen())
      .get('/')
      .set('Origin', 'http://koajs.com')
      .expect({foo: 'bar'})
      .expect('Access-Control-Allow-Origin', '*')
      .expect(200, done);
    });
  });

  describe('options.exposeHeaders', function () {
    it('should Access-Control-Expose-Headers: `content-length`', function (done) {
      var app = koa();
      app.use(cors({
        exposeHeaders: 'content-length'
      }));
      app.use(function* () {
        this.body = {foo: 'bar'};
      });

      request(app.listen())
      .get('/')
      .set('Origin', 'http://koajs.com')
      .expect('Access-Control-Expose-Headers', 'content-length')
      .expect({foo: 'bar'})
      .expect(200, done);
    });

    it('should work with array', function (done) {
      var app = koa();
      app.use(cors({
        exposeHeaders: ['content-length', 'x-header']
      }));
      app.use(function* () {
        this.body = {foo: 'bar'};
      });

      request(app.listen())
      .get('/')
      .set('Origin', 'http://koajs.com')
      .expect('Access-Control-Expose-Headers', 'content-length,x-header')
      .expect({foo: 'bar'})
      .expect(200, done);
    });
  });

  describe('options.maxAge', function () {
    it('should set maxAge with number', function (done) {
      var app = koa();
      app.use(cors({
        maxAge: 3600
      }));
      app.use(function* () {
        this.body = {foo: 'bar'};
      });

      request(app.listen())
      .options('/')
      .set('Origin', 'http://koajs.com')
      .set('Access-Control-Request-Method', 'PUT')
      .expect('Access-Control-Max-Age', '3600')
      .expect(204, done);
    });

    it('should set maxAge with string', function (done) {
      var app = koa();
      app.use(cors({
        maxAge: '3600'
      }));
      app.use(function* () {
        this.body = {foo: 'bar'};
      });

      request(app.listen())
      .options('/')
      .set('Origin', 'http://koajs.com')
      .set('Access-Control-Request-Method', 'PUT')
      .expect('Access-Control-Max-Age', '3600')
      .expect(204, done);
    });

    it('should not set maxAge on simple request', function (done) {
      var app = koa();
      app.use(cors({
        maxAge: '3600'
      }));
      app.use(function* () {
        this.body = {foo: 'bar'};
      });

      request(app.listen())
      .get('/')
      .set('Origin', 'http://koajs.com')
      .expect({foo: 'bar'})
      .expect(200, function (err, res) {
        assert(!err);
        assert(!res.headers['access-control-max-age']);
        done();
      });
    });
  });

  describe('options.credentials', function () {
    var app = koa();
    app.use(cors({
      credentials: true
    }));
    app.use(function* () {
      this.body = {foo: 'bar'};
    });

    it('should enable Access-Control-Allow-Credentials on Simple request', function (done) {
      request(app.listen())
      .get('/')
      .set('Origin', 'http://koajs.com')
      .expect('Access-Control-Allow-Credentials', 'true')
      .expect({foo: 'bar'})
      .expect(200, done);
    });

    it('should enable Access-Control-Allow-Credentials on Preflight request', function (done) {
      request(app.listen())
      .options('/')
      .set('Origin', 'http://koajs.com')
      .set('Access-Control-Request-Method', 'DELETE')
      .expect('Access-Control-Allow-Credentials', 'true')
      .expect(204, done);
    });
  });

  describe('options.allowHeaders', function () {
    it('should work with allowHeaders is string', function (done) {
      var app = koa();
      app.use(cors({
        allowHeaders: 'X-PINGOTHER'
      }));
      app.use(function* () {
        this.body = {foo: 'bar'};
      });

      request(app.listen())
      .options('/')
      .set('Origin', 'http://koajs.com')
      .set('Access-Control-Request-Method', 'PUT')
      .expect('Access-Control-Allow-Headers', 'X-PINGOTHER')
      .expect(204, done);
    });

    it('should work with allowHeaders is array', function (done) {
      var app = koa();
      app.use(cors({
        allowHeaders: ['X-PINGOTHER']
      }));
      app.use(function* () {
        this.body = {foo: 'bar'};
      });

      request(app.listen())
      .options('/')
      .set('Origin', 'http://koajs.com')
      .set('Access-Control-Request-Method', 'PUT')
      .expect('Access-Control-Allow-Headers', 'X-PINGOTHER')
      .expect(204, done);
    });

    it('should set Access-Control-Allow-Headers to request access-control-request-headers header', function (done) {
      var app = koa();
      app.use(cors());
      app.use(function* () {
        this.body = {foo: 'bar'};
      });

      request(app.listen())
      .options('/')
      .set('Origin', 'http://koajs.com')
      .set('Access-Control-Request-Method', 'PUT')
      .set('access-control-request-headers', 'X-PINGOTHER')
      .expect('Access-Control-Allow-Headers', 'X-PINGOTHER')
      .expect(204, done);
    });
  });

  describe('options.allowMethods', function () {
    it('should work with allowMethods is array', function (done) {
      var app = koa();
      app.use(cors({
        allowMethods: ['GET', 'POST']
      }));
      app.use(function* () {
        this.body = {foo: 'bar'};
      });

      request(app.listen())
      .options('/')
      .set('Origin', 'http://koajs.com')
      .set('Access-Control-Request-Method', 'PUT')
      .expect('Access-Control-Allow-Methods', 'GET,POST')
      .expect(204, done);
    });

    it('should skip allowMethods', function (done) {
      var app = koa();
      app.use(cors({
        allowMethods: null
      }));
      app.use(function* () {
        this.body = {foo: 'bar'};
      });

      request(app.listen())
      .options('/')
      .set('Origin', 'http://koajs.com')
      .set('Access-Control-Request-Method', 'PUT')
      .expect(204, done);
    });
  });
});
