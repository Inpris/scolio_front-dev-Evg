import {Directive, ElementRef, HostListener, Renderer2} from '@angular/core';

@Directive({
  selector: '[slCurrency]',
})
export class CurrencyDirective {
  public formatter = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
  });
  public position = 0;

  currencyChars = new RegExp('[\,]', 'g');

  constructor(public el: ElementRef, public renderer: Renderer2) {}

  ngOnInit() {
    this.format(this.el.nativeElement.value);
  }

  @HostListener('input', ["$event"]) onInput(e: any) {
    this.position = e.target.selectionStart;
    this.format(e.target.value);
  };

  @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent) {
    event.preventDefault();
    this.format(event.clipboardData.getData('text/plain'));
  }

  format(val:string) {
    if (val === '') {
      return val;
    }

    const stringDot = String(val).replace(this.currencyChars, '.');
    const numbersArray = stringDot.split('.');
    const decimal = numbersArray.length > 1 ? numbersArray[numbersArray.length - 1] : '0';
    const int = numbersArray.length > 1 ? numbersArray.slice(0, numbersArray.length - 1).join('') : numbersArray[0];

    const newString = `${int}.${decimal}`;
    const numberFormat = +parseFloat(newString.split(' ').join('')).toFixed(2);

    const usd = this.formatter.format(numberFormat);

    this.renderer.setProperty(this.el.nativeElement, 'value', usd);

    const position = int.length > 3 && int.length % 4 === 0 ? this.position + 1 : this.position;

    this.el.nativeElement.setSelectionRange(position, position)
  }
}
