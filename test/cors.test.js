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

    it('should set `Access-Control-Allow-Origin` to * and `Access-Control-Allow-Methods`', function (done) {
      request(app.listen())
      .get('/')
      .expect('Access-Control-Allow-Origin', '*')
      .expect('Access-Control-Allow-Methods', 'GET,HEAD,PUT,POST,DELETE')
      .expect({foo: 'bar'})
      .expect(200, done);
    });

    it('should set `Access-Control-Allow-Origin` to request origin header', function (done) {
      request(app.listen())
      .get('/')
      .set('Origin', 'http://koajs.com')
      .expect('Access-Control-Allow-Origin', 'http://koajs.com')
      .expect({foo: 'bar'})
      .expect(200, done);
    });

    it('should 204 on OPTIONS request', function (done) {
      request(app.listen())
      .options('/')
      .expect('Access-Control-Allow-Origin', '*')
      .expect('Access-Control-Allow-Methods', 'GET,HEAD,PUT,POST,DELETE')
      .expect(204, done);
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

  describe('options.origin=false', function () {
    var app = koa();
    app.use(cors({
      origin: false
    }));
    app.use(function* () {
      this.body = {foo: 'bar'};
    });

    it('should disable cors', function (done) {
      request(app.listen())
      .get('/')
      .set('Origin', 'http://koajs.com')
      .expect({foo: 'bar'})
      .expect(200, function (err, res) {
        assert(!err);
        assert(!res.headers['access-control-allow-origin']);
        done();
      });
    });

    it('should not handle OPTIONS request', function (done) {
      request(app.listen())
      .options('/')
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
      .get('/')
      .expect('Access-Control-Max-Age', '3600')
      .expect({foo: 'bar'})
      .expect(200, done);
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
      .get('/')
      .expect('Access-Control-Max-Age', '3600')
      .expect({foo: 'bar'})
      .expect(200, done);
    });
  });

  describe('options.credentials', function () {
    it('should enable Access-Control-Allow-Credentials', function (done) {
      var app = koa();
      app.use(cors({
        credentials: true
      }));
      app.use(function* () {
        this.body = {foo: 'bar'};
      });

      request(app.listen())
      .get('/')
      .expect('Access-Control-Allow-Credentials', 'true')
      .expect({foo: 'bar'})
      .expect(200, done);
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
      .get('/')
      .expect('Access-Control-Allow-Headers', 'X-PINGOTHER')
      .expect({foo: 'bar'})
      .expect(200, done);
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
      .get('/')
      .expect('Access-Control-Allow-Headers', 'X-PINGOTHER')
      .expect({foo: 'bar'})
      .expect(200, done);
    });

    it('should set Access-Control-Allow-Headers to request access-control-request-headers header', function (done) {
      var app = koa();
      app.use(cors());
      app.use(function* () {
        this.body = {foo: 'bar'};
      });

      request(app.listen())
      .get('/')
      .set('access-control-request-headers', 'X-PINGOTHER')
      .expect('Access-Control-Allow-Headers', 'X-PINGOTHER')
      .expect({foo: 'bar'})
      .expect(200, done);
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
      .get('/')
      .expect('Access-Control-Allow-Methods', 'GET,POST')
      .expect({foo: 'bar'})
      .expect(200, done);
    });
  });
});
