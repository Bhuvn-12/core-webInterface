import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Helpers } from '../helpers';
declare var $: any;

@Component({
    selector: 'app-layouts',
    templateUrl: './layouts.component.html',
    styleUrls: ['./layouts.component.css']
})
export class LayoutsComponent implements OnInit {

    constructor(private _router: Router) { }
    ngOnInit(): void {
 /* this._router.events.subscribe((route) => {
		if (route instanceof NavigationStart) {
			Helpers.setLoading(true);
			Helpers.bodyClass('fixed-navbar');
		}
		if (route instanceof NavigationEnd) {
			window.scrollTo(0, 0);
			Helpers.setLoading(false);
			Helpers.initPage();
		}
	});*/

        Helpers.initLayout();
        $('body').addClass('fixed-layout');
        $('#sidebar-collapse').slimScroll({
           height: '100%',
           railOpacity: '0.9',
        });
   }


}
