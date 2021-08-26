import { XrayPhotoComponent } from '@modules/xray/xray-photo/xray-photo.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, RouteReuseStrategy } from '@angular/router';
import { XrayPhotoEditComponent } from '@modules/xray/xray-photo/xray-photo-edit/xray-photo-edit.component';
import { XrayLineEditComponent } from '@modules/xray/xray-photo/xray-line-edit/xray-line-edit.component';
import { ArcListComponent } from '@modules/xray/xray-photo/xray-line-edit/arc-list/arc-list.component';
import { XrayPhotoResolverService } from '@modules/xray/xray-photo/helpers/xray-photo-resolver.service';
import { CanDeactivateGuard } from '@modules/patients/patient/guards/can-deactivate-guard.service';

const routes: Routes = [
  {
    path: ':id',
    component: XrayPhotoComponent,
    resolve: {
      imageURI: XrayPhotoResolverService,
    },
    children: [
      {
        path: '',
        redirectTo: 'photo-edit',
        pathMatch: 'full',
      },
      {
        path: 'photo-edit',
        component: XrayPhotoEditComponent,
      },
      {
        path: 'line-edit',
        component: XrayLineEditComponent,
        children: [
          {
            path: '',
            redirectTo: 'arc-list',
            canDeactivate: [CanDeactivateGuard],
            pathMatch: 'full',
          },
          {
            path: 'arc-list',
            component: ArcListComponent,
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class XrayPhotoRoutingModule {}
