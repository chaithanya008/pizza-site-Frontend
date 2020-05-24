import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { environment } from 'src/environments/environment';
import { CartService } from '../cart.service';
import { Item, Menu, MenuData } from '../model';
declare var jQuery: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  title = 'Menu';
  menus: Menu[];
  cartItemCount: number;
  isLoading: boolean = true;

  constructor(
    private httpService: HttpService,
    private cartService: CartService
  ) { }

  ngOnInit() {
    jQuery(function(){
      jQuery('#toastMsg').toast('show');
    });

    this.httpService.getMenu().subscribe(
      (res: MenuData) => {
        this.menus = res.data;
        this.isLoading = false;
        this.cartService.saveMenu(this.menus);
      },
      err => {
        console.log(err);
      }
    );

    this.cartService.itemCount.subscribe(cnt => this.cartItemCount = cnt);
  }

  getImgUrl(url: string): string {
    return `${environment.siteUrl}/${url}`;
  }

  addToCart(item: Item) {
    jQuery(function(){
      jQuery('#toastMsg').toast('show');
    });

    console.log(item);
    
    this.cartService.addToCart(item);
  }

}
