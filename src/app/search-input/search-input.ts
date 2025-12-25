import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-input',
  imports: [FormsModule],
  template: `  <input
      type="text"
      [(ngModel)]="searchQuery"
      (input)="onSearch()"
      placeholder="Search products...">
  `,
  styleUrl: './search-input.css',
})
export class SearchInput {
  searchQuery: string = ''
  @Output() searchChanged = new EventEmitter<string>()

  onSearch() {
    this.searchChanged.emit(this.searchQuery)
  }
}
