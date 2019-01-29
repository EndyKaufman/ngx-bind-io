[![Greenkeeper badge](https://badges.greenkeeper.io/EndyKaufman/ngx-bind-io.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/EndyKaufman/ngx-bind-io.svg?branch=master)](https://travis-ci.org/EndyKaufman/ngx-bind-io)
[![npm version](https://badge.fury.io/js/ngx-bind-io.svg)](https://badge.fury.io/js/ngx-bind-io)


Directives for auto binding Input() and Output() in Angular7+ application

***Attention !!! For correct work in AOT, all Inputs and Outputs ​​must be initialized, you can set them to "undefined".***

For check project for use bindIO directives, you may use [ngx-bind-io-cli](https://www.npmjs.com/package/ngx-bind-io-cli) and run:
```bash
npx ngx-bind-io-cli ./src --maxInputs=0 --maxOutputs=0
```

For check and add initialize statement, you may run:
```bash
npx ngx-bind-io-cli ./src --fix --maxInputs=0 --maxOutputs=0
```

## Example

Without auto binding inputs and outputs
```html
<component-name
    (start)="onStart()"
    [isLoading]="isLoading$ | async"
    [propA]="propA"
    [propB]="propB">
</component-name>
```

With auto binding inputs and outputs
```html
<component-name
    [bindIO]>
</component-name>
```

## Installation

```bash
npm i --save ngx-bind-io
```

## Links

[Demo](https://endykaufman.github.io/ngx-bind-io) - Demo application with ngx-bind-io.

[Stackblitz](https://stackblitz.com/edit/ngx-bind-io) - Simply sample of usage on https://stackblitz.com

## Usage

app.module.ts
```js
import { NgxBindIOModule } from 'ngx-bind-io';
import { InnerComponent } from './inner.component';
import { HostComponent } from './host.component';

@NgModule({
  ...
  imports: [
    ...
    NgxBindIOModule.forRoot(), // in components import as "NgxBindIOModule"
    ...
  ]
  declarations: [ 
    ...
    InnerComponent, 
    HostComponent 
    ...
  ],
  ...
})
export class AppModule { }
```

inner.component.ts
```js
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { BindIoInner } from 'ngx-bind-io';

@BindIoInner()
@Component({
  selector: 'inner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="isLoading">Loading... (5s)</div>
    <button (click)="onStart()">Start</button> <br />
    {{ propA }} <br />
    {{ propB }}
  `
})
export class InnerComponent {
  @Input()
  isLoading: boolean = undefined;
  @Input()
  propA = 'Prop A: not defined';
  @Input()
  propB = 'Prop B: not defined';
  @Output()
  start = new EventEmitter();
  onStart() {
    this.start.next(true);
  }
}
```

base-host.component.ts
```js
import { BehaviorSubject } from 'rxjs';

export class BaseHostComponent {
  isLoading$ = new BehaviorSubject(false);
  onStart() {
    this.isLoading$.next(true);
    setTimeout(() => this.isLoading$.next(false), 5000);
  }
}
```

host.component.ts
```js
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseHostComponent } from './base-host.component';

@Component({
  selector: 'host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <inner [bindIO]></inner>
  `
})
export class HostComponent extends BaseHostComponent {
  propA = 'Prop A: defined';
  propB = 'Prop B: defined';
}
```
## Debug

For global debug all bindings

```js
import { NgxBindIOModule } from 'ngx-bind-io';

@NgModule({
  ...
  imports: [
    ...
    NgxBindIOModule.forRoot({debug: true})
    ...
  ],
  ...
})
export class AppModule { }
```

For debug on one place
```html
<comp-name [bindIO]="{debug:true}"></comp-name>
```

## Custom rules for detect output method

my-ngx-bind-outputs.service.ts
```js
import { IBindIO, NgxBindOutputsService } from 'ngx-bind-io';

export class MyNgxBindOutputsService extends NgxBindOutputsService {
  checkKeyNameToOutputBind(directive: Partial<INgxBindIODirective>, hostKey: string, innerKey: string) {
    const outputs = directive.outputs;
    const keyWithFirstUpperLetter = innerKey.length > 0 ? innerKey.charAt(0).toUpperCase() + innerKey.substr(1) : innerKey;
    return (
      (hostKey === `on${keyWithFirstUpperLetter}` &&
        outputs.hostKeys.indexOf(`on${keyWithFirstUpperLetter}Click`) === -1 &&
        outputs.hostKeys.indexOf(`on${keyWithFirstUpperLetter}ButtonClick`) === -1) ||
      (hostKey === `on${keyWithFirstUpperLetter}Click` &&
        outputs.hostKeys.indexOf(`on${keyWithFirstUpperLetter}ButtonClick`) === -1) ||
      hostKey === `on${keyWithFirstUpperLetter}ButtonClick`
    );
  }
}

```

app.module.ts
```js
import { NgxBindOutputsService, NgxBindIOModule } from 'ngx-bind-io';
import { MyNgxBindOutputsService } from './shared/utils/my-ngx-bind-outputs.service';
import { InnerComponent } from './inner.component';
import { HostComponent } from './host.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    ...
    NgxBindIOModule,
    ...
  ],
  declarations: [ 
    AppComponent,
    InnerComponent, 
    HostComponent,
    ...
  ],
  providers: [
    ...
    { provide: NgxBindOutputsService, useClass: MyNgxBindOutputsService },
    ...
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## Default rules for detect output method

ngx-bind-outputs.service.ts
```js
export class NgxBindOutputsService {
  ...
  checkKeyNameToOutputBind(directive: Partial<INgxBindIODirective>, hostKey: string, innerKey: string) {
    const outputs = directive.outputs;
    const keyWithFirstUpperLetter = innerKey.length > 0 ? innerKey.charAt(0).toUpperCase() + innerKey.substr(1) : innerKey;
    return (
      (hostKey === `on${keyWithFirstUpperLetter}` &&
        outputs.hostKeys.indexOf(`on${keyWithFirstUpperLetter}Click`) === -1) ||
      hostKey === `on${keyWithFirstUpperLetter}Click`
    );
  }
  ...
}
```

## Default rules for detect inputs variables

ngx-bind-inputs.service.ts
```js
export class NgxBindInputsService {
  ...
  checkKeyNameToInputBind(directive: Partial<INgxBindIODirective>, hostKey: string, innerKey: string) {
    return hostKey === innerKey && hostKey[0] !== '_';
  }  
  ...
  checkKeyNameToObservableInputBind(directive: Partial<INgxBindIODirective>, hostKey: string, innerKey: string) {
    return hostKey === `${innerKey}$` && hostKey[0] !== '_';
  }
  ...
}
```

## License

MIT
