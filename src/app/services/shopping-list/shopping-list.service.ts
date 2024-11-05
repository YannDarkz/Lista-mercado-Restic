import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Iproduct } from '../../interfaces/item-list';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getItemsByCategory(category: string): Observable<Iproduct[]> {
    return this.http.get<Iproduct[]>(`${this.apiUrl}/${category}`);
  }

  addItem(category: string, item: Iproduct): Observable<Iproduct> {
    return this.http.post<Iproduct>(`${this.apiUrl}/${category}`, item);
  }

  updateItem(category: string, itemId: string, item: Iproduct): Observable<Iproduct> {
    return this.http.put<Iproduct>(`${this.apiUrl}/${category}/${itemId}`, item)
  }

  deleteItem(category: string, itemId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${category}/${itemId}`)
  }

  // services Buy

  getPurchasedItems(category: string): Observable<Iproduct[]> {
    const categoryBuyEndpoint = `${category}-Buy`;
    return this.http.get<Iproduct[]>(`${this.apiUrl}/${categoryBuyEndpoint}`);
  }

  // Método para adicionar um item comprado na categoria correta
  addPurchasedItem(item: Iproduct): Observable<Iproduct> {
    const categoryBuyEndpoint = `${item.category}-Buy`;
    return this.http.post<Iproduct>(`${this.apiUrl}/${categoryBuyEndpoint}`, item);
  }

  // Método para remover um item comprado usando a categoria correta e ID
  removePurchasedItem(item: Iproduct): Observable<void> {
    const categoryBuyEndpoint = `${item.category}-Buy`;
    return this.http.delete<void>(`${this.apiUrl}/${categoryBuyEndpoint}/${item.id}`);
  }

  // Método para adicionar o item de volta à lista de compras original
  addBackToShoppingList(item: Iproduct): Observable<Iproduct> {
    return this.http.post<Iproduct>(`${this.apiUrl}/${item.category}`, item);
  }
}
