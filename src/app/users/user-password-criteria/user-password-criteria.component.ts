import { ChangeDetectorRef, Component } from '@angular/core';

@Component({
  selector: 'sl-user-password-criteria',
  template: `<p><b>Пароль должен содержать:</b></p>
            <ul>
              <li>Минимум 6 символов</li>
              <li>Хотя бы одну цифру</li>
              <li>Хотя бы один символ в нижнем регистре</li>
              <li>Хотя бы один символ в верхнем регистре</li>
              <li>Хотя бы один уникальный символ</li>
            </ul>
            <p>Например: Password1</p>`,
})
export class UserPasswordCriteriaComponent {
  constructor(cdr: ChangeDetectorRef) {
    cdr.detach();
  }
}
