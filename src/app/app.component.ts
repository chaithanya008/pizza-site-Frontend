import { Component, OnInit } from '@angular/core';
import { CartService } from './cart.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'pizza-site-Frontend';
  cartItemCount: number;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.itemCount.subscribe(data => this.cartItemCount = data);
  }
}
