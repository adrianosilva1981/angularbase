import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[libClickOutside]'
})
export class ClickOutsideDirective {

  @Output() libClickOutside: EventEmitter<any> = new EventEmitter();

  @HostListener('document:click', ['$event.target'])

  public onClick(targetElement) {
    const clickedInside = this._elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.libClickOutside.emit(null);
    }
  }

  constructor(private _elementRef: ElementRef) {
  }

}
