import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderModule } from "ngx-ui-loader";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AppRoutingModule } from './app-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppComponent } from './app.component';
import { AddTodoComponent } from './pages/add-todo/add-todo.component';
import { TodoComponent } from './pages/todo/todo.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { TodoCardComponent } from './components/todo-card/todo-card.component';
import { TopBarComponent } from './components/top-bar/top-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    AddTodoComponent,
    TodoComponent,
    HeaderComponent,
    HomeComponent,
    TodoCardComponent,
    TopBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
		ReactiveFormsModule,
		NgxUiLoaderModule,
		NgMultiSelectDropDownModule.forRoot()
  ],
  providers: [
		Title
	],
  bootstrap: [AppComponent]
})
export class AppModule { }
