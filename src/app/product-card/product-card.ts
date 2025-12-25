import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../models/product.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule], // required to use pipes for type saftey
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  @Input() product!: Product;
  @Input() isSelected: boolean = false;
  // notify when component is clicked
  @Output() cardClicked = new EventEmitter<Product>()

  // trigger the notice
  onSelect() { this.cardClicked.emit(this.product) }
}
