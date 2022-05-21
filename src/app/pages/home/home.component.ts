import { Component, OnInit } from '@angular/core';
import { TodosService } from 'src/app/services/todos.service';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Todo } from 'src/app/interfaces/todo';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
	todos: any[] = [];
	sorting: object | boolean = false;
	grouped: string = '1';
	title: string = '';
	startDate: string = '';
	endDate: string = '';
	group: string = '';

	constructor(
		private ngxService: NgxUiLoaderService,
		private route: ActivatedRoute,
		private router: Router,
		private todosService: TodosService
	) {
		this.route.queryParams.subscribe(params => {
			this.startDate = params['startDate'] ?? this.startDate;
			this.endDate = params['endDate'] ?? this.endDate;
			this.title = params['title'] ?? this.title;
			this.grouped = params['grouped'] ?? this.grouped;
			this.group = params['group'] ?? this.group;
		});

		// Refresh on query args change
		this.router.routeReuseStrategy.shouldReuseRoute = function () {
			return false;
		};
	}

	ngOnInit(): void {
		this.ngxService.start();
		this.refreshTodos().then(todos => {
			this.ngxService.stop();
			this.todos = todos;
		});
	}

	refreshTodos(): Promise<any> {
		return new Promise(resolve => {
			this.todosService.getFilteredTodos({ 'start': this.startDate, 'end': this.endDate, 'title': this.title, 'group': this.group }).then(filteredTodos => {
				resolve(this.getTodos(filteredTodos));
			});
		});
	}

	getTodos(allTodos: Array<Todo>): Promise<any> {
		return new Promise<any[]>(resolve => {
			if (this.grouped == '1') {
				this.todosService.group(allTodos).then(todos => {
					resolve(todos);
				});
			} else {
				resolve(allTodos);
			}
		});
	}
}
