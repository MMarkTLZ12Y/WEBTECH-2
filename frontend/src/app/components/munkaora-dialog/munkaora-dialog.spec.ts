import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MunkaoraDialog } from './munkaora-dialog';

describe('MunkaoraDialog', () => {
  let component: MunkaoraDialog;
  let fixture: ComponentFixture<MunkaoraDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MunkaoraDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(MunkaoraDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
