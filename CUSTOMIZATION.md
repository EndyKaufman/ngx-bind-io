# customization

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