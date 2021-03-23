import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'client';
  users:any;
  constructor(private http:HttpClient){
    // fetching data is naturally asynchronous 
  }

  ngOnInit(): void {
    
    this.getUsers();
   
  }

  getUsers(){
    this.http.get('https://localhost:5001/api/users').subscribe((response:[]) => {
      this.users = response;
      console.log(this.users);
    },error => {
      console.log(error);
    });
  }


}