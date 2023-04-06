import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditarPaisComponent } from './modal-editar-pais.component';

describe('ModalEditarPaisComponent', () => {
  let component: ModalEditarPaisComponent;
  let fixture: ComponentFixture<ModalEditarPaisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalEditarPaisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEditarPaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
