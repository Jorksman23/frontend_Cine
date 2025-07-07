import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PremierePage } from './premiere.page';

describe('PremierePage', () => {
  let component: PremierePage;
  let fixture: ComponentFixture<PremierePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PremierePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
