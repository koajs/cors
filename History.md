
1.3.2 / 2017-02-13
==================

  * fix: always set "Vary: Origin" header (#32)

1.3.1 / 2016-10-22
==================

  * fix: not allow origin: "*" and "credentials: true" at the same time (#24)

1.3.0 / 2016-09-26
==================

  * test: run test on node 6.x instead of 5.x
  * feat: add PATCH to default methods

1.2.1 / 2016-05-14
==================

  * fix: keepHeadersOnError won't affect OPTIONS request (#16)

1.2.0 / 2016-04-27
==================

  * feat: Keep headers after an error (#11)
  * doc: fix codecov link on readme

1.1.0 / 2016-03-07
==================

  * test: run test on node 5, 4, 0.12
  * refactor: use `yield next` instead of `yield* next`
  * feat: support to use GeneratorFunction as `options.origin`

1.0.1 / 2015-02-11
==================

 * fix: make more spec-compliant

1.0.0 / 2015-02-09
==================

 * first release
