import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhenQueryBuilderComponent } from './when-query-builder.component';

describe('WhenQueryBuilderComponent', () => {
  let component: WhenQueryBuilderComponent;
  let fixture: ComponentFixture<WhenQueryBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhenQueryBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhenQueryBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
