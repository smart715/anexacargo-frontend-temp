import { Directive, AfterViewInit, ElementRef } from '@angular/core';

@Directive({
  selector: '[appFocuss]'
})
export class FocussDirective implements AfterViewInit {
  constructor(private host: ElementRef) {}

  ngAfterViewInit() {
    this.host.nativeElement.focus();
  } 
}