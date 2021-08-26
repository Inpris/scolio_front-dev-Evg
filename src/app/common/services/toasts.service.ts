import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { NzMessageDataOptions, NzMessageService } from 'ng-zorro-antd';
import { HttpErrorResponse } from '@angular/common/http';

/**
 * В версии ngZorro 0.7 cdk-overlay контейнер имеет идентичный zIndex модальному окну
 * В следствии чего toast перекрывается оверлеем модалки
 * В версии 1.3 Данный баг пофикшен.
 * TODO: План обновления ngZorro: заменить данный сервис на оригинальный
 */

const TOAST_DISPLAY_DURATION = 3000;

@Injectable()
export class ToastsService {
  private renderer: Renderer2;

  constructor(
    private nzMessageService: NzMessageService,
    private rendererFactory: RendererFactory2,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  success(content: string, options?: NzMessageDataOptions) {
    this.nzMessageService.success(content, options);
    this.updateZIndex();
  }

  error(content: string, options?: NzMessageDataOptions) {
    this.nzMessageService.error(content, options);
    this.updateZIndex();
  }

  info(content: string, options?: NzMessageDataOptions) {
    this.nzMessageService.info(content, options);
    this.updateZIndex();
  }

  warning(content: string, options?: NzMessageDataOptions) {
    this.nzMessageService.warning(content, options);
    this.updateZIndex();
  }

  updateZIndex() {
    const messageContainers = document.querySelectorAll('nz-message-container');
    Array.prototype.forEach.call(messageContainers, (container) => {
      this.renderer.setStyle(container.parentElement, 'zIndex', '1001');
    });
  }

  public onError(response: HttpErrorResponse) {
    let message = 'Произошла ошибка';
    const { errors } = response.error || { errors: null };
    if (errors != null && errors.length > 0) {
      message = errors[0];
    }
    this.error(message, { nzDuration: TOAST_DISPLAY_DURATION });
  }

  public onSuccess(message) {
    this.success(message, { nzDuration: TOAST_DISPLAY_DURATION });
  }
}

