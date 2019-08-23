import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { StatusService} from '../../services/sources/status/status.service';
import {AppService} from '../../app.service';


@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {

  constructor(private statusservice: StatusService, private appService: AppService) { }
  displayedColumns: string[] = ['ss_name', 'status'];
  legalentitydata;
  ent_cd;
  dataSource;
  myerror;
  _ok = 'OK';

 async ngOnInit() {
   this.ent_cd = this.appService.ent_cd;
   this.legalentitydata = await this.statusservice.getStausofLegalEntityy(this.ent_cd);
   console.log(this.legalentitydata);
   if (this.legalentitydata) {
    this.dataSource = new MatTableDataSource(this.legalentitydata);
   }
  }

}
