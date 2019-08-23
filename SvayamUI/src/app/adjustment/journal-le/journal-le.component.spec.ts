import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalLEComponent } from './journal-le.component';

describe('JournalLEComponent', () => {
  let component: JournalLEComponent;
  let fixture: ComponentFixture<JournalLEComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JournalLEComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalLEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
