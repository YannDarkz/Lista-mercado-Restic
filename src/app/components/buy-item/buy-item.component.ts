import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardBuyItemComponent } from '../card-buy-item/card-buy-item.component';

@Component({
  selector: 'app-buy-item',
  standalone: true,
  imports: [CommonModule, CardBuyItemComponent],
  templateUrl: './buy-item.component.html',
  styleUrl: './buy-item.component.scss'
})
export class BuyItemComponent implements OnInit {

  purchasedItems: Array<{name: string, price: number}> = [];
  buyPrice: number = 0

  @Output() itemRemoved = new EventEmitter<void>();
  @Output() removeItemBuy = new EventEmitter<void>()

  ngOnInit(): void {
      this.loadPurchasedItems();
  }

   loadPurchasedItems(): void {
    const storePurchasedItems = localStorage.getItem('listaComprados')
    if (storePurchasedItems) {
      this.purchasedItems = JSON.parse(storePurchasedItems);
    }
    this.calculateTotalPrice()
  }

  calculateTotalPrice(): void {
    this.buyPrice = this.purchasedItems.reduce((acc, item) => acc + item.price, 0);

  }

  removeFromPurchasedItems(index: number): void {
    const storePurchasedItems = JSON.parse(localStorage.getItem('listaComprados') || '[]')
    const itemToMoveBack = storePurchasedItems.splice(index, 1)[0]

    // retornando item para a lista de compras
    const shoppingList = JSON.parse(localStorage.getItem('itensCategory') || '{}');

    if(itemToMoveBack.category){
      const category = itemToMoveBack.category.toLowerCase()

      console.log(category);
      if(!shoppingList[category]){
        shoppingList.category = []
      }

      shoppingList[category].push(itemToMoveBack)
      
    }
    
    localStorage.setItem('itensCategory', JSON.stringify(shoppingList))
    localStorage.setItem('listaComprados', JSON.stringify(storePurchasedItems))

    this.loadPurchasedItems();

    this.itemRemoved.emit()
    this.removeItemBuy.emit()

  }

}
