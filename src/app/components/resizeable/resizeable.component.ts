import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FWFService } from 'src/app/services/fwf.service';
import { AbstractComponent } from '../abstract/abstract.component';

@Component({
  template: ''
})
export abstract class ResizeableComponent extends AbstractComponent implements OnInit {

  @ViewChild('container') div?: ElementRef<HTMLElement>;
  el: HTMLElement;

  cols: number = 1;
  gutter: number = 16;
  margin: number = 0;
  rowHeight: number = 300;

  constructor(el: ElementRef, fwfService: FWFService) {
    super(fwfService);
    this.el = el.nativeElement;
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
    this.cols = Math.max(1, Math.floor(this.el.offsetWidth / 400));
    if (this.el.offsetWidth > 0) {
      this.rowHeight = Math.max(this.getMinRowHeight(), this.getFactor() / (this.el.offsetWidth / this.cols));
    }
    if (this.el.offsetWidth <= 600) {
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
