import { AfterContentInit, Directive, Input, OnDestroy, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { IBindIO } from '../interfaces/bind-io.interface';
import { NgxBindOutputsService } from '../services/ngx-bind-outputs.service';
@Directive({
  selector: '[bindOutputs]'
})
export class BindOutputsDirective implements Partial<IBindIO>, OnDestroy, AfterContentInit {
  @Input()
  excludeOutputs: string[] | string = [];
  @Input()
  includeOutputs: string[] | string = [];

  component: any;
  parentComponent: any;
  outputs: {
    keys: string[];
    parentKeys: string[];
  };

  used: string[] = [];
  destroyed$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _viewContainerRef: ViewContainerRef,
    private _ngxBindOutputsService: NgxBindOutputsService,
    private _ref: ChangeDetectorRef
  ) {}
  ngAfterContentInit() {
    this.component = this._viewContainerRef['_data'].componentView.component;
    this.parentComponent = (<any>this._viewContainerRef)._view.context;
    this.outputs = this._ngxBindOutputsService.getOutputs(this);
    this._ngxBindOutputsService.bindOutputs(this);
    if (localStorage && localStorage.getItem('debug_ngx-bind-io') === 'true') {
      console.log(this.outputs, this);
    }
  }
  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
