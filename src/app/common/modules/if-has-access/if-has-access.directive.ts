import { Directive, TemplateRef, ViewContainerRef, Input } from '@angular/core';
import { AuthService } from '@common/services/auth';
import { User } from '@common/models/user';

@Directive({ selector: '[slIfHasAccess]' })

export class IfHasAccessDirective {
  private roles = [];
  private isHidden = true;
  private fallBackTemplate;
  user: User;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService,
  ) {}

  @Input()
  set slIfHasAccess(val) {
    this.roles = val;
    this.updateView();
  }

  @Input()
  set slIfHasAccessFallBack(fallBackTemplate) {
    this.fallBackTemplate = fallBackTemplate;
    this.updateView();
  }

  private updateView() {
    if (this.authService.isRolesHasAccess(this.roles)) {
      if (this.isHidden) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.isHidden = false;
      }
    } else {
      this.isHidden = true;
      if (this.fallBackTemplate) {
        this.viewContainer.createEmbeddedView(this.fallBackTemplate);
      } else {
        this.viewContainer.clear();
      }
    }
  }

}
