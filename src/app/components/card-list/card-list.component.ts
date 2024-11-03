import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.scss'
})
export class CardListComponent {

  @Input() name!: string;
  @Input() price!: number;
  @Input() quantity!: number;

  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() buy = new EventEmitter<void>()

onEdit() {
  this.edit.emit();

  
}

onDelete() {
  this.delete.emit();
  
}

onBuy() {
  this.buy.emit();
}


}
