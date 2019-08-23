import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdHocReportComponent } from './ad-hoc-report.component';

describe('AdHocReportComponent', () => {
  let component: AdHocReportComponent;
  let fixture: ComponentFixture<AdHocReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdHocReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdHocReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
