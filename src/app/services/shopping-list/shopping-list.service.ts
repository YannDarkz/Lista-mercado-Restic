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
}
