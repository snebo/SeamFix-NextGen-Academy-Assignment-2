import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Product } from './models/product.model';
import { Navbar } from './navbar/navbar';
import { ProductCard } from './product-card/product-card';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, ProductCard],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('product_browsing_interface');
  cart: Product[] = []
  // test products
  products: Product[] = [
    {
      id: 1,
      name: 'Wireless Headphones',
      description: 'Premium noise-cancelling wireless headphones with 40-hour battery life.',
      price: 199.99,
      imageUrl: 'https://placehold.co/200x200?text=Headphones'
    },
    {
      id: 2,
      name: 'Smart Watch',
      description: 'Fitness tracker with heart rate monitor and built-in GPS.',
      price: 249.50,
      imageUrl: 'https://placehold.co/200x200?text=Smart+Watch'
    },
    {
      id: 3,
      name: 'Mechanical Keyboard',
      description: 'RGB backlit mechanical keyboard with tactile blue switches.',
      price: 89.99,
      imageUrl: 'https://placehold.co/200x200?text=Keyboard'
    },
    {
      id: 4,
      name: 'Gaming Mouse',
      description: 'Ultra-lightweight ergonomic mouse with adjustable DPI settings.',
      price: 59.00,
      imageUrl: 'https://placehold.co/200x200?text=Mouse'
    },
    {
      id: 5,
      name: 'Portable Speaker',
      description: 'Waterproof Bluetooth speaker with deep bass and 360-degree sound.',
      price: 129.95,
      imageUrl: 'https://placehold.co/200x200?text=Speaker'
    },
    {
      id: 6,
      name: 'USB-C Hub',
      description: '7-in-1 multi-port adapter with HDMI, USB-A, and SD card slots.',
      price: 45.00,
      imageUrl: 'https://placehold.co/200x200?text=USB+Hub'
    },
  ]
  filteredProducts: Product[] = [...this.products]

  handleSearch(query: string) {
    const searchTerm = query.toLowerCase();

    this.filteredProducts = this.products.filter(p =>
      p.name.toLowerCase().includes(searchTerm)
    );
  }

  // parent listening for product click
  handleCardClicked(clickedItem: Product) {
    const idx = this.cart.findIndex(p => p.id === clickedItem.id) //get current idx if it exists
    if (idx > -1) {
      this.cart.splice(idx, 1); // remove it from cart
    } else { this.cart.push(clickedItem) }
  }

  // quick check
  isProductInCart(id: number): boolean {
    return this.cart.some(p => p.id === id);
  }
}
