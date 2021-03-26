import { AccountService } from './../_services/account.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { Router } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model:any = {}
  loggedIn:boolean;
 

  constructor(public accountService: AccountService, 
    private router:Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {

  }

  login(){
    this.accountService.login(this.model).subscribe(response => {
      this.router.navigateByUrl('/members');
    },error => {
      this.router.navigateByUrl('/');
      this.toastr.error(error.error);
      
    });

  }

  logout(){
    this.accountService.logout();
      console.log(this.loggedIn);
  }

  // double exclamation marks turn it into a boolean
  /*
  getCurrentUser(){
    this.accountService.currentUser$.subscribe(user => {
      this.loggedIn = !!user;
    }, error => {
      console.log(error);
    })
  }
  */

}
