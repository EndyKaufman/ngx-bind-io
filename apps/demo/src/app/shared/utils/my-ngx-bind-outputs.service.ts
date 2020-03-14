import { Injectable } from '@angular/core';
import { INgxBindIODirective, NgxBindOutputsService } from 'ngx-bind-io';

@Injectable()
export class MyNgxBindOutputsService extends NgxBindOutputsService {
  checkKeyNameToOutputBind(directive: Partial<INgxBindIODirective>, hostKey: string, innerKey: string) {
    const outputs = directive.outputs;
    const keyWithFirstUpperLetter =
      innerKey.length > 0 ? innerKey.charAt(0).toUpperCase() + innerKey.substr(1) : innerKey;
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
