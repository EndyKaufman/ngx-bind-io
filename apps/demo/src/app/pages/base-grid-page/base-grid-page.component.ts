import { ChangeDetectionStrategy, Component } from '@angular/core';
import { environment } from './../../../environments/environment';
@Component({
  selector: 'base-grid-page',
  templateUrl: './base-grid-page.component.html',
  styleUrls: ['./base-grid-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseGridPageComponent {
  apiUrl = environment.apiUrl;

  source = {
    html: require('!!raw-loader!../../entities/users/users-grid/users-grid.component.html').default,
    ts: require('!!raw-loader!../../entities/users/users-grid/users-grid.component.ts').default
  };
  sourceWithBindIO = {
    html: require('!!raw-loader!../../entities/users/users-grid-with-bind-io/users-grid-with-bind-io.component.html')
      .default,
    ts: require('!!raw-loader!../../entities/users/users-grid-with-bind-io/users-grid-with-bind-io.component.ts')
      .default
  };

  otherFiles: { name: string; language: string; content: string }[] = [
    {
      name: 'user.ts',
      language: 'javascript',
      content: require('!!raw-loader!../../models/user.ts').default
    },
    {
      name: 'base-grid.component.ts',
      language: 'javascript',
      content: require('!!raw-loader!../../base/base-grid.component.ts').default
    },
    {
      name: 'base-modal.component.ts',
      language: 'javascript',
      content: require('!!raw-loader!../../base/base-modal.component.ts').default
    }
  ];
}
