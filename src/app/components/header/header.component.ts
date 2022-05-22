import { formatDate } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { faNavicon, faHouse, faList, faCalendarDay, faCalendarWeek, faCheckCircle, faTrashCan, faFolder, faAngleDown } from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
	today = formatDate(new Date(), 'yyyy-MM-dd', 'en');
	week = formatDate(new Date(new Date().setDate(new Date().getDate() + 7)), 'yyyy-MM-dd', 'en');
	openNav: boolean = true;
	openGroups: boolean = false;

	faNavicon = faNavicon;
	faHouse = faHouse;
	faList = faList;
	faCalendarDay = faCalendarDay;
	faCalendarWeek = faCalendarWeek;
	faCheckCircle = faCheckCircle;
	faTrashCan = faTrashCan;
	faFolder = faFolder;
	faAngleDown = faAngleDown;

	@Output() navStatus: EventEmitter<boolean> = new EventEmitter();

	constructor() { }

	ngOnInit(): void {
		let navStatus = localStorage.getItem('nav');
		this.openNav = navStatus === 'true';
		this.navStatus.emit(this.openNav);
	}

	toggle() {
		this.openNav = !this.openNav;
		localStorage.setItem('nav', JSON.stringify(this.openNav));
		if (!this.openNav) {
			this.openGroups = false;
		}
		this.navStatus.emit(this.openNav);
	}

	toggleGroups() {
		this.openGroups = !this.openGroups;
		if (this.openGroups) {
			this.openNav = true;
			this.navStatus.emit(this.openNav);
		}

	}

}
