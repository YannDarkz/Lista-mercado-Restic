import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Iproduct } from '../../interfaces/item-list';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {

  constructor(private http: HttpClient) { }
  
  private apiUrl = 'http://localhost:3000';

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocorreu um erro inesperado. Tente novamente em alguns segundos.'
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`
    } else {
      switch (error.status) {
        case 404:
        errorMessage = 'Recurso não encontrado.';
        break;
        case 500:
          errorMessage = 'Erro interno do servidor.';
          break;
          default:
            errorMessage = `Erro ${error.status}: ${error.message}`
            break;
      }
    }

    return throwError(() => new Error(errorMessage))
  }

  getItemsByCategory(category: string, userId: string): Observable<Iproduct[]> {
    return this.http.get<Iproduct[]>(`${this.apiUrl}/${category}?userId=${userId}`)
    .pipe(
      catchError(this.handleError)
    );    
  }

  addItem(category: string, item: Iproduct): Observable<Iproduct> {
    return this.http.post<Iproduct>(`${this.apiUrl}/${category}`, item)
    .pipe(
      catchError(this.handleError)
    );
  }

  updateItem(category: string, itemId: string, item: Iproduct): Observable<Iproduct> {
    return this.http.put<Iproduct>(`${this.apiUrl}/${category}/${itemId}`, item)
    .pipe(
      catchError(this.handleError)
    );
  }

  deleteItem(category: string, itemId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${category}/${itemId}`)
    .pipe(
      catchError(this.handleError)
    );
  }

  // services Buy

  getPurchasedItems(category: string): Observable<Iproduct[]> {
    const categoryBuyEndpoint = `${category}-Buy`;
    return this.http.get<Iproduct[]>(`${this.apiUrl}/${categoryBuyEndpoint}`)
    .pipe(
      catchError(this.handleError)
    );
  }


  // Método para adicionar um item comprado na categoria correta
  addPurchasedItem(item: Iproduct): Observable<Iproduct> {
    const categoryBuyEndpoint = `${item.category}-Buy`;
    return this.http.post<Iproduct>(`${this.apiUrl}/${categoryBuyEndpoint}`, item)
    .pipe(
      catchError(this.handleError)
    );
  }

  // Método para remover um item comprado usando a categoria correta e ID
  removePurchasedItem(item: Iproduct): Observable<void> {
    const categoryBuyEndpoint = `${item.category}-Buy`;
    return this.http.delete<void>(`${this.apiUrl}/${categoryBuyEndpoint}/${item.id}`)
    .pipe(
      catchError(this.handleError)
    );
  }

  // Método para adicionar o item de volta à lista de compras original
  addBackToShoppingList(item: Iproduct): Observable<Iproduct> {
    return this.http.post<Iproduct>(`${this.apiUrl}/${item.category}`, item)
    .pipe(
      catchError(this.handleError)
    );
  }
}
