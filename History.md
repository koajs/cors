
2.2.2 / 2018-07-11
==================

**others**
  * [[`019ec40`](http://github.com/koajs/cors/commit/019ec403be573177e8ed6ad3ef4077b82b5ea934)] - travis: test node@10 and drop test node@4 (#51) (fengmk2 <<fengmk2@gmail.com>>)
  * [[`6e22833`](http://github.com/koajs/cors/commit/6e22833ce125ca334b68980372065867eda892b0)] - doc: update outdated options doc (Xingan Wang <<wangxgwxg@gmail.com>>)
  * [[`c982530`](http://github.com/koajs/cors/commit/c9825308ce1c76810468bdf5a404b838206fba22)] - travis: test node@8 (jongleberry <<me@jongleberry.com>>)
  * [[`b4f65b3`](http://github.com/koajs/cors/commit/b4f65b39b558b870521e6613aee58898e88196f9)] - npm: remove  tag (jongleberry <<me@jongleberry.com>>)
  * [[`878ae9b`](http://github.com/koajs/cors/commit/878ae9b0c99fb6da8d3840e502d4968a65089e28)] - package: rename to @koa/cors (jongleberry <<me@jongleberry.com>>)

2.2.1 / 2017-02-12
==================

  * fix: always set "Vary: Origin" header (#31)

2.2.0 / 2016-09-26
==================

  * feat: add PATCH to default methods

2.1.1 / 2016-05-14
==================

  * fix: keepHeadersOnError won't affect OPTIONS request (#17)

2.1.0 / 2016-04-29
==================

  * feat: Keep headers after an error (#13)
  * chore: use eslint instead of jshint (#10)
  * test: use codecov instead of coveralls

2.0.0 / 2016-02-20
==================

  * chore: make node engines >= 4.3.1
  * doc: update example
  * test: only test on node 4+
  * refactor: src,test: update to (ctx, next) -> Promise middleware contract
  * chore: base on koa@2

1.0.1 / 2015-02-11
==================

 * fix: make more spec-compliant

1.0.0 / 2015-02-09
==================

 * first release
