// src/app/services/item-update/item-update.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemUpdateService {
  private updateItemsSubject = new Subject<void>();
  
  // Observable para ouvir quando a lista precisa ser recarregada
  updateItems$ = this.updateItemsSubject.asObservable();

  // Método para emitir o evento de atualização
  triggerUpdateItems(): void {
    this.updateItemsSubject.next();
  }
}
