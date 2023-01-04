import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FWFService } from 'src/app/services/fwf.service';
import { AbstractComponent } from '../abstract/abstract.component';

@Component({
  template: ''
})
export abstract class ResizeableComponent extends AbstractComponent {

  @ViewChild('container', { static: true }) container?: ElementRef<HTMLElement>;

  cols: number = 1;
  gutter: number = 16;
  margin: number = 0;
  rowHeight: number = 300;

  constructor(fwfService: FWFService) {
    super(fwfService);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.resize();
  }

  @HostListener('window:resize', ['$event.target'])
  onResize(): void {
    this.resize();
  }

  private resize(): void {
    let width = this.container!.nativeElement.offsetWidth;
    this.cols = Math.max(1, Math.floor(width / 400));
    this.rowHeight = Math.max(this.getMinRowHeight(), this.getFactor() / (width / this.cols));
    if (width <= 600) {
      this.margin = 0;
    } else {
      this.margin = 16;
    }
  }

  protected abstract getFactor(): number

  protected getMinRowHeight(): number {
    return 300
  }

}
