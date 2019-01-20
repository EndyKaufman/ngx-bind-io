# customization

## Custom rules for detect output method

my-ngx-bind-outputs.service.ts
```js
import { IBindIO, NgxBindOutputsService } from 'ngx-bind-io';

export class MyNgxBindOutputsService extends NgxBindOutputsService {
    checkKeyNameToOutputBind(directive: Partial<IBindIO>, parentKey: string, key: string) {
        const keyWithFirstUpperLetter = key.length > 0 ? key.charAt(0).toUpperCase() + key.substr(1) : key;
        return (parentKey === `on${keyWithFirstUpperLetter}` &&
            directive.outputs.parentKeys.indexOf(`on${keyWithFirstUpperLetter}ButtonClick`) === -1) ||
            parentKey === `on${keyWithFirstUpperLetter}ButtonClick` ||
            super.checkKeyNameToOutputBind(directive, parentKey, key);
    }
}

```

app.module.ts
```js
import { NgxBindOutputsService, NgxBindIOModule } from 'ngx-bind-io';
import { MyNgxBindOutputsService } from './shared/utils/my-ngx-bind-outputs.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    ...
    NgxBindIOModule,
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