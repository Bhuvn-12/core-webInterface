import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrangementListingComponent } from './arrangement-listing.component';

describe('ArrangementListingComponent', () => {
  let component: ArrangementListingComponent;
  let fixture: ComponentFixture<ArrangementListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArrangementListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrangementListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
