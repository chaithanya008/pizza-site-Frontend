import { Injectable, Inject } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Item } from './model';

const CART_KEY = 'cart';
const MENU_KEY = 'menu';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private _itemCount: BehaviorSubject<number> = new BehaviorSubject(0);
  public readonly itemCount: Observable<number> = this._itemCount.asObservable();

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) {
    this.getItemCount().then((cnt) => this._itemCount.next(cnt)); // Publishing cart items count
  }

  async addToCart(item: Item) {
    const cart = await this.getCartItems();
    
    // Check is item already exists and modify value
    let cartItem = cart.filter(i => {
      if (i.id == item.id) {
        i.qty += 1;
        return true;
      }
    });

    // If its new item then push into cart
    if (cartItem.length == 0) {
      cart.push({id: item.id, qty: 1});
    }

    this.storage.set(CART_KEY, cart); // Store cart in browser storage

    const cnt = await this.getItemCount(); // Get cart counts
    this._itemCount.next(cnt); // Publishing cart items count
  }

  async getCartItems(): Promise<any[]> {
    return this.storage.get(CART_KEY) || []; // Fetch cart items from browser storage
  }

  async getItemCount() {
    const items = await this.getCartItems(); // Get cart items
    const mapItems = items.map(i => i.qty); // Extract qunatity as array from items
    
    return mapItems.length > 0 ? mapItems.reduce((accumlator, item) => accumlator + item) : 0; // Sum of quantity
  }

  clearCart() {
    this.storage.remove(CART_KEY); // Remove carts from browser storage
    this._itemCount.next(0);
  }

  async modifyItem(id: number, type: string) {
    let cart = await this.getCartItems(); // Get cart items
    
    // Check is item already exists and modify value
    cart = cart.filter(i => {
      if (i.id == id) {
        i.qty = type == 'plus' ? i.qty + 1 : i.qty - 1; // If plus then increase else decrement quantity
      }

      return i.qty >= 1; // If quantity is less than or equal to zero then remove item from cart
    });

    this.storage.set(CART_KEY, cart); // Update cart items

    const cnt = await this.getItemCount(); // Get cart item count
    this._itemCount.next(cnt); // Publish cart item count
  }

  saveMenu(value) {
    this.storage.set(MENU_KEY, value); // Store Menu items into browser storage
  }

  getMenu(): any {
    return this.storage.get(MENU_KEY); // Fetch Menu items from browser storage
  }
}
