import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Check Accessibility of component for user role class
import { CheckAccessablity, LoginGuard } from './auth/auth-gaurd';

import { TestComponent } from './test/test.component';
// components for routing
import { LayoutsComponent } from './layouts/layouts.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';


import { OperationsComponent } from './operations/operations.component';

// Report component and children component
import { ReportsComponent } from './reports/reports.component';
import { TrialBalanceComponent } from './reports/control/trial-balance/trial-balance.component';
import { ArrangementListingComponent } from './reports/control/arrangement-listing/arrangement-listing.component';
import { JournalListingComponent } from './reports/control/journal-listing/journal-listing.component';
import { RwaTbComponent } from './reports/compliance/rwa-tb/rwa-tb.component';
import { RwaAlComponent } from './reports/compliance/rwa-al/rwa-al.component';
import { RwaJlComponent } from './reports/compliance/rwa-jl/rwa-jl.component';

// source component and children component
import { SourcesComponent } from './sources/sources.component';
import { ManualComponent } from './sources/manual/manual.component';
import { StatusComponent } from './sources/status/status.component';
import { AdminComponent } from './sources/admin/admin.component';

// Adjustment Component and children component
import { AdjustmentComponent } from './adjustment/adjustment.component';
import { InstrumentLEComponent } from './adjustment/instrument-le/instrument-le.component';
import { JournalLEComponent } from './adjustment/journal-le/journal-le.component';

// settings Component and children component
import { SettingsComponent } from './settings/settings.component';

// configuration Component and children component
import { ConfigurationComponent } from './settings/configuration/configuration.component';
import { OrganizationComponent } from './settings/configuration/organization/organization.component';
import { ProcessGroupComponent } from './settings/configuration/process-group/process-group.component';
import { LedgerComponent } from './settings/configuration/ledger/ledger.component';
import { AccountingControlComponent } from './settings/configuration/accounting-control/accounting-control.component';
import { ReferenceDataComponent } from './settings/configuration/reference-data/reference-data.component';
import { ProcessingComponent } from './settings/configuration/processing/processing.component';
import { OperationComponent } from './settings/configuration/operation/operation.component';
import { ReportingComponent } from './settings/configuration/reporting/reporting.component';

