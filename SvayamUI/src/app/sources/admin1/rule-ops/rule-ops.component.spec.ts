import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleOpsComponent } from './rule-ops.component';

describe('RuleOpsComponent', () => {
  let component: RuleOpsComponent;
  let fixture: ComponentFixture<RuleOpsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuleOpsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleOpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
