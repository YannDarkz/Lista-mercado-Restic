import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardBuyItemComponent } from '../card-buy-item/card-buy-item.component';

import { ShoppingListService } from '../../services/shopping-list/shopping-list.service';
import { ItemUpdateService } from '../../services/itemUpdate/item-update.service';
import { Iproduct } from '../../interfaces/item-list';

@Component({
  selector: 'app-buy-item',
  standalone: true,
  imports: [CommonModule, CardBuyItemComponent],
  templateUrl: './buy-item.component.html',
  styleUrl: './buy-item.component.scss',
  providers: [ShoppingListService]
})
export class BuyItemComponent implements OnInit {

  constructor(private shoppingService: ShoppingListService,  private itemUpdateService: ItemUpdateService) {}

   purchasedItems: { category: string; products: Iproduct[] }[] = [
    { category: 'cold', products: [] },
    { category: 'perishables', products: [] },
    { category: 'cleaning', products: [] },
    { category: 'others', products: [] },
  ];
  buyPrice: number = 0

  @Output() itemRemoved = new EventEmitter<void>();
  @Output() removeItemBuy = new EventEmitter<void>()

  ngOnInit(): void {
    this.loadPurchasedItems();
      // this.loadPurchasedItems('cold');
      // this.loadPurchasedItems('perishables');
      // this.loadPurchasedItems('cleaning');
  }

  loadPurchasedItems(): void {
   this.purchasedItems.forEach((categoryObj) => {
    this.shoppingService.getPurchasedItems(categoryObj.category).subscribe({
      next: (items) => {
        categoryObj.products = items;
        this.calculateTotalPrice()
      },
      error: (error) => console.error(`Erro ao carregar itens comprados da categoria ${categoryObj.category}:`, error)
    })
   })
  }

  calculateTotalPrice(): void {
    this.buyPrice = this.purchasedItems.reduce(
      (total, categoryObj) =>
        total + categoryObj.products.reduce((acc, item) => acc + item.price * item.quantity, 0),
      0
    );
  }

  removeFromPurchasedItems(category: string, index: number): void {
    const categoryObj = this.purchasedItems.find(cat => cat.category === category);
    if (!categoryObj) return;

    const itemToRemove = categoryObj.products[index];

    // Remover o item do array de comprados e do servidor
    this.shoppingService.removePurchasedItem(itemToRemove).subscribe({
      next: () => {
        categoryObj.products.splice(index, 1);
        this.calculateTotalPrice();
        this.itemRemoved.emit();
        this.removeItemBuy.emit();

        // Adicionar o item de volta à lista de compras original
        this.shoppingService.addBackToShoppingList(itemToRemove).subscribe({
          next: () => {
           console.log('Item adicionado de volta à lista de compras');
           this.itemUpdateService.triggerUpdateItems();
          },
            
          error: (error) => console.error("Erro ao retornar item para a lista de compras:", error)
        });
      },
      error: (error) => console.error("Erro ao remover item comprado:", error)
    });
  }
}


