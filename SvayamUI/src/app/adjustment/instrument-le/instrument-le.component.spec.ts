import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrumentLEComponent } from './instrument-le.component';

describe('InstrumentLEComponent', () => {
  let component: InstrumentLEComponent;
  let fixture: ComponentFixture<InstrumentLEComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstrumentLEComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstrumentLEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
