import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
@Component({
  selector: 'app-reference-data',
  templateUrl: './reference-data.component.html',
  styleUrls: ['./reference-data.component.css']
})
export class ReferenceDataComponent implements OnInit {

  constructor(private router: Router) { }
// selected;
// open = true;
  ngOnInit() {
  }
  selectedOption(event){
    // this.selected = event.value; 
    // this.open = false;
    //  switch(this.selected){
    //     case "Account": 
    //        this.router.navigate(["/account_detail"]);
    //        break;
    //         }    
   
      if (event.target.value === 'Accounts') {
        this.router.navigate(['/settings/config/refdata/account_detail']);
      } 
       if (event.target.value === 'Customers') {
        this.router.navigate(["/settings/config/refdata/customers"]);
     } else {
      if (event.target.value === 'Products'){
      this.router.navigate(["/settings/config/refdata/products"]);
     }}
    }   
    }


