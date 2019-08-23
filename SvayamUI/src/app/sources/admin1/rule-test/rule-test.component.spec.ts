import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleTestComponent } from './rule-test.component';

describe('RuleTestComponent', () => {
  let component: RuleTestComponent;
  let fixture: ComponentFixture<RuleTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuleTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
