import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdhocViewComponent } from './adhoc-view.component';

describe('AdhocViewComponent', () => {
  let component: AdhocViewComponent;
  let fixture: ComponentFixture<AdhocViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdhocViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdhocViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
