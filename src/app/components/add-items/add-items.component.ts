import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { CommonModule } from '@angular/common';
import { Iproduct } from '../../interfaces/item-list';

import { ShoppingListService } from '../../services/shopping-list/shopping-list.service';

@Component({
  selector: 'app-add-items',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-items.component.html',
  styleUrl: './add-items.component.scss'
})
export class AddItemsComponent {

  
  @Output() itemUpdated = new EventEmitter<void>()
  @Output() notifyAddItem = new EventEmitter<void>()
  @Output() notifyEditItem = new EventEmitter<void>()
  
  constructor(private formBuilder: FormBuilder, private productService: ShoppingListService) { }

  // itemsByCategory = {
  //   cold: [] as Iproduct[],
  //   perishables: [] as Iproduct[],
  //   cleaning: [] as Iproduct[],
  //   others: [] as Iproduct[]
  // };

  currentItemCategory: string | null = null;
  currentItemId: string | null = null

  addItemForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    quantity: [1, [Validators.required, Validators.min(1)]],
    category: ['', Validators.required]
  });

  editing: boolean = false


  addItem(): void {
    if (this.addItemForm.valid) {
      const newItem = this.addItemForm.value as Iproduct;
      const newCategory = newItem.category?.toLowerCase();
  
      if (this.editing && this.currentItemId !== null) {
        if (newCategory !== this.currentItemCategory) {
          
          this.productService.deleteItem(this.currentItemCategory!, this.currentItemId).subscribe(() => {
            this.productService.addItem(newCategory!, newItem).subscribe(() => {
              this.notifyEditItem.emit();
              this.itemUpdated.emit();
            });
          });
        } else {
          this.productService.updateItem(this.currentItemCategory, this.currentItemId, newItem).subscribe(() => {
            this.notifyEditItem.emit();
            this.itemUpdated.emit();
          });
        }
      } else if (newCategory) {
        // Adiciona um novo item
        this.productService.addItem(newCategory, newItem).subscribe(() => {
          this.notifyAddItem.emit();
          this.itemUpdated.emit();
        });
      }
  
      // Resetando o formulário e variáveis de controle
      this.addItemForm.reset();
      this.editing = false;
      this.currentItemId = null;
      this.currentItemCategory = null;
    }
  }

  startEdit(item: Iproduct, category: string): void {
    this.addItemForm.patchValue(item);
    this.editing = true;
    this.currentItemId = item.id; 
    this.currentItemCategory = category;
  }

  cancelEdit() {
    this.addItemForm.reset();
    this.editing = false;
    this.currentItemId = null;
    this.currentItemCategory = null;
  }

  get itemName() {
    return this.addItemForm.get('name')!;
  }

  get itemPrice() {
    return this.addItemForm.get('price')!;
  }

  get itemQuantity() {
    return this.addItemForm.get('quantity')!;
  }

  get itemCategory() {
    return this.addItemForm.get('category')!;
  }

}
