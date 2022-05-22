import { Component, Input, OnInit } from '@angular/core';
import { Todo } from 'src/app/interfaces/todo';
import { faCheck, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { TodosService } from 'src/app/services/todos.service';
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
	selector: 'app-todo-card',
	templateUrl: './todo-card.component.html',
	styleUrls: ['./todo-card.component.scss']
})
export class TodoCardComponent implements OnInit {
	@Input() todo: Todo;
	faCheck = faCheck;
	faTrashCan = faTrashCan;

	constructor(
		private router: Router,
		private ngxService: NgxUiLoaderService,
		private todosService: TodosService
	) { }

	ngOnInit(): void {
	}

	goToSingle(id: string | undefined) {
		this.router.navigate(['/todo', id]);
	}

	updateStatus() {
		this.ngxService.start();
		this.todosService.markDone(this.todo.id).then(status => {
			this.todo.status = status;
			this.ngxService.stop();
		})
	}

	deleteTodo() {
		this.ngxService.start();
		this.todosService.delete(this.todo.id).then(() => {
			this.ngxService.stop();
		})
	}
}
