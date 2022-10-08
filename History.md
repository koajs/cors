
4.0.0 / 2022-10-08
==================

**fixes**
  * [[`7358ab3`](http://github.com/koajs/cors/commit/7358ab381af6413013938f49c56ac79a7453d35c)] - fix: Calling all options even if origin header is not present (#87) (Cleber Rossi <<cleberjoserossi@gmail.com>>)

**others**
  * [[`d19090f`](http://github.com/koajs/cors/commit/d19090fc8591059895fa9c606967d3a67fd3c5b8)] - refactor: [BREAKING] drop node 8, 10, 12 support (#88) (fengmk2 <<fengmk2@gmail.com>>)

3.4.3 / 2022-10-08
==================

**others**
  * [[`208b86c`](http://github.com/koajs/cors/commit/208b86c893013d65e4479219aae0763b807bc8a6)] - Revert "fix: Calling all options even if origin header is not present (#87)" (fengmk2 <<fengmk2@gmail.com>>)

3.4.2 / 2022-10-06
==================

**fixes**
  * [[`2e8da5b`](http://github.com/koajs/cors/commit/2e8da5bd2acbc9c1adfabdea459982b3d5bdd31f)] - fix: Calling all options even if origin header is not present (#87) (Cleber Rossi <<cleberjoserossi@gmail.com>>)

3.4.1 / 2022-08-19
==================

**fixes**
  * [[`1205356`](http://github.com/koajs/cors/commit/12053567ef2caa8f4191298bc9d010017bb0f233)] - fix: must specify an origin value instead of "*" wildcard  (#85) (Tyreal Hu <<tyrealhu.fe@gmail.com>>)

3.4.0 / 2022-08-19
==================

**others**
  * [[`2cd4789`](http://github.com/koajs/cors/commit/2cd4789f66a64cd13228e7305cce9069bd2d1283)] - 🤖 TEST: Run test on Node.js 18 (#86) (fengmk2 <<fengmk2@gmail.com>>)
  * [[`ae56e05`](http://github.com/koajs/cors/commit/ae56e054cb669c73784f8a12ab6413abca6eff57)] - Create codeql-analysis.yml (fengmk2 <<fengmk2@gmail.com>>)
  * [[`c4b5d21`](http://github.com/koajs/cors/commit/c4b5d21e0cf5ab76109be65f4b7267d0ccacce81)] - refactor: use friendlier promise checking (#84) (Swain Molster <<swain.molster@gmail.com>>)
  * [[`fbe33bc`](http://github.com/koajs/cors/commit/fbe33bca26373965429356f02144507c31326cfc)] - 📖 DOC: Add privateNetworkAccess js to README (fengmk2 <<fengmk2@gmail.com>>)

3.3.0 / 2022-03-29
==================

**features**
  * [[`c279fc3`](http://github.com/koajs/cors/commit/c279fc36e60f3b2835395d15c4604fa1b284fc5f)] - feat: Add support for "Private Network Access" (#83) (Chi Ma <<55783048+cma-skedulo@users.noreply.github.com>>)

**others**
  * [[`97d9220`](http://github.com/koajs/cors/commit/97d92207ae33aa2dbdd21d218ef836183194c257)] - chore: credentials jsdoc (#80) (Jing Yi Wang <<jyw@live.de>>)

3.2.0 / 2022-03-12
==================

**features**
  * [[`134ec9b`](http://github.com/koajs/cors/commit/134ec9b54b18565cf8bba8c5e6b6639d7d7e43a3)] - feat: support secure context headers (Levi Tomes <<levi@userdevice.net>>)

**others**
  * [[`bcadb55`](http://github.com/koajs/cors/commit/bcadb5599905c28934ed3c28f866f6cdb3f77aee)] - test: run test on github action (fengmk2 <<fengmk2@gmail.com>>)

3.1.0 / 2020-05-17
==================

**features**
  * [[`013662a`](http://github.com/koajs/cors/commit/013662ae1ab65c4af230c17dfa1044609502b15b)] - feat: add support for using a function to determine whether or not to allow credentials. (#68) (mcohen75 <<mcohen75@gmail.com>>)

**others**
  * [[`da84dec`](http://github.com/koajs/cors/commit/da84dec7fa16af95d157a549bd473e7bfa4aa152)] - docs: update install script (dead-horse <<dead_horse@qq.com>>)
  * [[`eba3b44`](http://github.com/koajs/cors/commit/eba3b446055bd14b86d19dfc81d8ed5f83a8a534)] - chore: ES6 Object spread (#66) (Alpha <<AlphaWong@users.noreply.github.com>>)

3.0.0 / 2019-03-11
==================

**others**
  * [[`369d31d`](http://github.com/koajs/cors/commit/369d31db7835ed344011706f9506d45a44638017)] - refactor: use async function, support options.origin return promise (#59) (Yiyu He <<dead_horse@qq.com>>)

2.2.3 / 2018-12-19
==================

**fixes**
  * [[`12ae730`](http://github.com/koajs/cors/commit/12ae7306e8055322e6c5d29319330da52ba0e126)] - fix: set `Vary: Origin` header on error responses (#55) (Erik Fried <<erik.fried@aftonbladet.se>>)

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
