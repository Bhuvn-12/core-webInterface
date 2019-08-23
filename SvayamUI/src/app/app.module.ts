import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './/app-routing.module';
import {LocationStrategy , HashLocationStrategy} from '@angular/common';
import { ScriptLoaderService } from './services/script-loader.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
// auth
import { CheckAccessablity, LoginGuard } from './auth/auth-gaurd';


import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule,
} from '@angular/material';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {FileUploadModule} from 'ng2-file-upload';
import { QueryBuilderModule } from 'angular2-query-builder-test';
// component import
import { AppComponent } from './/app.component';
import { AppHeader } from './layouts//app-header/app-header.component';
import { AppSidebar } from './layouts/app-sidebar/app-sidebar.component';
import { AppFooter } from './layouts//app-footer/app-footer.component';
import { HomeComponent } from './home/home.component';
import { TestComponent } from './test/test.component';
import { LayoutsComponent } from './layouts/layouts.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

// operations component and children component
import { OperationsComponent } from './operations/operations.component';

// Report component and children component
import { ReportsComponent } from './reports/reports.component';
import { TrialBalanceComponent } from './reports/control/trial-balance/trial-balance.component';
import { JournalListingComponent } from './reports/control/journal-listing/journal-listing.component';
import { ArrangementListingComponent } from './reports/control/arrangement-listing/arrangement-listing.component';
import { RwaTbComponent } from './reports/compliance/rwa-tb/rwa-tb.component';
import { RwaAlComponent } from './reports/compliance/rwa-al/rwa-al.component';
import { RwaJlComponent } from './reports/compliance/rwa-jl/rwa-jl.component';

// source component and children component
import { ManualComponent } from './sources/manual/manual.component';
import { StatusComponent } from './sources/status/status.component';
import { AdminComponent } from './sources/admin/admin.component';

// Adjustment Component and children component
import { AdjustmentComponent } from './adjustment/adjustment.component';
import { InstrumentLEComponent } from './adjustment/instrument-le/instrument-le.component';
import { JournalLEComponent } from './adjustment/journal-le/journal-le.component';

// settings Component and children component
import { SettingsComponent } from './settings/settings.component';
import {AccountDetailComponent} from './settings/configuration/reference-data/account-detail/account-detail.component';
import {CustomersComponent} from './settings/configuration/reference-data/customers/customers.component';
import {ProductsComponent} from './settings/configuration/reference-data/products/products.component';





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
import { SourcesComponent } from './sources/sources.component';
import { AddSourceSystemComponent } from './sources/admin/add-source-system/add-source-system.component';
import { ModifysrcComponent } from './sources/admin/modifysrc/modifysrc.component';
import { Admin1Component } from './sources/admin1/admin1.component';

// End settings component and its admin
import { RuleBuilderComponent } from './sources/admin1/rule-builder/rule-builder.component';
import { WhenQueryBuilderComponent } from './sources/admin1/rule-builder/when-query-builder/when-query-builder.component';
import { ThenQueryBuilderComponent } from './sources/admin1/rule-builder/then-query-builder/then-query-builder.component';
import { RuleTestComponent } from './sources/admin1/rule-test/rule-test.component';
import { RuleOpsComponent } from './sources/admin1/rule-ops/rule-ops.component';
import {DataobjectComponent} from './sources/admin1/dataobject/dataobject.component';
import {LookupComponent} from './sources/admin1/lookup/lookup.component';
import { ConfirmBoxComponent } from './layouts/confirm-box/confirm-box.component';
import { AdHocReportComponent } from './reports/ad-hoc-report/ad-hoc-report.component';
import { WebDataRocksPivot } from './webdatarocks/webdatarocks.angular4';
import { AdhocViewComponent } from './reports/ad-hoc-report/adhoc-view/adhoc-view.component';


@NgModule({
  declarations: [
    AppComponent,
    AppHeader,
    AppSidebar,
    AppFooter,
    HomeComponent,
    // tslint:disable-next-line: indent
    TestComponent,
    LayoutsComponent,
    LoginComponent,
    SignupComponent,
    OperationsComponent,
    ReportsComponent,
    TrialBalanceComponent,
    ArrangementListingComponent,
    JournalListingComponent,
    RwaTbComponent,
    RwaAlComponent,
    RwaJlComponent,
    ManualComponent,
    StatusComponent,
    AdminComponent,
    AdjustmentComponent,
    InstrumentLEComponent,
    JournalLEComponent,
    SettingsComponent,
    ConfigurationComponent,
    OrganizationComponent,
    ProcessGroupComponent,
    LedgerComponent,
    AccountingControlComponent,
    ReferenceDataComponent,
    ProcessingComponent,
    OperationComponent,
    ReportingComponent,
    SettingAdminComponent,
    AccountComponent,
    UserComponent,
    RoleComponent,
    PermissionComponent,
    ProfileComponent,
    SourcesComponent,
    AccountDetailComponent,
    CustomersComponent,
    ProductsComponent,
    AddSourceSystemComponent,
    ModifysrcComponent,
    Admin1Component,
    RuleBuilderComponent,
    WhenQueryBuilderComponent,
    ThenQueryBuilderComponent,
    ConfirmBoxComponent,
    RuleOpsComponent,
    RuleTestComponent,
    DataobjectComponent,
    LookupComponent,
    AdHocReportComponent,
    WebDataRocksPivot,
    AdhocViewComponent


  ],
  imports: [

    // angular  core modules
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    // tslint:disable-next-line: no-trailing-whitespace
    NgxSpinnerModule,

    // Angular material modules
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    DragDropModule,

    // third party api
    FileUploadModule,
    QueryBuilderModule

  ],
  entryComponents: [
    ConfirmBoxComponent
  ],
  providers: [ScriptLoaderService, CheckAccessablity, LoginGuard, { provide : LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
