import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
	today = formatDate(new Date(), 'yyyy-MM-dd', 'en');
	week = formatDate(new Date(new Date().setDate(new Date().getDate() + 7)), 'yyyy-MM-dd', 'en');

	constructor() { }

	ngOnInit(): void {
	}

}
