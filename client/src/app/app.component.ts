import { AccountService } from './_services/account.service';
import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { User } from './_models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'The Dating App';
  users:any;
  constructor(private accountService: AccountService){
    // fetching data is naturally asynchronous 
  }

  ngOnInit(): void {
    
    // this.getUsers();
    this.setCurrentUser();
   
  }

  setCurrentUser(){
    const user:User = JSON.parse(localStorage.getItem('user'));
    this.accountService.setCurrentUser(user);
  }

  // getUsers(){
  //   this.http.get('https://localhost:5001/api/users').subscribe((response:[]) => {
  //     this.users = response;
  //     console.log(this.users);
  //   },error => {
  //     console.log(error);
  //   });
  // }


}
