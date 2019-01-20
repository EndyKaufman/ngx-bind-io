import { IBindIO, NgxBindOutputsService } from 'ngx-bind-io';

export class MyNgxBindOutputsService extends NgxBindOutputsService {
  checkKeyNameToOutputBind(directive: Partial<IBindIO>, parentKey: string, key: string) {
    const keyWithFirstUpperLetter = key.length > 0 ? key.charAt(0).toUpperCase() + key.substr(1) : key;
    return (
      (parentKey === `on${keyWithFirstUpperLetter}` &&
        directive.outputs.parentKeys.indexOf(`on${keyWithFirstUpperLetter}ButtonClick`) === -1) ||
      parentKey === `on${keyWithFirstUpperLetter}ButtonClick` ||
      super.checkKeyNameToOutputBind(directive, parentKey, key)
    );
  }
}
