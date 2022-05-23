import { Component, OnInit } from '@angular/core';
import { TodosService } from 'src/app/services/todos.service';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Todo } from 'src/app/interfaces/todo';
import { FormGroup, FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { faPlusCircle, faCheck, faTrashCan } from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
	todos: any[] = [];
	archive: string = '';
	status: string = '';
	grouped: string = '1';
	title: string = '';
	startDate: string = '';
	endDate: string = '';
	group: Array<string> = [];
	filterForm: FormGroup;
	pageTitle: string = 'Home';
	faPlusCircle = faPlusCircle;
	faCheck = faCheck;
	faTrashCan = faTrashCan;
	selected: Array<string> = [];

	constructor(
		private ngxService: NgxUiLoaderService,
		private route: ActivatedRoute,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private todosService: TodosService,
		private titleService: Title
	) {

		// Set params variables
		this.route.queryParams.subscribe(params => {
			this.archive = params['archive'] ?? this.archive;
			this.startDate = params['startDate'] ?? this.startDate;
			this.endDate = params['endDate'] ?? this.endDate;
			this.group = (params['group'] instanceof Array) ? params['group'] : (typeof params['group'] != 'undefined') ? [params['group']] : this.todos;
			this.title = params['title'] ?? this.title;
			this.status = params['status'] ?? this.status;
			this.grouped = params['grouped'] ?? this.grouped;
			this.pageTitle = params['pageTitle'] ?? this.pageTitle;
		});

		// Refresh on query args change
		this.router.routeReuseStrategy.shouldReuseRoute = function () {
			return false;
		};

		// Set search form variables
		this.filterForm = new FormGroup({
			startDate: new FormControl(this.startDate),
			endDate: new FormControl(this.endDate),
			title: new FormControl(this.title),
			group: new FormControl(this.group)
		});
	}

	ngOnInit(): void {
		this.ngxService.start();
		this.refreshTodos().then(todos => {
			this.ngxService.stop();
			this.todos = todos;
		});
		this.titleService.setTitle(this.pageTitle);
	}

	refreshTodos(): Promise<any> {
		return new Promise(resolve => {
			this.todosService.getFilteredTodos({ 'archive': this.archive, 'start': this.startDate, 'end': this.endDate, 'title': this.title, 'status': this.status, 'group': this.group }).then(filteredTodos => {
				this.selected = [];
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

	submitFilter() {
		const queryParams: Params = this.filterForm.value;
		this.router.navigate(
			[],
			{
				relativeTo: this.activatedRoute,
				queryParams: queryParams,
				queryParamsHandling: 'merge', // remove to replace all query params by provided
			});
	}

	selectedIdHandler(obj: any) {
		if (obj.selected) {
			if (this.selected.indexOf(obj.id) == -1) {
				this.selected.push(obj.id);
			}
		}
		if (!obj.selected) {
			this.selected = this.selected.filter(id => id !== obj.id);
		}
	}

	updateSelected() {
		this.ngxService.start();
		this.todosService.markDone(this.selected).then(() => {
			this.refreshTodos().then(todos => {
				this.ngxService.stop();
				this.todos = todos;
			});
		});
	}

	deleteSelected() {
		this.ngxService.start();
		this.todosService.delete(this.selected).then(() => {
			this.refreshTodos().then(todos => {
				this.ngxService.stop();
				this.todos = todos;
			});
		});
	}

	/**
	 * Refresh content on change in 
	 * todo card
	 * @param archive 
	 */
	deleteHandler(change: boolean) {
		this.ngxService.start();
		this.todosService.delete(this.selected).then(() => {
			this.refreshTodos().then(todos => {
				this.ngxService.stop();
				this.todos = todos;
			});
		});
	}
}
