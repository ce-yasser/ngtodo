import { Injectable } from '@angular/core';
import { Todo } from '../interfaces/todo';

@Injectable({
	providedIn: 'root'
})
export class TodosService {
	constructor() { }

	getAll(): Promise<Array<Todo>> {
		let localstorage: string = localStorage.getItem('todos') ?? '';
		const todos: Array<Todo> = localstorage ? JSON.parse(localstorage) : [];
		return new Promise(resolve => {
			resolve(todos);
		});
	}

	create(todo: Todo) {
		return new Promise(resolve => {
			this.getAll().then(todos => {
				todos.push(todo);
				localStorage.setItem('todos', JSON.stringify(todos));
				resolve(todos.length - 1);
			})
		});
	}


	delete() {

	}
}
