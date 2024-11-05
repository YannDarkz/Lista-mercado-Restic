import { Component, OnInit, OnDestroy, ViewChild, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardListComponent } from '../card-list/card-list.component';
import { AddItemsComponent } from '../add-items/add-items.component';
import { BuyItemComponent } from '../buy-item/buy-item.component';
import { AuthButtonsComponent } from '../auth-buttons/auth-buttons.component';

import { Iproduct } from '../../interfaces/item-list';
import { Iuser } from '../../interfaces/user';

import { UserDataService } from '../../services/user-data/user-data.service';
import { ShoppingListService } from '../../services/shopping-list/shopping-list.service';
import { ItemUpdateService } from '../../services/itemUpdate/item-update.service';


import { Subscription } from 'rxjs';
import { forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';


@Component({
  selector: 'app-list-items',
  standalone: true,
  imports: [CommonModule, CardListComponent, AddItemsComponent, BuyItemComponent, AuthButtonsComponent],
  templateUrl: './list-items.component.html',
  styleUrl: './list-items.component.scss'
})
export class ListItemsComponent implements OnInit, OnDestroy {

  userData: Iuser | null = null
  private updateSubscription!: Subscription;

  constructor(private http: ShoppingListService, private itemUpdateService: ItemUpdateService, private userDataService: UserDataService) {}


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

  @ViewChild(AddItemsComponent) addItemsComponent!: AddItemsComponent;
  @ViewChild(BuyItemComponent) buyItemComponent!: BuyItemComponent;
  


  ngOnInit(): void {
    this.loadItems();
    
   this.updateSubscription = this.itemUpdateService.updateItems$.subscribe(() => {
    this.loadItems();
   });

   this.userDataService.getUserData().subscribe(data => {
    this.userData = data;
    console.log("listData", this.userData);
    
   })
  }

  ngOnDestroy(): void {
      if(this.updateSubscription) {
        this.updateSubscription.unsubscribe();
      }
  }

  ngAfterViewInit(): void {
    this.addItemsComponent.itemUpdated.subscribe(() => {
      this.loadItems();
    });
  }

  loadItems(): void {
    const loadObservables = this.categoriesWithItems.map(categoryObj => 
      this.http.getItemsByCategory(categoryObj.category).pipe(
        tap(data => categoryObj.products = data)
      )
    );
    forkJoin(loadObservables).subscribe({
      next: () => {
        this.calculateTotalPrice(); 
      },
      error: (err) => console.error("Erro ao carregar itens:", err)
    });
   
  }

  calculateTotalPrice(): void {
    this.totalPrice = this.categoriesWithItems
      .reduce((acc, categoryObj) => {
        const categoryTotal = (categoryObj.products || []).reduce((sum, item) => {
          const price = item.price || 0;
          const quantity = item.quantity || 0;
          return sum + price * quantity;
        }, 0);
        return acc + categoryTotal;
      }, 0);
  }

  total() {
    console.log("re", this.calculateTotalPrice() );
    
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
        this.notifyRemoveItem()
      },
      error: (err) => console.error("Erro ao deletar item:", err)
    });
  }

  buyItem(item: Iproduct, category: string, index: number): void {
    const buyCategory = `${category}-Buy`;
    
   
    this.http.addItem(buyCategory, item).subscribe({
      next: () => {
        const categoryObj = this.categoriesWithItems.find(cat => cat.category === category);
        if (categoryObj) {
          categoryObj.products.splice(index, 1);
        }
        
        
        this.http.deleteItem(category, item.id).subscribe({
          next: () => {
            this.saveItems(); 
            this.loadItems();  
  
            // Carregar novamente os itens comprados e emitir o evento
            this.buyItemComponent.loadPurchasedItems();
            this.notifyAddBuyItem();
          },
          error: (err) => console.error("Erro ao deletar item da categoria original:", err)
        });
      },
      error: (err) => console.error("Erro ao adicionar item na categoria comprados:", err)
    });
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
  }

  get objectKeys() {
    return Object.keys;
  }

  getItemsByCategory(category: keyof typeof this.itemsByCategory): Iproduct[] {
    return this.itemsByCategory[category] || [];
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

  addTextNotify = '';
  
  notifyAddItem(): void {
    this.addTextNotify = 'adcionado com sucesso! ✅'
    setTimeout(() => {
      this.addTextNotify = ''
    },2000)
  }

  notifyEditItem(): void {
    this.addTextNotify = 'Editado com sucesso! ✅'
    setTimeout(() => {
      this.addTextNotify = ''
    },2000)
  }

  notifyRemoveItem(): void {
    this.addTextNotify = 'Removido com sucesso! ✅'
    setTimeout(() => {
      this.addTextNotify = ''
    },1000)
  }

  notifyAddBuyItem(): void {
    this.addTextNotify = 'adcionado No carrinho! ✅'
    setTimeout(() => {
      this.addTextNotify = ''
    },1500)
  }




}
