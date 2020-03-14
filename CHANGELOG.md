## [1.0.1](https://github.com/EndyKaufman/ngx-bind-io/compare/1.0.0...1.0.1) (2020-03-14)


### Bug Fixes

* incorrect detect components without ivy mode ([b8e5158](https://github.com/EndyKaufman/ngx-bind-io/commit/b8e5158ca2cf39fe3a47cb19906806ed2b81e614))



# [1.0.0](https://github.com/EndyKaufman/ngx-bind-io/compare/0.7.0...1.0.0) (2020-03-14)


### Features

* add support get inputs and outputs from ivy metadata ([e6e4f3d](https://github.com/EndyKaufman/ngx-bind-io/commit/e6e4f3d30b3c8b08590f18b4fa697b083b38d8a3))



# [0.7.0](https://github.com/EndyKaufman/ngx-bind-io/compare/0.6.6...0.7.0) (2020-03-13)


### Features

* update deps and all sources for it, update to Angular9 ivy ([751c243](https://github.com/EndyKaufman/ngx-bind-io/commit/751c24395b8ce77cd6bb8d30b95a4392c2922ed5))



## [0.6.6](https://github.com/EndyKaufman/ngx-bind-io/compare/0.6.5...0.6.6) (2019-04-03)


### Bug Fixes

* Add runnedFromBindIo attribute to ngOnChanges and ngOnDestroy, for detect and stop twiced run ([e870a97](https://github.com/EndyKaufman/ngx-bind-io/commit/e870a97))



## [0.6.5](https://github.com/EndyKaufman/ngx-bind-io/compare/0.6.4...0.6.5) (2019-02-11)


### Bug Fixes

* Remove enable debug with set "debug_ngx-bind-io" to "true" in localStorage ([55167fd](https://github.com/EndyKaufman/ngx-bind-io/commit/55167fd))



## [0.6.4](https://github.com/EndyKaufman/ngx-bind-io/compare/0.6.3...0.6.4) (2019-02-05)


### Bug Fixes

* Remove wrong bind value ([c933f3d](https://github.com/EndyKaufman/ngx-bind-io/commit/c933f3d))



## [0.6.3](https://github.com/EndyKaufman/ngx-bind-io/compare/0.6.2...0.6.3) (2019-02-04)


### Bug Fixes

* Update logic of binding inputs and outputs for correct work on dynamic components ([97bae1f](https://github.com/EndyKaufman/ngx-bind-io/commit/97bae1f))



## [0.6.2](https://github.com/EndyKaufman/ngx-bind-io/compare/0.6.1...0.6.2) (2019-02-04)


### Bug Fixes

* Update decorators for correct call __originalNgOnChanges__ ([a3334db](https://github.com/EndyKaufman/ngx-bind-io/commit/a3334db))



## [0.6.1](https://github.com/EndyKaufman/ngx-bind-io/compare/0.6.0...0.6.1) (2019-02-03)


### Bug Fixes

* Remove create on host component all "inputs" needed for correct work inner component, if them not exists ([d65303f](https://github.com/EndyKaufman/ngx-bind-io/commit/d65303f))



# [0.6.0](https://github.com/EndyKaufman/ngx-bind-io/compare/0.5.3...0.6.0) (2019-02-02)


### Bug Fixes

* Update words for removeKeysNotAllowedConstants ([8846b66](https://github.com/EndyKaufman/ngx-bind-io/commit/8846b66))


### Features

* Add support binding to dynamic created components ([d8f07f4](https://github.com/EndyKaufman/ngx-bind-io/commit/d8f07f4))



## [0.5.3](https://github.com/EndyKaufman/ngx-bind-io/compare/0.5.2...0.5.3) (2019-02-02)


### Bug Fixes

* Add create on host component all "inputs" needed for correct work inner component, if them not exists ([f1e8aa7](https://github.com/EndyKaufman/ngx-bind-io/commit/f1e8aa7))



## [0.5.2](https://github.com/EndyKaufman/ngx-bind-io/compare/0.5.1...0.5.2) (2019-02-01)


### Bug Fixes

* Update dependencies ([38ca240](https://github.com/EndyKaufman/ngx-bind-io/commit/38ca240))



## [0.5.1](https://github.com/EndyKaufman/ngx-bind-io/compare/0.5.0...0.5.1) (2019-01-30)


### Bug Fixes

* Add support send changes to user defined ngOnChanges methods ([7f72996](https://github.com/EndyKaufman/ngx-bind-io/commit/7f72996))



# [0.5.0](https://github.com/EndyKaufman/ngx-bind-io/compare/0.4.1...0.5.0) (2019-01-29)


### Bug Fixes

* Update naming: parent=>host, child=>inner ([ba8cb48](https://github.com/EndyKaufman/ngx-bind-io/commit/ba8cb48))


### Features

* Add BindIoInner() decorator for detect and use manual inputs, and support detect and use manual outputs ([82e8a69](https://github.com/EndyKaufman/ngx-bind-io/commit/82e8a69))



## [0.4.1](https://github.com/EndyKaufman/ngx-bind-io/compare/0.4.0...0.4.1) (2019-01-27)


### Bug Fixes

* Add includeIO and excludeIO properties for directives ([3e44423](https://github.com/EndyKaufman/ngx-bind-io/commit/3e44423))
* Change detect native attributes, remove replace ngreflect (not work in prod build) ([2e0423f](https://github.com/EndyKaufman/ngx-bind-io/commit/2e0423f))
* Update checkKeyNameToObservableInputBind for ignore private variables ([28660c2](https://github.com/EndyKaufman/ngx-bind-io/commit/28660c2))



# [0.4.0](https://github.com/EndyKaufman/ngx-bind-io/compare/0.3.0...0.4.0) (2019-01-27)


### Features

* Tested on big application, and fix: bind one host to many inner components, add ignore inputs and outputs binded with html attributes ([6fdd5b8](https://github.com/EndyKaufman/ngx-bind-io/commit/6fdd5b8))



# [0.3.0](https://github.com/EndyKaufman/ngx-bind-io/compare/0.2.0...0.3.0) (2019-01-25)


### Bug Fixes

* Remove type check of child component inputs and outputs ([c5a067c](https://github.com/EndyKaufman/ngx-bind-io/commit/c5a067c))


### Features

* Add debug options for show in dev mode warnings with not initialized inputs or outputs ([7a317e3](https://github.com/EndyKaufman/ngx-bind-io/commit/7a317e3))
* Add support set options of INgxBindIOConfig interface to directives for local debug bindings, example: ```<comp [bindIO]="{debug:true}"></comp>``` ([ba59661](https://github.com/EndyKaufman/ngx-bind-io/commit/ba59661))



# [0.2.0](https://github.com/EndyKaufman/ngx-bind-io/compare/0.1.1...0.2.0) (2019-01-21)


### Features

* Add support update inputs values on child component, when update values in parent component ([d55460e](https://github.com/EndyKaufman/ngx-bind-io/commit/d55460e))



## [0.1.1](https://github.com/EndyKaufman/ngx-bind-io/compare/0.1.0...0.1.1) (2019-01-20)


### Bug Fixes

* Add prefix for detect used inputs and outputs ([03d8acd](https://github.com/EndyKaufman/ngx-bind-io/commit/03d8acd))
* Trim used array to usedInputs and usedOutputs ([ebbfb16](https://github.com/EndyKaufman/ngx-bind-io/commit/ebbfb16))



# 0.1.0 (2019-01-20)


### Features

* First commit ([aee5f07](https://github.com/EndyKaufman/ngx-bind-io/commit/aee5f07))



