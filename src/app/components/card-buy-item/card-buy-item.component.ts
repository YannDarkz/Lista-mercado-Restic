import { Component, Input, Output, EventEmitter, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-buy-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-buy-item.component.html',
  styleUrl: './card-buy-item.component.scss'
})
export class CardBuyItemComponent {

  @Input() name!: string;
  @Input() price!: number;

  @Output() remove = new EventEmitter<void>()

  onRemove(): void {
    this.remove.emit();
  }

}
