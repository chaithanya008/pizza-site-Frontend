import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { environment } from 'src/environments/environment';
import { CartService } from '../cart.service';
declare var jQuery: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  menus: Menu[];
  cartItemCount: number;

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
