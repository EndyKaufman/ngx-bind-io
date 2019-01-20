import { ChangeDetectionStrategy, Component } from '@angular/core';
import { environment } from 'apps/demo/src/environments/environment';

@Component({
  selector: 'base-grid-page',
  templateUrl: './base-grid-page.component.html',
  styleUrls: ['./base-grid-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseGridPageComponent {
  apiUrl = environment.apiUrl;

  source = {
    html: require('!!raw-loader?lang=html!../../entities/users/users-grid/users-grid.component.html'),
    ts: require('!!raw-loader?lang=typescript!../../entities/users/users-grid/users-grid.component.ts')
  };
  sourceWithBindIO = {
    html: require('!!raw-loader?lang=html!../../entities/users/users-grid-with-bind-io/users-grid-with-bind-io.component.html'),
    ts: require('!!raw-loader?lang=typescript!../../entities/users/users-grid-with-bind-io/users-grid-with-bind-io.component.ts')
  };

  otherFiles: { name: string; language: string; content: string }[] = [
    {
      name: 'user.ts',
      language: 'javascript',
      content: require('!!raw-loader?lang=typescript!../../models/user.ts')
    },
    {
      name: 'base-grid.component.ts',
      language: 'javascript',
      content: require('!!raw-loader?lang=typescript!../../base/base-grid.component.ts')
    },
    {
      name: 'base-modal.component.ts',
      language: 'javascript',
      content: require('!!raw-loader?lang=typescript!../../base/base-modal.component.ts')
    }
  ];
}
