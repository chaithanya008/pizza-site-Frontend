import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { HttpService } from '../http.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  orderForm: FormGroup;

  menus: Item[];
  cartItems: any[];
  totalEur: number;
  totalUsd: number;

  orderDetail: any;
  isOrderPlaced: boolean;
  alertType: boolean;

  constructor(
    private httpService: HttpService,
    private cartService: CartService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.orderForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      contact: ['', Validators.required],
      address: ['', Validators.required]
    });

    this.initCartItems();
  }

  initCartItems() {
    this.totalEur = 0;
    this.totalUsd = 0;

    this.cartItems = [];
    this.menus = this.cartService.getMenu()
        .map(m => m.items)
        .reduce((previous, current) => previous.concat(current));

    this.cartService.getCartItems().then(items => {
      items.forEach(item => {
        const existedMenu = this.menus.filter(i => i.id == item.id);
        const menu = existedMenu.length > 0 ? existedMenu[0] : null;

        if (menu != null) {
          const eur = item.qty * menu.price_eur;
          const usd = item.qty * menu.price_usd;

          this.totalEur += eur;
          this.totalUsd += usd;

          this.cartItems.push({
            id: menu.id,
            name: menu.name,
            description: menu.description,
            qty: item.qty,
            priceEur: eur,
            priceUsd: usd
          });
        }
      })
    });
  }

  async modifyItem(id: number, type: string) {
    await this.cartService.modifyItem(id, type);

    this.initCartItems();
  }

  async placeOrder() {
    const {
      firstName,
      lastName, 
      contact, 
      address
    } = this.orderForm.value;

    const orders = await this.cartService.getCartItems();
    const body = {
      "name": `${firstName} ${lastName}`,
      "contact": contact,
      "address": address,
      "order": JSON.stringify(orders)
    }

    this.httpService.placeOrder(body).subscribe(
      (res: any) => {
        this.alertType = true;
        this.isOrderPlaced = true;
        this.orderDetail = res.data;
        this.cartService.clearCart();
      },
      err => {
        this.alertType = false;
      }
    );
  }
}
