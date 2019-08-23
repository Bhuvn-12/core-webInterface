import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingControlComponent } from './accounting-control.component';

describe('AccountingControlComponent', () => {
  let component: AccountingControlComponent;
  let fixture: ComponentFixture<AccountingControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
