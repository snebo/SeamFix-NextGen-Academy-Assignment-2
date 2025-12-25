import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SearchInput } from '../search-input/search-input';

@Component({
  selector: 'app-navbar',
  imports: [SearchInput],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  @Input() cartCount: number = 0;
  @Output() searchRequest = new EventEmitter<string>();

  onSearchRelay(query: string) {
    this.searchRequest.emit(query); // Passing it up to the Parent (App)
  }
}
