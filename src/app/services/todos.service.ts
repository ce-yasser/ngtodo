import { Injectable } from '@angular/core';
import { faCropSimple } from '@fortawesome/free-solid-svg-icons';
import { Todo } from '../interfaces/todo';

@Injectable({
	providedIn: 'root'
})
export class TodosService {
	constructor() { }

	/**
	 * Get all todos
	 */
	getAll(): Promise<Array<Todo>> {
		let localstorage: string = localStorage.getItem('todos') ?? '';
		const todos: Array<Todo> = localstorage ? JSON.parse(localstorage) : [];
		return new Promise(resolve => {
			resolve(todos);
		});
	}

	/**
	 * Create todo
	 * @param todo 
	 */
	create(todo: Todo): Promise<string> {
		return new Promise(resolve => {
			this.getAll().then(todos => {
				todos.push(todo);
				localStorage.setItem('todos', JSON.stringify(todos));
				resolve(todo.id);
			})
		});
	}

	markDone(id: string): Promise<string> {
		return new Promise(resolve => {
			this.getAll().then(todos => {
				const newTodos = todos.map(todo => {
					if (todo.id == id) {
						return { ...todo, status: '1' };
					}
					return todo;
				});
				localStorage.setItem('todos', JSON.stringify(newTodos));
				resolve('1');
			})
		});
	}

	/**
	 * Get single group
	 * @param id Group ID
	 */
	get(id: string | null): Promise<Todo | undefined> {
		return new Promise(resolve => {
			this.getAll().then(todos => {
				resolve(todos.find(todo => todo.id == id));
			});
		});
	}

	/**
	 * Sort todos by group
	 * @param todos an array of todos
	 */
	group(todos: Array<Todo>): Promise<Array<Todo>> {
		return new Promise(resolve => {
			let grouped: any = [];

			todos.map(todo => {
				if (!grouped[todo.group]) {
					grouped[todo.group] = [todo]
				} else {
					grouped[todo.group].push(todo);
				}
			});

			resolve(grouped);
		});
	}

	/**
	 * Filter groups 
	 * @param filters object contains start date, end date, title and group name
	 */
	getFilteredTodos(filters: { 'start': string, 'end': string, 'title': string, 'group': string }): Promise<Array<Todo>> {
		return new Promise(resolve => {
			this.getAll().then(todos => {
				this.filterByTitle(todos, filters.title).then(titledTodos => {
					this.filterByGroup(titledTodos, filters.group).then(groupTodos => {
						this.filterByDate(groupTodos, filters.start, filters.end).then(filteredTodos => {
							resolve(filteredTodos);
						});
					});
				});
			});
		});
	}

	/**
	 * Filter by title
	 * @param todos 
	 * @param title string used for search
	 */
	filterByTitle(todos: Array<Todo>, title: string): Promise<Array<Todo>> {
		return new Promise(resolve => {
			if (!title) {
				resolve(todos);
			}
			const filtered = todos.filter(todo => {
				return todo.title.toLowerCase().includes(title.toLowerCase());
			});

			resolve(filtered);
		});
	}

	/**
	 * Find todos of specific group
	 * @param todos 
	 * @param group group name
	 */
	filterByGroup(todos: Array<Todo>, group: string): Promise<Array<Todo>> {
		return new Promise(resolve => {
			if (!group) {
				resolve(todos);
			}
			const groups = group.toLowerCase().split(',');
			const filtered = todos.filter(todo => {
				return groups.indexOf(todo.group.toLowerCase()) != -1;
			});

			resolve(filtered);
		});
	}

	/**
	 * Filter todos by date
	 * @param todos 
	 * @param start string start date
	 * @param end string end date
	 */
	filterByDate(todos: Array<Todo>, start: string, end: string): Promise<Array<Todo>> {
		return new Promise(resolve => {
			if (!start && !end) {
				resolve(todos);
			}

			let startDate = start ? new Date(start) : 0;
			let endDate = end ? new Date(end) : Infinity;
			const filtered = todos.filter(todo => {
				const deliveryDate = new Date(todo.deliveryDate);
				return (+deliveryDate <= +endDate && +deliveryDate >= +startDate);
			});

			resolve(filtered);
		});
	}


}