// Admin component and children
import { SettingAdminComponent } from './settings/setting-admin/setting-admin.component';
import { AccountComponent } from './settings/setting-admin/account/account.component';
import { UserComponent } from './settings/setting-admin/user/user.component';
import { RoleComponent } from './settings/setting-admin/role/role.component';
import { PermissionComponent } from './settings/setting-admin/permission/permission.component';
import { ProfileComponent } from './profile/profile.component';
import {ProductsComponent} from './settings/configuration/reference-data/products/products.component';
import {CustomersComponent} from './settings/configuration/reference-data/customers/customers.component';
import {AccountDetailComponent} from './settings/configuration/reference-data/account-detail/account-detail.component';
import { AddSourceSystemComponent } from './sources/admin/add-source-system/add-source-system.component';
import { ModifysrcComponent } from './sources/admin/modifysrc/modifysrc.component';
import { Admin1Component } from './sources/admin1/admin1.component';
import { RuleBuilderComponent } from './sources/admin1/rule-builder/rule-builder.component';
import { RuleTestComponent } from './sources/admin1/rule-test/rule-test.component';
import { RuleOpsComponent } from './sources/admin1/rule-ops/rule-ops.component';
import {DataobjectComponent} from './sources/admin1/dataobject/dataobject.component';
import {LookupComponent} from './sources/admin1/lookup/lookup.component';
import { AdHocReportComponent } from './reports/ad-hoc-report/ad-hoc-report.component';
const routes: Routes = [

  // only for testing
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'test', component: TestComponent },


  // end testing
  {
    path: '', component: LayoutsComponent, canActivate: [LoginGuard],
    children: [
      { path: 'home', component: HomeComponent, canActivate: [CheckAccessablity], data: { compName: 'home' } },
      { path: 'operations', component: OperationsComponent, canActivate: [CheckAccessablity], data: { compName: 'operations' } },
      {
        path: 'reports', component: ReportsComponent, canActivate: [CheckAccessablity], data: { compName: 'reports' },
        children: [
          { path: 'trial-bal', component: TrialBalanceComponent, canActivate: [CheckAccessablity], data: { compName: 'reports' } },
          { path: 'arr-list', component: ArrangementListingComponent, canActivate: [CheckAccessablity], data: { compName: 'reports' } },
          { path: 'jrnl-list', component: JournalListingComponent, canActivate: [CheckAccessablity], data: { compName: 'reports' } },
          { path: 'rwa-tb', component: RwaTbComponent, canActivate: [CheckAccessablity], data: { compName: 'reports' } },
          { path: 'rwa-al', component: RwaAlComponent, canActivate: [CheckAccessablity], data: { compName: 'reports' } },
          { path: 'rwa-jl', component: RwaJlComponent, canActivate: [CheckAccessablity], data: { compName: 'reports' } },
          { path: 'adhoc-report', component: AdHocReportComponent, canActivate: [CheckAccessablity], data: { compName: 'reports' } },
          {path : '' , redirectTo: 'trial-bal', pathMatch: 'full'}
        ]
      },
      {
        path: 'adjust', component: AdjustmentComponent, canActivate: [CheckAccessablity], data: { compName: 'adjustment' },
        children: [
          { path: 'ilentry', component: InstrumentLEComponent, canActivate: [CheckAccessablity], data: { compName: 'adjustment' } },
          { path: 'jlentry', component: JournalLEComponent, canActivate: [CheckAccessablity], data: { compName: 'adjustment' } },
          {path : '' , redirectTo: 'ilentry', pathMatch: 'full'}
        ]
      },
      {
        path: 'source', component: SourcesComponent, canActivate: [CheckAccessablity], data: { compName: 'sources' },
        children: [
          { path: 'manual', component: ManualComponent, canActivate: [CheckAccessablity], data: { compName: 'sources' } },
          { path: 'status', component: StatusComponent, canActivate: [CheckAccessablity], data: { compName: 'sources' } },
          { path: 'admin', component: AdminComponent, canActivate: [CheckAccessablity], data: { compName: 'sources' } },
          { path: 'admin1', component: Admin1Component, canActivate: [CheckAccessablity], data: { compName: 'sources' } },
          { path: 'dataobj', component: DataobjectComponent, canActivate: [CheckAccessablity], data: { compName: 'sources' } },
          { path: 'lookup', component: LookupComponent, canActivate: [CheckAccessablity], data: { compName: 'sources' } },
          { path: 'rule-test', component: RuleTestComponent, canActivate: [CheckAccessablity], data: { compName: 'sources' } },
          { path: 'rule-ops', component: RuleOpsComponent, canActivate: [CheckAccessablity], data: { compName: 'sources' } },
          { path: 'rule-builder', component: RuleBuilderComponent, canActivate: [CheckAccessablity], data: { compName: 'sources' } },
          {path: 'addsrc', component: AddSourceSystemComponent , canActivate: [CheckAccessablity], data: { compName: 'sources' }},
          {path: 'modifysrc', component: ModifysrcComponent , canActivate: [CheckAccessablity], data: { compName: 'sources' }},
          {path : '' , redirectTo: 'status', pathMatch: 'full'}
        ]
      },
      {
        path: 'settings', component: SettingsComponent, canActivate: [LoginGuard],
        children: [{
          path: 'config', component: ConfigurationComponent,
          children: [
            { path: 'organization', component: OrganizationComponent, canActivate: [CheckAccessablity], data: { compName: 'sconorg' } },
            { path: 'pgroup', component: ProcessGroupComponent, canActivate: [CheckAccessablity], data: { compName: 'sconpgroup' } },
            { path: 'ledger', component: LedgerComponent, canActivate: [CheckAccessablity], data: { compName: 'sconledger' } },
            { path: 'acccontrol', component: AccountingControlComponent, canActivate: [CheckAccessablity], data: { compName: 'sconactl' } },
            { path: 'refdata', component: ReferenceDataComponent, canActivate: [CheckAccessablity],
            data: { compName: 'sconrefdata' } , children: [
              { path: 'account_detail', component: AccountDetailComponent },
              { path: 'customers', component: CustomersComponent },
              { path: 'products', component: ProductsComponent },
            ]},
            { path: 'processing', component: ProcessingComponent, canActivate: [CheckAccessablity], data: { compName: 'sconpros' } },
            { path: 'ops', component: OperationComponent, canActivate: [CheckAccessablity], data: { compName: 'sconops' } },
            { path: 'reporting', component: ReportingComponent, canActivate: [CheckAccessablity], data: { compName: 'sconrpt' } },
          ]
        },
        {
          path: 'admin', component: SettingAdminComponent,
          children: [
            { path: 'account', component: AccountComponent, canActivate: [CheckAccessablity], data: { compName: 'sadaccount' } },
            { path: 'user', component: UserComponent, canActivate: [CheckAccessablity], data: { compName: 'saduser' } },
            { path: 'role', component: RoleComponent, canActivate: [CheckAccessablity], data: { compName: 'sadrole' } },
            { path: 'permission', component: PermissionComponent, canActivate: [CheckAccessablity], data: { compName: 'sadpermission' } },
          ]
        }
        ]
      },

      // layouts by default go to home
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      { path: 'profile', component: ProfileComponent, canActivate: [LoginGuard] },
    ]
  },
];

@NgModule({

  imports: [RouterModule.forRoot(routes)],
  exports: [
    RouterModule,
  ]
})

export class AppRoutingModule { }
