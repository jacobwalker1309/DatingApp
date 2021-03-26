import { AuthGuard } from './_guards/auth.guard';
import { MessagesComponent } from './messages/messages.component';
import { ListsComponent } from './lists/lists.component';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: '', component:HomeComponent},
  {
    path:'',
    runGuardsAndResolvers:'always',
    canActivate:[AuthGuard],
    children:[

      {path: 'members', component:MemberListComponent, canActivate:[AuthGuard]},
      {path: 'members/:id', component:MemberListComponent},
      {path: 'lists', component: ListsComponent},
      {path: 'messages', component:MessagesComponent},
      {path: '**', component:HomeComponent, pathMatch: 'full'}
      
    ]
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
