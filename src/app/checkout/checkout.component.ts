import { Component, OnInit } from "@angular/core";
import { CartService } from "../cart.service";
import { HttpService } from "../http.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Item } from "../model";
import { Router } from "@angular/router";

@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.scss"],
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
    private fb: FormBuilder,
    private route: Router
  ) {}

  ngOnInit() {
    // Prepare checkout form
    this.orderForm = this.fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      contact: ["", Validators.required],
      address: ["", Validators.required],
    });

    this.initCartItems(); // Initialize cart items
    
  }

  initCartItems() {
    this.totalEur = 0;
    this.totalUsd = 0;

    this.cartItems = [];
    this.menus = this.cartService.getMenu() || []; // Fetch Menu

    this.menus = this.menus
      .map((m: any) => m.items)
      .reduce((previous, current) => previous.concat(current)); // Merging all items in single array

    // fetch cart itemss from browser storage
    this.cartService.getCartItems().then((items) => {
      if (items.length == 0) {
        this.route.navigate(["/"]);
      }

      // Itrating one by one
      items.forEach((item) => {
        const existedMenu = this.menus.filter((i) => i.id == item.id); // Check if item matched with menu items
        const menu = existedMenu.length > 0 ? existedMenu[0] : null; // If matched then pick first value

        // If menu matched
        if (menu != null) {
          const eur = item.qty * menu.price_eur; // Sum of EUR * quantity
          const usd = item.qty * menu.price_usd; // Sum of USD * quantity

          this.totalEur += eur; // Total sum of order value in EUR
          this.totalUsd += usd; // Total sum of order value in USD

          // Push into cart items to display on checkout page
          this.cartItems.push({
            id: menu.id,
            name: menu.name,
            description: menu.description,
            qty: item.qty,
            priceEur: eur,
            priceUsd: usd,
          });
        }
      });
    });
  }

  // Modifying cart quantity plus/minus
  async modifyItem(id: number, type: string) {
    await this.cartService.modifyItem(id, type);

    this.initCartItems(); // Refresh carts value
  }

  // Place and new order
  async placeOrder() {
    // Extracting form value
    const { firstName, lastName, contact, address } = this.orderForm.value;

    const orders = await this.cartService.getCartItems(); // Get all cart items from browser storage

    // Prepare form data to place an order
    const body = {
      name: `${firstName} ${lastName}`,
      contact: contact,
      address: address,
      order: JSON.stringify(orders),
    };

    // Post form data to server
    this.httpService.placeOrder(body).subscribe(
      (res: any) => {
        this.alertType = true; // Success
        this.isOrderPlaced = true; // Indicating to view that order is placed and switch to order details view
        this.orderDetail = res.data; // Assigning order details
        this.cartService.clearCart(); // Clear cart because order placed
      },
      (err) => {
        this.alertType = false; // Failed
      }
    );
  }
}
