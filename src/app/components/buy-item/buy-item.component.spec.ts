import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyItemComponent } from './buy-item.component';

describe('BuyItemComponent', () => {
  let component: BuyItemComponent;
  let fixture: ComponentFixture<BuyItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
