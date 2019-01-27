# customization

## Custom rules for detect output method

my-ngx-bind-outputs.service.ts
```js
import { IBindIO, NgxBindOutputsService } from 'ngx-bind-io';

export class MyNgxBindOutputsService extends NgxBindOutputsService {
  checkKeyNameToOutputBind(directive: Partial<INgxBindIODirective>, parentKey: string, key: string) {
    const outputs = directive.outputs;
    const keyWithFirstUpperLetter = key.length > 0 ? key.charAt(0).toUpperCase() + key.substr(1) : key;
    return (
      (parentKey === `on${keyWithFirstUpperLetter}` &&
        outputs.parentKeys.indexOf(`on${keyWithFirstUpperLetter}Click`) === -1 &&
        outputs.parentKeys.indexOf(`on${keyWithFirstUpperLetter}ButtonClick`) === -1) ||
      (parentKey === `on${keyWithFirstUpperLetter}Click` &&
        outputs.parentKeys.indexOf(`on${keyWithFirstUpperLetter}ButtonClick`) === -1) ||
      parentKey === `on${keyWithFirstUpperLetter}ButtonClick`
    );
  }
}

```

app.module.ts
```js
import { NgxBindOutputsService, NgxBindIOModule } from 'ngx-bind-io';
import { MyNgxBindOutputsService } from './shared/utils/my-ngx-bind-outputs.service';
import { ChildComponent } from './child.component';
import { ParentComponent } from './parent.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    ...
    NgxBindIOModule,
    ...
  ],
  declarations: [ 
    AppComponent,
    ChildComponent, 
    ParentComponent,
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
  checkKeyNameToOutputBind(directive: Partial<INgxBindIODirective>, parentKey: string, key: string) {
    const outputs = directive.outputs;
    const keyWithFirstUpperLetter = key.length > 0 ? key.charAt(0).toUpperCase() + key.substr(1) : key;
    return (
      (parentKey === `on${keyWithFirstUpperLetter}` &&
        outputs.parentKeys.indexOf(`on${keyWithFirstUpperLetter}Click`) === -1) ||
      parentKey === `on${keyWithFirstUpperLetter}Click`
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
  checkKeyNameToInputBind(directive: Partial<INgxBindIODirective>, parentKey: string, key: string) {
    return parentKey === key && parentKey[0] !== '_';
  }  
  ...
  checkKeyNameToObservableInputBind(directive: Partial<INgxBindIODirective>, parentKey, key) {
    return parentKey === `${key}$` && parentKey[0] !== '_';
  }
  ...
}
```