import { Injectable, Inject } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { BehaviorSubject, Observable } from 'rxjs';

const CART_KEY = 'cart';
const MENU_KEY = 'menu';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private _itemCount: BehaviorSubject<number> = new BehaviorSubject(0);
  public readonly itemCount: Observable<number> = this._itemCount.asObservable();

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) {
    this.getItemCount().then((cnt) => this._itemCount.next(cnt));
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

    if (cartItem.length == 0) {
      cart.push({id: item.id, qty: 1});
    }

    this.storage.set(CART_KEY, cart);

    const cnt = await this.getItemCount();
    this._itemCount.next(cnt);
  }

  async getCartItems(): Promise<any[]> {
    return this.storage.get(CART_KEY) || [];
  }

  async getItemCount() {
    const items = await this.getCartItems();
    const mapItems = items.map(i => i.qty);
    
    return mapItems.length > 0 ? mapItems.reduce((accumlator, item) => accumlator + item) : 0;
  }

  clearCart() {
    this.storage.remove(CART_KEY);
    this._itemCount.next(0);
  }

  async modifyItem(id: number, type: string) {
    let cart = await this.getCartItems();
    
    // Check is item already exists and modify value
    cart = cart.filter(i => {
      if (i.id == id) {
        i.qty = type == 'plus' ? i.qty + 1 : i.qty - 1;
      }

      return i.qty >= 1;
    });

    this.storage.set(CART_KEY, cart);

    const cnt = await this.getItemCount();
    this._itemCount.next(cnt);
  }

  saveMenu(value) {
    this.storage.set(MENU_KEY, value);
  }

  getMenu() {
    return this.storage.get(MENU_KEY);
  }
}
