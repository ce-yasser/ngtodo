import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TodosService } from 'src/app/services/todos.service';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { Todo } from 'src/app/interfaces/todo';


@Component({
	selector: 'app-todo',
	templateUrl: './todo.component.html',
	styleUrls: ['./todo.component.scss']
})

export class TodoComponent implements OnInit {
	todoId: number;
	todo: Todo | undefined;

	constructor(
		private ngxService: NgxUiLoaderService,
		private activatedRoute: ActivatedRoute,
		private todosService: TodosService
	) {
		const routeParams = this.activatedRoute.snapshot.paramMap;
		this.todoId = Number(routeParams.get('Id'));
	}

	ngOnInit(): void {
		this.ngxService.start();
		this.todosService.get(this.todoId).then(todo => {
			this.todo = todo;
			this.ngxService.stop();
		});
	}

}
