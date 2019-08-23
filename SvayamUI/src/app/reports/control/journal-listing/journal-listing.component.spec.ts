import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalListingComponent } from './journal-listing.component';

describe('JournalListingComponent', () => {
  let component: JournalListingComponent;
  let fixture: ComponentFixture<JournalListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JournalListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
