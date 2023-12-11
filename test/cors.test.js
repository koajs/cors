const assert = require('assert');
const Koa = require('koa');
const request = require('supertest');
const cors = require('..');

describe('cors.test.js', function() {
  describe('default options', function() {
    const app = new Koa();
    app.use(cors());
    app.use(function(ctx) {
      ctx.body = { foo: 'bar' };
    });

    it('should set `Access-Control-Allow-Origin` to `*` when request Origin header missing', function(done) {
      request(app.listen())
        .get('/')
        .expect({ foo: 'bar' })
        .expect('access-control-allow-origin', '*')
        .expect(200, done);
    });

    it('should set `Access-Control-Allow-Origin` to `*`', function(done) {
      request(app.listen())
        .get('/')
        .set('Origin', 'http://koajs.com')
        .expect('Access-Control-Allow-Origin', '*')
        .expect({ foo: 'bar' })
        .expect(200, done);
    });

    it('should 204 on Preflight Request', function(done) {
      request(app.listen())
        .options('/')
        .set('Origin', 'http://koajs.com')
        .set('Access-Control-Request-Method', 'PUT')
        .expect('Access-Control-Allow-Origin', '*')
        .expect('Access-Control-Allow-Methods', 'GET,HEAD,PUT,POST,DELETE,PATCH')
        .expect(204, done);
    });

    it('should not Preflight Request if request missing Access-Control-Request-Method', function(done) {
      request(app.listen())
        .options('/')
        .set('Origin', 'http://koajs.com')
        .expect(200, done);
    });

    it('should always set `Vary` to Origin', function(done) {
      request(app.listen())
        .get('/')
        .set('Origin', 'http://koajs.com')
        .expect('Vary', 'Origin')
        .expect({ foo: 'bar' })
        .expect(200, done);
    });
  });

  describe('options.origin=*', function() {
    const app = new Koa();
    app.use(cors({
      origin: '*',
    }));
    app.use(function(ctx) {
      ctx.body = { foo: 'bar' };
    });

    it('should always set `Access-Control-Allow-Origin` to *', function(done) {
      request(app.listen())
        .get('/')
        .set('Origin', 'http://koajs.com')
        .expect('Access-Control-Allow-Origin', '*')
        .expect({ foo: 'bar' })
        .expect(200, done);
    });

    it('should always set `Access-Control-Allow-Origin` to *, even if no Origin is passed on request', function(done) {
      request(app.listen())
        .get('/')
        .expect('Access-Control-Allow-Origin', '*')
        .expect({ foo: 'bar' })
        .expect(200, done);
    });
  });

  describe('options.origin set the request Origin header', function() {
    const app = new Koa();
    app.use(cors({
      origin(ctx) {
        return ctx.get('Origin') || '*';
      },
    }));
    app.use(function(ctx) {
      ctx.body = { foo: 'bar' };
    });

    it('should set `Access-Control-Allow-Origin` to request `Origin` header', function(done) {
      request(app.listen())
        .get('/')
        .set('Origin', 'http://koajs.com')
        .expect('Access-Control-Allow-Origin', 'http://koajs.com')
        .expect({ foo: 'bar' })
        .expect(200, done);
    });

    it('should set `Access-Control-Allow-Origin` to request `origin` header', function(done) {
      request(app.listen())
        .get('/')
        .set('origin', 'http://origin.koajs.com')
        .expect('Access-Control-Allow-Origin', 'http://origin.koajs.com')
        .expect({ foo: 'bar' })
        .expect(200, done);
    });

    it('should set `Access-Control-Allow-Origin` to `*`, even if no Origin is passed on request', function(done) {
      request(app.listen())
        .get('/')
        .expect('Access-Control-Allow-Origin', '*')
        .expect({ foo: 'bar' })
        .expect(200, done);
    });
  });

  describe('options.secureContext=true', function() {
    const app = new Koa();
    app.use(cors({
      secureContext: true,
    }));
    app.use(function(ctx) {
      ctx.body = { foo: 'bar' };
    });

    it('should always set `Cross-Origin-Opener-Policy` & `Cross-Origin-Embedder-Policy` on not OPTIONS', function(done) {
      request(app.listen())
        .get('/')
        .set('Origin', 'http://koajs.com')
        .expect('Cross-Origin-Opener-Policy', 'same-origin')
        .expect('Cross-Origin-Embedder-Policy', 'require-corp')
        .expect({ foo: 'bar' })
        .expect(200, done);
    });

    it('should always set `Cross-Origin-Opener-Policy` & `Cross-Origin-Embedder-Policy` on OPTIONS', function(done) {
      request(app.listen())
        .options('/')
        .set('Origin', 'http://koajs.com')
        .set('Access-Control-Request-Method', 'PUT')
        .expect('Cross-Origin-Opener-Policy', 'same-origin')
        .expect('Cross-Origin-Embedder-Policy', 'require-corp')
        .expect(204, done);
    });
  });

  describe('options.secureContext=false', function() {
    const app = new Koa();
    app.use(cors({
      secureContext: false,
    }));
    app.use(function(ctx) {
      ctx.body = { foo: 'bar' };
    });

    it('should not set `Cross-Origin-Opener-Policy` & `Cross-Origin-Embedder-Policy`', function(done) {
      request(app.listen())
        .get('/')
        .set('Origin', 'http://koajs.com')
        .expect(res => {
          assert(!('Cross-Origin-Opener-Policy' in res.headers));
          assert(!('Cross-Origin-Embedder-Policy' in res.headers));
        })
        .expect({ foo: 'bar' })
        .expect(200, done);
    });
  });

  describe('options.origin=function', function() {
    const app = new Koa();
    app.use(cors({
      origin(ctx) {
        if (ctx.url === '/forbin') {
          return false;
        }
        return '*';
      },
    }));
    app.use(function(ctx) {
      ctx.body = { foo: 'bar' };
    });

    it('should disable cors', function(done) {
      request(app.listen())
        .get('/forbin')
        .set('Origin', 'http://koajs.com')
        .expect({ foo: 'bar' })
        .expect(200, function(err, res) {
          assert(!err);
          assert(!res.headers['access-control-allow-origin']);
          done();
        });
    });

    it('should set access-control-allow-origin to *', function(done) {
      request(app.listen())
        .get('/')
        .set('Origin', 'http://koajs.com')
        .expect({ foo: 'bar' })
        .expect('Access-Control-Allow-Origin', '*')
        .expect(200, done);
    });
  });

  describe('options.origin=promise', function() {
    const app = new Koa();
    app.use(cors({
      origin(ctx) {
        return new Promise(resolve => {
          setTimeout(() => {
            if (ctx.url === '/forbin') {
              return resolve(false);
            }
            return resolve('*');
          }, 100);
        });
      },
    }));
    app.use(function(ctx) {
      ctx.body = { foo: 'bar' };
    });

    it('should disable cors', function(done) {
      request(app.listen())
        .get('/forbin')
        .set('Origin', 'http://koajs.com')
        .expect({ foo: 'bar' })
        .expect(200, function(err, res) {
          assert(!err);
          assert(!res.headers['access-control-allow-origin']);
          done();
        });
    });

    it('should set access-control-allow-origin to *', function(done) {
      request(app.listen())
        .get('/')
        .set('Origin', 'http://koajs.com')
        .expect({ foo: 'bar' })
        .expect('Access-Control-Allow-Origin', '*')
        .expect(200, done);
    });
  });

  describe('options.origin=async function', function() {
    const app = new Koa();
    app.use(cors({
      async origin(ctx) {
        if (ctx.url === '/forbin') {
          return false;
        }
        return '*';
      },
    }));
    app.use(function(ctx) {
      ctx.body = { foo: 'bar' };
    });

    it('should disable cors', function(done) {
      request(app.listen())
        .get('/forbin')
        .set('Origin', 'http://koajs.com')
        .expect({ foo: 'bar' })
        .expect(200, function(err, res) {
          assert(!err);
          assert(!res.headers['access-control-allow-origin']);
          done();
        });
    });

    it('should set access-control-allow-origin to *', function(done) {
      request(app.listen())
        .get('/')
        .set('Origin', 'http://koajs.com')
        .expect({ foo: 'bar' })
        .expect('Access-Control-Allow-Origin', '*')
        .expect(200, done);
    });

    it('behaves correctly when the return type is promise-like', function(done) {
      class WrappedPromise {
        constructor(...args) {
          this.internalPromise = new Promise(...args);
        }

        then(onFulfilled) {
          this.internalPromise.then(onFulfilled);
        }
      }

      const app = new Koa()
        .use(cors({
          origin() {
            return new WrappedPromise(resolve => {
              return resolve('*');
            });
          },
        }))
        .use(function(ctx) {
          ctx.body = { foo: 'bar' };
        });

      request(app.listen())
        .get('/')
        .set('Origin', 'http://koajs.com')
        .expect({ foo: 'bar' })
        .expect('Access-Control-Allow-Origin', '*')
        .expect(200, done);
    });
  });

  describe('options.exposeHeaders', function() {
    it('should Access-Control-Expose-Headers: `content-length`', function(done) {
      const app = new Koa();
      app.use(cors({
        exposeHeaders: 'content-length',
      }));
      app.use(function(ctx) {
        ctx.body = { foo: 'bar' };
      });

      request(app.listen())
        .get('/')
        .set('Origin', 'http://koajs.com')
        .expect('Access-Control-Expose-Headers', 'content-length')
        .expect({ foo: 'bar' })
        .expect(200, done);
    });

    it('should work with array', function(done) {
      const app = new Koa();
      app.use(cors({
        exposeHeaders: [ 'content-length', 'x-header' ],
      }));
      app.use(function(ctx) {
        ctx.body = { foo: 'bar' };
      });

      request(app.listen())
        .get('/')
        .set('Origin', 'http://koajs.com')
        .expect('Access-Control-Expose-Headers', 'content-length,x-header')
        .expect({ foo: 'bar' })
        .expect(200, done);
    });
  });

  describe('options.maxAge', function() {
    it('should set maxAge with number', function(done) {
      const app = new Koa();
      app.use(cors({
        maxAge: 3600,
      }));
      app.use(function(ctx) {
        ctx.body = { foo: 'bar' };
      });

      request(app.listen())
        .options('/')
        .set('Origin', 'http://koajs.com')
        .set('Access-Control-Request-Method', 'PUT')
        .expect('Access-Control-Max-Age', '3600')
        .expect(204, done);
    });

    it('should set maxAge with string', function(done) {
      const app = new Koa();
      app.use(cors({
        maxAge: '3600',
      }));
      app.use(function(ctx) {
        ctx.body = { foo: 'bar' };
      });

      request(app.listen())
        .options('/')
        .set('Origin', 'http://koajs.com')
        .set('Access-Control-Request-Method', 'PUT')
        .expect('Access-Control-Max-Age', '3600')
        .expect(204, done);
    });

    it('should not set maxAge on simple request', function(done) {
      const app = new Koa();
      app.use(cors({
        maxAge: '3600',
      }));
      app.use(function(ctx) {
        ctx.body = { foo: 'bar' };
      });

      request(app.listen())
        .get('/')
        .set('Origin', 'http://koajs.com')
        .expect({ foo: 'bar' })
        .expect(200, function(err, res) {
          assert(!err);
          assert(!res.headers['access-control-max-age']);
          done();
        });
    });
  });

  describe('options.credentials', function() {
    const app = new Koa();
    app.use(cors({
      credentials: true,
    }));
    app.use(function(ctx) {
      ctx.body = { foo: 'bar' };
    });

    it('should enable Access-Control-Allow-Credentials on Simple request', function(done) {
      request(app.listen())
        .get('/')
        .set('Origin', 'http://koajs.com')
        .expect('Access-Control-Allow-Credentials', 'true')
        .expect({ foo: 'bar' })
        .expect(200, done);
    });

    it('should enable Access-Control-Allow-Credentials on Preflight request', function(done) {
      request(app.listen())
        .options('/')
        .set('Origin', 'http://koajs.com')
        .set('Access-Control-Request-Method', 'DELETE')
        .expect('Access-Control-Allow-Credentials', 'true')
        .expect(204, done);
    });
  });

  describe('options.credentials unset', function() {
    const app = new Koa();
    app.use(cors());
    app.use(function(ctx) {
      ctx.body = { foo: 'bar' };
    });

    it('should disable Access-Control-Allow-Credentials on Simple request', function(done) {
      request(app.listen())
        .get('/')
        .set('Origin', 'http://koajs.com')
        .expect({ foo: 'bar' })
        .expect(200)
        .end(function(error, response) {
          if (error) return done(error);

          const header = response.headers['access-control-allow-credentials'];
          assert.equal(header, undefined, 'Access-Control-Allow-Credentials must not be set.');
          done();
        });
    });

    it('should disable Access-Control-Allow-Credentials on Preflight request', function(done) {
      request(app.listen())
        .options('/')
        .set('Origin', 'http://koajs.com')
        .set('Access-Control-Request-Method', 'DELETE')
        .expect(204)
        .end(function(error, response) {
          if (error) return done(error);

          const header = response.headers['access-control-allow-credentials'];
          assert.equal(header, undefined, 'Access-Control-Allow-Credentials must not be set.');
          done();
        });
    });
  });

  describe('options.credentials=function', function() {
    const app = new Koa();
    app.use(cors({
      credentials(ctx) {
        return ctx.url !== '/forbin';
      },
    }));
    app.use(function(ctx) {
      ctx.body = { foo: 'bar' };
    });

    it('should enable Access-Control-Allow-Credentials on Simple request', function(done) {
      request(app.listen())
        .get('/')
        .set('Origin', 'http://koajs.com')
        .expect('Access-Control-Allow-Credentials', 'true')
        .expect({ foo: 'bar' })
        .expect(200, done);
    });

    it('should enable Access-Control-Allow-Credentials on Preflight request', function(done) {
      request(app.listen())
        .options('/')
        .set('Origin', 'http://koajs.com')
        .set('Access-Control-Request-Method', 'DELETE')
        .expect('Access-Control-Allow-Credentials', 'true')
        .expect(204, done);
    });

    it('should disable Access-Control-Allow-Credentials on Simple request', function(done) {
      request(app.listen())
        .get('/forbin')
        .set('Origin', 'http://koajs.com')
        .expect({ foo: 'bar' })
        .expect(200)
        .end(function(error, response) {
          if (error) return done(error);

          const header = response.headers['access-control-allow-credentials'];
          assert.equal(header, undefined, 'Access-Control-Allow-Credentials must not be set.');
          done();
        });
    });

    it('should disable Access-Control-Allow-Credentials on Preflight request', function(done) {
      request(app.listen())
        .options('/forbin')
        .set('Origin', 'http://koajs.com')
        .set('Access-Control-Request-Method', 'DELETE')
        .expect(204)
        .end(function(error, response) {
          if (error) return done(error);

          const header = response.headers['access-control-allow-credentials'];
          assert.equal(header, undefined, 'Access-Control-Allow-Credentials must not be set.');
          done();
        });
    });
  });

  describe('options.credentials=async function', function() {
    const app = new Koa();
    app.use(cors({
      async credentials() {
        return true;
      },
    }));
    app.use(function(ctx) {
      ctx.body = { foo: 'bar' };
    });

    it('should enable Access-Control-Allow-Credentials on Simple request', function(done) {
      request(app.listen())
        .get('/')
        .set('Origin', 'http://koajs.com')
        .expect('Access-Control-Allow-Credentials', 'true')
        .expect({ foo: 'bar' })
        .expect(200, done);
    });

    it('should enable Access-Control-Allow-Credentials on Preflight request', function(done) {
      request(app.listen())
        .options('/')
        .set('Origin', 'http://koajs.com')
        .set('Access-Control-Request-Method', 'DELETE')
        .expect('Access-Control-Allow-Credentials', 'true')
        .expect(204, done);
    });

    it('behaves correctly when the return type is promise-like', function(done) {
      class WrappedPromise {
        constructor(...args) {
          this.internalPromise = new Promise(...args);
        }

        then(onFulfilled) {
          this.internalPromise.then(onFulfilled);
        }
      }

      const app = new Koa()
        .use(cors({
          credentials() {
            return new WrappedPromise(resolve => {
              resolve(true);
            });
          },
        }))
        .use(function(ctx) {
          ctx.body = { foo: 'bar' };
        });

      request(app.listen())
        .get('/')
        .set('Origin', 'http://koajs.com')
        .expect('Access-Control-Allow-Credentials', 'true')
        .expect({ foo: 'bar' })
        .expect(200, done);
    });
  });

  describe('options.allowHeaders', function() {
    it('should work with allowHeaders is string', function(done) {
      const app = new Koa();
      app.use(cors({
        allowHeaders: 'X-PINGOTHER',
      }));
      app.use(function(ctx) {
        ctx.body = { foo: 'bar' };
      });

      request(app.listen())
        .options('/')
        .set('Origin', 'http://koajs.com')
        .set('Access-Control-Request-Method', 'PUT')
        .expect('Access-Control-Allow-Headers', 'X-PINGOTHER')
        .expect(204, done);
    });

    it('should work with allowHeaders is array', function(done) {
      const app = new Koa();
      app.use(cors({
        allowHeaders: [ 'X-PINGOTHER' ],
      }));
      app.use(function(ctx) {
        ctx.body = { foo: 'bar' };
      });

      request(app.listen())
        .options('/')
        .set('Origin', 'http://koajs.com')
        .set('Access-Control-Request-Method', 'PUT')
        .expect('Access-Control-Allow-Headers', 'X-PINGOTHER')
        .expect(204, done);
    });

    it('should set Access-Control-Allow-Headers to request access-control-request-headers header', function(done) {
      const app = new Koa();
      app.use(cors());
      app.use(function(ctx) {
        ctx.body = { foo: 'bar' };
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

  describe('options.allowMethods', function() {
    it('should work with allowMethods is array', function(done) {
      const app = new Koa();
      app.use(cors({
        allowMethods: [ 'GET', 'POST' ],
      }));
      app.use(function(ctx) {
        ctx.body = { foo: 'bar' };
      });

      request(app.listen())
        .options('/')
        .set('Origin', 'http://koajs.com')
        .set('Access-Control-Request-Method', 'PUT')
        .expect('Access-Control-Allow-Methods', 'GET,POST')
        .expect(204, done);
    });

    it('should skip allowMethods', function(done) {
      const app = new Koa();
      app.use(cors({
        allowMethods: null,
      }));
      app.use(function(ctx) {
        ctx.body = { foo: 'bar' };
      });

      request(app.listen())
        .options('/')
        .set('Origin', 'http://koajs.com')
        .set('Access-Control-Request-Method', 'PUT')
        .expect(204, done);
    });
  });

  describe('options.headersKeptOnError', function() {
    it('should keep CORS headers after an error', function(done) {
      const app = new Koa();
      app.use(cors({
        origin(ctx) {
          return ctx.get('Origin') || '*';
        },
      }));
      app.use(function(ctx) {
        ctx.body = { foo: 'bar' };
        throw new Error('Whoops!');
      });

      request(app.listen())
        .get('/')
        .set('Origin', 'http://koajs.com')
        .expect('Access-Control-Allow-Origin', 'http://koajs.com')
        .expect('Vary', 'Origin')
        .expect(/Error/)
        .expect(500, done);
    });

    it('should not affect OPTIONS requests', function(done) {
      const app = new Koa();
      app.use(cors({
        origin(ctx) {
          return ctx.get('Origin') || '*';
        },
      }));
      app.use(function(ctx) {
        ctx.body = { foo: 'bar' };
        throw new Error('Whoops!');
      });

      request(app.listen())
        .options('/')
        .set('Origin', 'http://koajs.com')
        .set('Access-Control-Request-Method', 'PUT')
        .expect('Access-Control-Allow-Origin', 'http://koajs.com')
        .expect(204, done);
    });

    it('should not keep unrelated headers', function(done) {
      const app = new Koa();
      app.use(cors({
        origin(ctx) {
          return ctx.get('Origin') || '*';
        },
      }));
      app.use(function(ctx) {
        ctx.body = { foo: 'bar' };
        ctx.set('X-Example', 'Value');
        throw new Error('Whoops!');
      });

      request(app.listen())
        .get('/')
        .set('Origin', 'http://koajs.com')
        .expect('Access-Control-Allow-Origin', 'http://koajs.com')
        .expect(/Error/)
        .expect(500, function(err, res) {
          if (err) {
            return done(err);
          }
          assert(!res.headers['x-example']);
          done();
        });
    });

    it('should not keep CORS headers after an error if keepHeadersOnError is false', function(done) {
      const app = new Koa();
      app.use(cors({
        keepHeadersOnError: false,
      }));
      app.use(function(ctx) {
        ctx.body = { foo: 'bar' };
        throw new Error('Whoops!');
      });

      request(app.listen())
        .get('/')
        .set('Origin', 'http://koajs.com')
        .expect(/Error/)
        .expect(500, function(err, res) {
          if (err) {
            return done(err);
          }
          assert(!res.headers['access-control-allow-origin']);
          assert(!res.headers.vary);
          done();
        });
    });
  });

  describe('other middleware has been set `Vary` header to Accept-Encoding', function() {
    const app = new Koa();
    app.use(function(ctx, next) {
      ctx.set('Vary', 'Accept-Encoding');
      return next();
    });

    app.use(cors());

    app.use(function(ctx) {
      ctx.body = { foo: 'bar' };
    });

    it('should append `Vary` header to Origin', function(done) {
      request(app.listen())
        .get('/')
        .set('Origin', 'http://koajs.com')
        .expect('Vary', 'Accept-Encoding, Origin')
        .expect({ foo: 'bar' })
        .expect(200, done);
    });
  });

  describe('other middleware has set vary header on Error', function() {
    it('should append `Origin to other `Vary` header', function(done) {
      const app = new Koa();
      app.use(cors());

      app.use(function(ctx) {
        ctx.body = { foo: 'bar' };
        const error = new Error('Whoops!');
        error.headers = { Vary: 'Accept-Encoding' };
        throw error;
      });

      request(app.listen())
        .get('/')
        .set('Origin', 'http://koajs.com')
        .expect('Vary', 'Accept-Encoding, Origin')
        .expect(/Error/)
        .expect(500, done);
    });
    it('should preserve `Vary: *`', function(done) {
      const app = new Koa();
      app.use(cors());

      app.use(function(ctx) {
        ctx.body = { foo: 'bar' };
        const error = new Error('Whoops!');
        error.headers = { Vary: '*' };
        throw error;
      });

      request(app.listen())
        .get('/')
        .set('Origin', 'http://koajs.com')
        .expect('Vary', '*')
        .expect(/Error/)
        .expect(500, done);
    });
    it('should not append Origin` if already present in `Vary`', function(done) {
      const app = new Koa();
      app.use(cors());

      app.use(function(ctx) {
        ctx.body = { foo: 'bar' };
        const error = new Error('Whoops!');
        error.headers = { Vary: 'Origin, Accept-Encoding' };
        throw error;
      });

      request(app.listen())
        .get('/')
        .set('Origin', 'http://koajs.com')
        .expect('Vary', 'Origin, Accept-Encoding')
        .expect(/Error/)
        .expect(500, done);
    });
  });

  describe('options.privateNetworkAccess=false', function() {
    const app = new Koa();
    app.use(cors({
      privateNetworkAccess: false,
    }));

    app.use(function(ctx) {
      ctx.body = { foo: 'bar' };
    });

    it('should not set `Access-Control-Allow-Private-Network` on not OPTIONS', function(done) {
      request(app.listen())
        .get('/')
        .set('Origin', 'http://koajs.com')
        .set('Access-Control-Request-Method', 'PUT')
        .expect(res => {
          assert(!('Access-Control-Allow-Private-Network' in res.headers));
        })
        .expect(200, done);
    });

    it('should not set `Access-Control-Allow-Private-Network` if `Access-Control-Request-Private-Network` not exist on OPTIONS', function(done) {
      request(app.listen())
        .options('/')
        .set('Origin', 'http://koajs.com')
        .set('Access-Control-Request-Method', 'PUT')
        .expect(res => {
          assert(!('Access-Control-Allow-Private-Network' in res.headers));
        })
        .expect(204, done);
    });

    it('should not set `Access-Control-Allow-Private-Network` if `Access-Control-Request-Private-Network` exist on OPTIONS', function(done) {
      request(app.listen())
        .options('/')
        .set('Origin', 'http://koajs.com')
        .set('Access-Control-Request-Method', 'PUT')
        .set('Access-Control-Request-Private-Network', 'true')
        .expect(res => {
          assert(!('Access-Control-Allow-Private-Network' in res.headers));
        })
        .expect(204, done);
    });
  });

  describe('options.privateNetworkAccess=true', function() {
    const app = new Koa();
    app.use(cors({
      privateNetworkAccess: true,
    }));

    app.use(function(ctx) {
      ctx.body = { foo: 'bar' };
    });

    it('should not set `Access-Control-Allow-Private-Network` on not OPTIONS', function(done) {
      request(app.listen())
        .get('/')
        .set('Origin', 'http://koajs.com')
        .set('Access-Control-Request-Method', 'PUT')
        .expect(res => {
          assert(!('Access-Control-Allow-Private-Network' in res.headers));
        })
        .expect(200, done);
    });

    it('should not set `Access-Control-Allow-Private-Network` if `Access-Control-Request-Private-Network` not exist on OPTIONS', function(done) {
      request(app.listen())
        .options('/')
        .set('Origin', 'http://koajs.com')
        .set('Access-Control-Request-Method', 'PUT')
        .expect(res => {
          assert(!('Access-Control-Allow-Private-Network' in res.headers));
        })
        .expect(204, done);
    });

    it('should always set `Access-Control-Allow-Private-Network` if `Access-Control-Request-Private-Network` exist on OPTIONS', function(done) {
      request(app.listen())
        .options('/')
        .set('Origin', 'http://koajs.com')
        .set('Access-Control-Request-Method', 'PUT')
        .set('Access-Control-Request-Private-Network', 'true')
        .expect('Access-Control-Allow-Private-Network', 'true')
        .expect(204, done);
    });
  });

  describe('options.origin=*, and options.credentials=true', function() {
    const app = new Koa();
    app.use(cors({
      origin: '*',
      credentials: true,
    }));

    app.use(function(ctx) {
      ctx.body = { foo: 'bar' };
    });

    it('Access-Control-Allow-Origin should be request.origin, and Access-Control-Allow-Credentials should be true', function(done) {
      request(app.listen())
        .get('/')
        .set('Origin', 'http://koajs.com')
        .expect('Access-Control-Allow-Credentials', 'true')
        .expect('Access-Control-Allow-Origin', 'http://koajs.com')
        .expect({ foo: 'bar' })
        .expect(200, done);
    });
  });

  describe('options.origin=*, and options.credentials=false', function() {
    const app = new Koa();
    app.use(cors({
      origin: '*',
      credentials: false,
    }));

    app.use(function(ctx) {
      ctx.body = { foo: 'bar' };
    });

    it('Access-Control-Allow-Origin should be *', function(done) {
      request(app.listen())
        .get('/')
        .set('Origin', 'http://koajs.com')
        .expect('Access-Control-Allow-Origin', '*')
        .expect({ foo: 'bar' })
        .expect(200, done);
    });
  });
});
