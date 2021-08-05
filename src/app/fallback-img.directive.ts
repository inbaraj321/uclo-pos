import { Directive, Input, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: 'img[fallback]'
})
export class FallbackImgDirective {
  @Input()
  @HostBinding('src')
  public src: string;

  @Input() fallback: string;

  @HostListener('error')
  onError() {
    this.src = this.fallback;
  }

  constructor() {
      this.src = this.fallback = ''
    }
}
