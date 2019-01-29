import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BindIoInner } from 'ngx-bind-io';
@BindIoInner()
@Component({
  selector: 'source-tabs',
  templateUrl: './source-tabs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SourceTabsComponent {
  @Input()
  title: string = undefined;

  @Input()
  files: { name: string; language: string; content: string }[] = undefined;
}
