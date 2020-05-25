import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from '../http.service';
import { CartService } from '../cart.service';
import { Item, OrderDetail } from '../model';

@Component({
  selector: 'app-track-order',
  templateUrl: './track-order.component.html',
  styleUrls: ['./track-order.component.scss']
})
export class TrackOrderComponent implements OnInit {

  orderDetail: OrderDetail;
  orderForm: FormGroup;
  alertType: boolean;
  alertMessage: string;

  menus: Item[];
  orderItems: any[] = [];

  constructor(
    private httpService: HttpService,
    private cartService: CartService,
    private fb: FormBuilder
  ) {
    this.orderForm = this.fb.group({
      order: ['', Validators.required],
      contact: ['', Validators.required],
    });
  }

  ngOnInit() {
  }

  trackOrder() {
    this.alertType = null;
    
    // Fetch order details
    this.httpService.trackOrder(this.orderForm.value).subscribe(
      (res: any) => {
        this.orderDetail = res.data;
        this.alertType = res.data != null;
        this.prepareOrderItems();
      },
      err => {
        this.alertType = false;
      }
    );
  }

  // Extracting order
  prepareOrderItems() {
    this.menus = this.cartService.getMenu() || []; // Fetch Menu

    this.menus = this.menus.map((m: any) => m.items)
        .reduce((previous, current) => previous.concat(current)); // Merging all items in single array

    // Itrating one by one
    this.orderDetail.items.forEach(item => {
      const existedMenu = this.menus.filter(i => i.id == item.id); // Check if item matched with menu items
      const menu = existedMenu.length > 0 ? existedMenu[0] : null; // If matched then pick first value

      // If menu matched
      if (menu != null) {
        // Push into cart items to display on checkout page
        this.orderItems.push({
          id: menu.id,
          name: menu.name,
          description: menu.description,
          qty: item.quantity,
          priceEur: item.total_price_eur,
          priceUsd: item.total_price_usd
        });
      }
    });
  }
}
