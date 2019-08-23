import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThenQueryBuilderComponent } from './then-query-builder.component';

describe('ThenQueryBuilderComponent', () => {
  let component: ThenQueryBuilderComponent;
  let fixture: ComponentFixture<ThenQueryBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThenQueryBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThenQueryBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
