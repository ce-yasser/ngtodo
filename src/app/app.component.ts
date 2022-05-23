import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';


@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	openNav: boolean = true;

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private titleService: Title
	) {
		this.router.events.pipe(
			filter(event => event instanceof NavigationEnd),
		).subscribe(() => {
			const rt = this.getChild(this.activatedRoute);
			rt.data.subscribe((data: any) => {
				this.titleService.setTitle(data.title);
			});
		});

	}
	ngOnInit(): void {
		let navStatus = localStorage.getItem('nav');
		this.openNav = navStatus == null ? true : navStatus === 'true';
	}

	getChild(activatedRoute: ActivatedRoute): any {
		if (activatedRoute.firstChild) {
			return this.getChild(activatedRoute.firstChild);
		} else {
			return activatedRoute;
		}
	}

	navStatusHandler(navStatus: boolean) {
		this.openNav = navStatus;
	}
}
