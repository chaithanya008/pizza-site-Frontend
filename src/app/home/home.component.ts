import { Component, OnInit, TemplateRef } from "@angular/core";
import { HttpService } from "../http.service";
import { environment } from "src/environments/environment";
import { CartService } from "../cart.service";
import { Item, Menu, MenuData } from "../model";
declare var jQuery: any;

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  title = "Euro Pizza";
  menus: Menu[];
  cartItemCount: number;
  isLoading: boolean = true;

  orderMenus: Menu[];
  cartItems: any[];
  totalEur: number;
  totalUsd: number;

  constructor(
    private httpService: HttpService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    jQuery(function () {
      jQuery("#toastMsg").toast("show");
    });

    // Fetch menu from server
    this.httpService.getMenu().subscribe(
      (res: MenuData) => {
        this.menus = res.data;
        this.isLoading = false;
        this.cartService.saveMenu(this.menus); // Store in browser storage
        this.prepareCartItems();
      },
      (err) => {
        console.log(err);
      }
    );

    this.cartService.itemCount.subscribe((cnt) => (this.cartItemCount = cnt)); // Listening for item count
  }

  // prepare
  async prepareCartItems() {
    this.totalEur = 0;
    this.totalUsd = 0;

    this.cartItems = [];
    this.menus = this.cartService.getMenu() || []; // Fetch Menu

    this.orderMenus = this.menus
      .map((m: any) => m.items)
      .reduce((previous, current) => previous.concat(current)); // Merging all items in single array

    // fetch cart itemss from browser storage
    this.cartService.getCartItems().then((items) => {
      if (items.length == 0) {
        return;
      }

      // Itrating one by one
      items.forEach((item) => {
        const existedMenu = this.orderMenus.filter((i) => i.id == item.id); // Check if item matched with menu items
        const menu: any = existedMenu.length > 0 ? existedMenu[0] : null; // If matched then pick first value

        console.log(menu);

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

  async modifyItem(id: number, type: string) {
    await this.cartService.modifyItem(id, type);

    this.prepareCartItems(); // Refresh carts value
  }

  getImgUrl(url: string): string {
    return `${environment.siteUrl}/${url}`; // Generate image url
  }

  async addToCart(item: Item) {
    jQuery(function () {
      jQuery("#toastMsg").toast("show");
    });

    await this.cartService.addToCart(item); // Add item to cart
    await this.prepareCartItems();
  }
}
