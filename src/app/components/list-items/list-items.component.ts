import { Component, EventEmitter, OnInit, Input, ViewChild, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardListComponent } from '../card-list/card-list.component';
import { AddItemsComponent } from '../add-items/add-items.component';
import { BuyItemComponent } from '../buy-item/buy-item.component';

import { Iproduct } from '../../interfaces/item-list';
import { ShoppingListService } from '../../services/shopping-list/shopping-list.service';
import { HttpClient } from '@angular/common/http';

import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-list-items',
  standalone: true,
  imports: [CommonModule, CardListComponent, AddItemsComponent, BuyItemComponent],
  templateUrl: './list-items.component.html',
  styleUrl: './list-items.component.scss'
})
export class ListItemsComponent implements OnInit {

  constructor(private http: ShoppingListService) {}


  categories = ['cold', 'perishables', 'cleaning', 'others'];

  categoriesWithItems: { category: string; products: Iproduct[] }[] = [
    { category: 'cold', products: [] },
    { category: 'perishables', products: [] },
    { category: 'cleaning', products: [] },
    { category: 'others', products: [] },
  ];

  itemsByCategory = {
    perishables: [] as Iproduct[],
    cold: [] as Iproduct[],
    cleaning: [] as Iproduct[],
    others: [] as Iproduct[],

  };


  totalPrice: number = 0

  // @Input() loadBuyItems = new EventEmitter<void>()
  @Output() notifyAddItem = new EventEmitter<void>()
  @Output() notifyUpdatedItem = new EventEmitter<void>()
  @Output() notifyRemoveItem = new EventEmitter<void>()
  @Output() notifyByuItem = new EventEmitter<void>()




  @ViewChild(AddItemsComponent) addItemsComponent!: AddItemsComponent;
  @ViewChild(BuyItemComponent) buyItemComponent!: BuyItemComponent;
  


  ngOnInit(): void {
    this.loadItems()
    // this.clearListBuy()
    // this.clearList()
  }

  ngAfterViewInit(): void {
    this.addItemsComponent.itemUpdated.subscribe(() => {
      this.loadItems();
    });
  }

  loadItems(): void {
    this.categoriesWithItems.forEach((categoryObj) => {
      this.http.getItemsByCategory(categoryObj.category).subscribe((data) => {
        categoryObj.products = data;
      });
    });

    console.log("euu",  this.categoriesWithItems);

   
  }

  calculateTotalPrice(): void {
    this.totalPrice = Object.values(this.itemsByCategory)
      .flat()
      .reduce((acc, item) => acc + item.price * item.quantity, 0)

  }

  editItem(item: Iproduct, id: number, category: string): void {
  
    if (this.addItemsComponent) {
      this.addItemsComponent.startEdit(item, category);
      this.scrollToTop();
    } else {
      console.log('addItemsComponent não está inicializado');
    }
  }

  deleteItem(category: string, itemId: string): void {
    
    this.http.deleteItem(category, itemId).subscribe({
      next: () => {
        this.loadItems();
        this.notifyRemoveItem.emit();
      },
      error: (err) => console.error("Erro ao deletar item:", err)
    });
  }

  buyItem(item: Iproduct, category: string, index: number): void {
    const typedCategory = category as keyof typeof this.itemsByCategory;
    const purchasedItems = JSON.parse(localStorage.getItem('listaComprados') || '[]');
    purchasedItems.push(item);
    localStorage.setItem('listaComprados', JSON.stringify(purchasedItems));

    this.itemsByCategory[typedCategory].splice(index, 1);
    this.saveItems();
    this.loadItems();

    this.buyItemComponent.loadPurchasedItems();
    this.notifyByuItem.emit();
  }

  saveItems(): void {
    localStorage.setItem('itensCategory', JSON.stringify(this.itemsByCategory));

  }

  categoriaPT(category: string): string {
    switch (category) {
      case 'cold':
        return 'frios';
      case 'perishables':
        return 'perecíveis';
      case 'cleaning':
        return 'limpeza';
      case 'others':
        return 'outros';
      default:
        return category
    }
  }

  clearList(): void {
    localStorage.removeItem('listaCompras');
    // this.items = [];
  }

  get objectKeys() {
    return Object.keys;
  }

  getItemsByCategory(category: keyof typeof this.itemsByCategory): Iproduct[] {
    return this.itemsByCategory[category] || [];
  }



  onNotifyAddItem(): void {
    this.notifyAddItem.emit()

  }

  onNotifyUpdatedItem(): void {
    this.notifyUpdatedItem.emit()
  }

  removeItemBuy(): void {
    this.notifyRemoveItem.emit()
  }


  clearListBuy(): void {
    localStorage.removeItem('listaComprados');
  }

  scrollToTop(): void {
    const scrollDuration = 30; // Tempo total em ms
    const startPosition = window.scrollY;
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / scrollDuration, 1);
      const scrollPosition = startPosition * (1 - progress);

      window.scrollTo(0, scrollPosition);

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  }

}
