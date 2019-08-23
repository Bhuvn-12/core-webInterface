import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { ReportsService } from '../services/reports/reports.service';
import { AppService} from '../app.service';
import { TbalanceService } from '../services/reports/control/tbalance.service';
import { ArrlistingService } from '../services/reports/control/arrlisting.service';
import { JrnllistingService } from '../services/reports/control/jrnllisting.service';
import { RwaTbalanceService } from '../services/reports/complience/rwa-tbalance.service';
import { RwaArrlistingService } from '../services/reports/complience/rwa-arrlisting.service';
import { RwaJrnllistingService } from '../services/reports/complience/rwa-jrnllisting.service';



@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent {
  httpUrl;
  tempacct_num;
  acct_numlist = [];
  gaapArray;
  currTypeArray;
  cuurCodeArray;
  reload;
  rptUnit;

  constructor( private router: Router, private tbalService: TbalanceService,
    private route: ActivatedRoute, private arrService: ArrlistingService, private jrnlService: JrnllistingService,
    private reportService: ReportsService, private rwatbalService: RwaTbalanceService, private rwaarrService: RwaArrlistingService,
    private rwajrnlService: RwaJrnllistingService, private appService: AppService) {
    // this.httpUrl = this.tbalService.url;
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/report') {
        }
      }
    });
  }
/*   callreport(event) {
    this.show = true;
    this.router.navigate(['report/' + event]);
  } */

  // tslint:disable-next-line: use-life-cycle-interface
  async ngOnInit() {
    this.tbalService.show_trial_btn = false;
    this.arrService.show_arr_btn = false;
    this.jrnlService.show_jrnl_btn = false;
    this.tbalService.trialData = this.reload;
    this.arrService.arrData = this.reload;
    this.jrnlService.jrnlData = this.reload;
    this.rwatbalService.show_trial_btn = false;
    this.rwaarrService.show_arr_btn = false;
    this.rwajrnlService.show_jrnl_btn = false;
    this.rwatbalService.capitalArr.length = 0;
    this.rwatbalService.rwaArr.length = 0;
    this.rwaarrService.arrData = this.reload;
    this.rwajrnlService.jrnlData = this.reload;
  }


}
