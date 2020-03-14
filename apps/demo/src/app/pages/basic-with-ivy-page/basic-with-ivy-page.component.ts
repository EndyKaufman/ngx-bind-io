import { ChangeDetectionStrategy, Component } from '@angular/core';
@Component({
  selector: 'basic-with-ivy-page',
  templateUrl: './basic-with-ivy-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicWithIvyPageComponent {
  ts = {
    'bind-input': require('!!raw-loader!../../basics-with-ivy/bind-input.component.ts').default,
    'bind-input-with-exclude': require('!!raw-loader!../../basics-with-ivy/bind-input-with-exclude.component.ts')
      .default,
    'bind-input-with-include': require('!!raw-loader!../../basics-with-ivy/bind-input-with-include.component.ts')
      .default,
    'bind-input-with-deep-inherits': require('!!raw-loader!../../basics-with-ivy/bind-input-with-deep-inherits.component.ts')
      .default,
    'bind-io-with-mixins': require('!!raw-loader!../../basics-with-ivy/bind-io-with-mixins.component.ts').default,
    'bind-output': require('!!raw-loader!../../basics-with-ivy/bind-output.component.ts').default,
    'bind-output-with-click': require('!!raw-loader!../../basics-with-ivy/bind-output-with-click.component.ts').default,
    'bind-io': require('!!raw-loader!../../basics-with-ivy/bind-io.component.ts').default,
    'bind-io-with-manual': require('!!raw-loader!../../basics-with-ivy/bind-io-with-manual.component.ts').default,
    'bind-output-with-custom-click': require('!!raw-loader!../../basics-with-ivy/bind-output-with-custom-click.component.ts')
      .default,
    'bind-input-on-change': require('!!raw-loader!../../basics-with-ivy/bind-input-on-change.component.ts').default,
    'bind-input-no-on-push': require('!!raw-loader!../../basics-with-ivy/bind-input-no-on-push.component.ts').default,
    'bind-one-to-many': require('!!raw-loader!../../basics-with-ivy/bind-one-to-many.component.ts').default,
    'bind-input-with-deep-inherits-on-modal': require('!!raw-loader!../../basics-with-ivy/bind-input-with-deep-inherits-on-modal.component.ts')
      .default
  };
}
