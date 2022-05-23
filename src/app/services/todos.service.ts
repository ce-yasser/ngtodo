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
	 * Get Archived todos
	 */
	getArchived(): Promise<Array<Todo>> {
		let localstorage: string = localStorage.getItem('archivedTodos') ?? '';
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

	/**
	 * Change todo status to '1'
	 * @param id todo id
	 */
	markDone(id: Array<string> | string): Promise<string> {
		return new Promise(resolve => {
			id = (typeof id == 'string') ? [id] : id;
			this.getAll().then(todos => {
				const newTodos = todos.map(todo => {
					if (id.indexOf(todo.id) != -1) {
						return { ...todo, status: '1' };
					}
					return todo;
				});
				localStorage.setItem('todos', JSON.stringify(newTodos));
				resolve('1');
			})
		});
	}

	delete(id: Array<string> | string): Promise<string> {
		return new Promise(resolve => {
			id = (typeof id == 'string') ? [id] : id;
			this.getAll().then(todos => {
				const allTodos = todos.filter(todo => {
					if (id.indexOf(todo.id) != -1) {
						todo.archive = '1';
						this.addToArchive(todo);
					}
					return todo.id != id;
				});
				localStorage.setItem('todos', JSON.stringify(allTodos));
				resolve('1');
			})
		});
	}

	/**
	 * Create todo
	 * @param todo 
	 */
	addToArchive(todo: Todo): Promise<string> {
		return new Promise(resolve => {
			this.getArchived().then(todos => {
				const archivedTodos = todos.filter(oldtodo => oldtodo.id != todo.id);
				archivedTodos.push(todo);
				localStorage.setItem('archivedTodos', JSON.stringify(archivedTodos));
				resolve(todo.id);
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
	getFilteredTodos(filters: { archive: string, 'start': string, 'end': string, 'title': string, 'status': string, 'group': Array<string> }): Promise<Array<Todo>> {
		return new Promise(resolve => {
			const getTodos = filters.archive === '1' ? this.getArchived() : this.getAll();
			getTodos.then(todos => {
				this.filterByTitle(todos, filters.title).then(titledTodos => {
					this.filterByStatus(titledTodos, filters.status).then(statusTodos => {
						this.filterByGroup(statusTodos, filters.group).then(groupTodos => {
							this.filterByDate(groupTodos, filters.start, filters.end).then(filteredTodos => {
								resolve(filteredTodos);
							});
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
	 * Filter by Status
	 * @param todos 
	 * @param status if status equals '1', then get done todos
	 */
	filterByStatus(todos: Array<Todo>, status: string): Promise<Array<Todo>> {
		return new Promise(resolve => {
			if (!status) {
				resolve(todos);
			}
			const filtered = todos.filter(todo => {
				return todo.status === status;
			});

			resolve(filtered);
		});
	}

	/**
	 * Find todos of specific group
	 * @param todos 
	 * @param group group name
	 */
	filterByGroup(todos: Array<Todo>, groups: Array<string>): Promise<Array<Todo>> {
		return new Promise(resolve => {
			if (!groups.length) {
				resolve(todos);
			}
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
