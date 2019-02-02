import { ChangeDetectionStrategy, Component } from '@angular/core';
@Component({
  selector: 'basic-page',
  templateUrl: './basic-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicPageComponent {
  ts = {
    'bind-input': require('!!raw-loader?lang=typescript!../../basics/bind-input.component.ts'),
    'bind-input-with-exclude': require('!!raw-loader?lang=typescript!../../basics/bind-input-with-exclude.component.ts'),
    'bind-input-with-include': require('!!raw-loader?lang=typescript!../../basics/bind-input-with-include.component.ts'),
    'bind-input-with-deep-inherits': require('!!raw-loader?lang=typescript!../../basics/bind-input-with-deep-inherits.component.ts'),
    'bind-io-with-mixins': require('!!raw-loader?lang=typescript!../../basics/bind-io-with-mixins.component.ts'),
    'bind-output': require('!!raw-loader?lang=typescript!../../basics/bind-output.component.ts'),
    'bind-output-with-click': require('!!raw-loader?lang=typescript!../../basics/bind-output-with-click.component.ts'),
    'bind-io': require('!!raw-loader?lang=typescript!../../basics/bind-io.component.ts'),
    'bind-io-with-manual': require('!!raw-loader?lang=typescript!../../basics/bind-io-with-manual.component.ts'),
    'bind-output-with-custom-click': require('!!raw-loader?lang=typescript!../../basics/bind-output-with-custom-click.component.ts'),
    'bind-input-on-change': require('!!raw-loader?lang=typescript!../../basics/bind-input-on-change.component.ts'),
    'bind-input-no-on-push': require('!!raw-loader?lang=typescript!../../basics/bind-input-no-on-push.component.ts'),
    'bind-one-to-many': require('!!raw-loader?lang=typescript!../../basics/bind-one-to-many.component.ts'),
    'bind-input-with-deep-inherits-on-modal': require('!!raw-loader?lang=typescript!../../basics/bind-input-with-deep-inherits-on-modal.component.ts')
  };
}
