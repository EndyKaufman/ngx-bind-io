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



