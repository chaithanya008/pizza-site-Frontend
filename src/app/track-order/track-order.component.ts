import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-track-order',
  templateUrl: './track-order.component.html',
  styleUrls: ['./track-order.component.scss']
})
export class TrackOrderComponent implements OnInit {

  orderDetail: any;
  orderForm: FormGroup;
  alertType: boolean;
  alertMessage: string;

  constructor(
    private httpService: HttpService,
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
      },
      err => {
        this.alertType = false;
      }
    );
  }
}
