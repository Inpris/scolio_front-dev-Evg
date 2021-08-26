import { APP_INITIALIZER, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { ApiInterceptor } from '@common/api.interceptor';
import { AppointmentsService } from '@common/services/appointments';
import { AlwaysAuthChildrenGuard, AuthGuard, NotAuthGuard } from '@common/guards/auth';
import { authFactory, AuthService } from '@common/services/auth';
import { AccessOnStateService } from '@common/services/access-on-state';
import { LayoutComponent } from '@common/layout/layout.component';
import { LeadSourcesService } from '@common/services/lead-sources';
import { LocalStorage } from '@common/services/storage';
import { ContactsService } from '@common/services/contacts';
import { RoomsService } from '@common/services/rooms';
import { ServicesService } from '@common/services/services';
import { UsersService } from '@common/services/users';
import { DoctorsService } from '@common/services/doctors';
import { SignalR } from '@common/services/signalR';
import { VisitReasonsService } from '@common/services/visit-reasons';
import { VisitsService } from '@common/services/visits';
import { RegionService } from '@common/services/region.service';
import { TaskService } from '@common/services/task.service';
import { TaskDataService } from '@common/helpers/task-data';
import { FilesService } from '@common/services/file.service';
import { DealsService } from '@common/services/deals.service';
import { ToastsService } from '@common/services/toasts.service';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: './login/login.module#LoginModule',
    canActivate: [NotAuthGuard],
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AlwaysAuthChildrenGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'robot',
      },
      {
        path: 'shedule',
        loadChildren: './shedule/shedule.module#SheduleModule',
      },
      {
        path: 'crm',
        loadChildren: './crm/crm.module#CrmModule',
      },
      {
        path: 'dictionary',
        loadChildren: './dictionary/dictionary.module#DictionaryModule',
      },
      {
        path: 'purchases',
        loadChildren: './purchases/purchases.module#PurchasesModule',
      },
      {
        path: 'patients',
        loadChildren: './patients/patients.module#PatientsModule',
      },
      {
        path: 'robot',
        loadChildren: './robot/robot.module#RobotModule',
      },
      {
        path: 'no-access',
        loadChildren: './no-access/no-access.module#NoAccessModule',
      },
      {
        path: 'locksmith',
        loadChildren: './locksmith/locksmith.module#LocksmithModule',
      },
      {
        path: 'users',
        loadChildren: './users/users.module#UsersModule',
      },
      {
        path: 'schedule-settings',
        loadChildren: './schedule-settings/schedule-settings.module#ScheduleSettingsModule',
      },
      {
        path: 'login-success',
        loadChildren: './locksmith/locksmith.module#LocksmithModule',
      },
      {
        path: 'reports',
        loadChildren: './reports/reports.module#ReportsModule',
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule,
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: authFactory, deps: [AuthService], multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
    AppointmentsService,
    AuthGuard,
    AlwaysAuthChildrenGuard,
    AuthService,
    AccessOnStateService,
    LeadSourcesService,
    LocalStorage,
    NotAuthGuard,
    NzMessageService,
    ContactsService,
    TaskService,
    TaskDataService,
    RegionService,
    RoomsService,
    ServicesService,
    SignalR,
    VisitReasonsService,
    VisitsService,
    DealsService,
    UsersService,
    DoctorsService,
    FilesService,
    ToastsService,
  ],
})
export class AppRoutingModule {
}
