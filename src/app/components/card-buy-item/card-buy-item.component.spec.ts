import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardBuyItemComponent } from './card-buy-item.component';

describe('CardBuyItemComponent', () => {
  let component: CardBuyItemComponent;
  let fixture: ComponentFixture<CardBuyItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardBuyItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardBuyItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
