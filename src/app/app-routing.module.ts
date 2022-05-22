import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddTodoComponent } from './pages/add-todo/add-todo.component';
import { HomeComponent } from './pages/home/home.component';
import { TodoComponent } from './pages/todo/todo.component';

const routes: Routes = [
	{ path: '', component: HomeComponent, data: {title:'Home'} },
	{ path: 'add', component: AddTodoComponent, data: { title: 'Add Task' } },
	{ path: 'todo/:Id', component: TodoComponent, data: { title: 'Todo' } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
