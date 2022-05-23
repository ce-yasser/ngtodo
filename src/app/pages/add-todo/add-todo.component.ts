import { Component, OnInit } from '@angular/core';
import { formatDate, Location } from '@angular/common';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { TodosService } from 'src/app/services/todos.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-add-todo',
	templateUrl: './add-todo.component.html',
	styleUrls: ['./add-todo.component.scss']
})
export class AddTodoComponent implements OnInit {
	taskForm: FormGroup;
	today = (new Date()).setHours(0, 0, 0, 0);

	priorities = {
		0: 'low',
		10: 'medium',
		20: 'high'
	};

	groups = ['group1', 'group2', 'group3'];
	id: string = Math.random().toString(16).slice(2);

	constructor(
		private ngxService: NgxUiLoaderService,
		private location: Location,
		private todosService: TodosService,
		private router: Router
	) {
		this.taskForm = new FormGroup({
			title: new FormControl('', [Validators.required]),
			description: new FormControl('', [Validators.required]),
			group: new FormControl(this.groups[0], [Validators.required]),
			deliveryDate: new FormControl(formatDate(this.today, 'yyyy-MM-dd', 'en'), [Validators.required, this.dateCheck()]),
			priority: new FormControl(String(10), [Validators.required]),
			status: new FormControl('0', [Validators.required]),
			id: new FormControl(this.id, [Validators.required]),
			archive: new FormControl('0', [Validators.required]),
		});

	}

	ngOnInit(): void {}

	submit() {
		this.ngxService.start();
		this.todosService.create(this.taskForm.value).then(id => {
			this.ngxService.stop();
			this.router.navigate(['/todo', id]);
		});
	}

	dateCheck(): ValidatorFn {
		return (control: AbstractControl): { [key: string]: any } | null =>
			(this.today > +new Date(control.value)) ? { "LessThanToday": true } : null;
	}

	goBack() {
		this.location.back();
	}

}
