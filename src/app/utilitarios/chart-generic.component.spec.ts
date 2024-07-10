import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartGenericComponent } from './chart-generic.component';

describe('ChartGenericComponent', () => {
  let component: ChartGenericComponent;
  let fixture: ComponentFixture<ChartGenericComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartGenericComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChartGenericComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
