import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Helpers } from './helpers';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'Svayam';
    currentpath;
    constructor(private _router: Router, private route: ActivatedRoute, private location: Location) {
    this.currentpath = this.location.path();
    }

    ngOnInit(): void {
        if (localStorage.getItem('usrDtls')) {
        } else {
            this._router.navigate(['/login']);
        }
    }
}
