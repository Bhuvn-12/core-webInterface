import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { WebDataRocksPivot } from '../../../webdatarocks/webdatarocks.angular4';
import { AdhocService } from '../../../services/reports/ad-hoc/adhoc.service';
import { AppService } from '../../../app.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

declare var $: any;

@Component({
  selector: 'app-adhoc-view',
  templateUrl: './adhoc-view.component.html',
  styleUrls: ['./adhoc-view.component.css']
})
export class AdhocViewComponent implements OnInit {


  @ViewChild('pivot1') child: WebDataRocksPivot;

  tableData;
  constructor(private adhocService: AdhocService, private appService: AppService, private spinner: NgxSpinnerService,
    private _snackBar: MatSnackBar) { }

  table = [
    'ref_reporting_units',
    'ref_product',
    'ref_customer_type',
    'ref_chart_of_acc',
    'bal_instrument_ledger'
  ];

  // mat selection of columns
  column_list: string[] = [];

  // selected tables for reporting
  selectedTables = [];
  @ViewChild('search') searchTextBox: ElementRef;

  selectFormControl = new FormControl();
  searchTextboxControl = new FormControl();
  selectedValues = [];
  column_obj;
  filteredOptions: Observable<any[]>;
  async ngOnInit() {
    /**
    * Set filter event based on value changes
    * */
    this.filteredOptions = this.searchTextboxControl.valueChanges
      .pipe(
        startWith<string>(''),
        map(name => this._filter(name))
      );


    // get column request
    if (this.adhocService.column_obj === undefined) {
      const resp = await this.adhocService.getColumns();
      if (resp) {
        this.column_obj = resp;
        this.adhocService.column_obj = this.column_obj;
      }
    } else {
      this.column_obj = this.adhocService.column_obj;
    }

  }


  // Get data from database
  async getData() {
    const Obj = new Object();
    Obj['tables'] = this.selectedTables;
    Obj['columns'] = this.selectedValues;
    Obj['ent_cd'] = this.appService.ent_cd;
    if (this.selectedValues.length === 0 || this.selectedTables.length === 0) {
      this._snackBar.open('Please select table and columns', 'close', {
        duration: 2000});
    } else {
      this.adhocService.paramObj = Obj;
      this.spinner.show();
      const resp = await this.adhocService.getData(Obj);
      if (resp) {
        this.tableData = resp;
        this.child.webDataRocks.updateData({ data: this.tableData });
        this.spinner.hide();
      } else {
        this.spinner.hide();
      }
    }

  }

  // pivot table configuration
  onPivotReady(pivot: WebDataRocks.Pivot): void {
    // console.log('[ready] WebDataRocksPivot', this.child);
  }

  onCustomizeCell(
    cell: WebDataRocks.CellBuilder,
    data: WebDataRocks.Cell
  ): void {
    if (data.isClassicTotalRow) {
      cell.addClass('fm-total-classic-r');
    }
    if (data.isGrandTotalRow) {
      cell.addClass('fm-grand-total-r');
    }
    if (data.isGrandTotalColumn) {
      cell.addClass('fm-grand-total-c');
    }
  }

  onReportComplete(): void {
    this.child.webDataRocks.off('reportcomplete');
    // this.createAreaChart();
    // this.createBarChart();
  }
  customizeToolbar(toolbar) {
    const tabs = toolbar.getTabs(); // get all tabs from the toolbar
    toolbar.getTabs = function () {
      delete tabs[0];
      delete tabs[1];
      delete tabs[2];
      return tabs;
    };
  }

  // render view for preconfigured report
  async getfileData() {
    const res = await this.adhocService.getFileData();
    if (res) {
      this.setReport(res);
    }
  }

  // save report view in database
  saveReport() {
    const usrDtls = JSON.parse(localStorage.getItem('usrDtls'));
    const report = this.child.webDataRocks.getReport();
    const report_info = report.slice;
    report_info['dataSource'] = { dataSourceType: 'json', data: [] };
    const Obj = new Object();
    Obj['report_info'] = report_info;
    Obj['user_id'] = usrDtls.user_id;
    Obj['data_info'] = this.adhocService.paramObj;
  }
  async setReport(reportObj) {
    const Obj = new Object();
    Obj['tables'] = ['ref_product', 'bal_instrument_ledger'];
    Obj['columns'] = ['ref_product.leaf_desc', 'bal_instrument_ledger.balance'];
    Obj['ent_cd'] = this.appService.ent_cd;
    this.spinner.show();
    const resp = await this.adhocService.getData(Obj);
    if (resp) {
      this.tableData = resp;
      reportObj['dataSource']['data'] = resp;
      this.child.webDataRocks.setReport(reportObj);
      this.spinner.hide();
    } else {
      this.spinner.hide();
    }
  }


  private _filter(name: string): String[] {
    const filterValue = name.toLowerCase();
    // Set selected values to retain the selected checkbox state
    this.setSelectedValues();
    this.selectFormControl.patchValue(this.selectedValues);
    const filteredList = this.column_list.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
    return filteredList;
  }

  selectionChange(event) {
    if (event.isUserInput && event.source.selected === false) {
      const index = this.selectedValues.indexOf(event.source.value);
      this.selectedValues.splice(index, 1);
    }
  }

  openedChange(e) {
    // Set search textbox value as empty while opening selectbox
    this.searchTextboxControl.patchValue('');
    // Focus to search textbox while clicking on selectbox
    if (e === true) {
      this.searchTextBox.nativeElement.focus();
    }
  }
  clearSearch(event) {
    event.stopPropagation();
    this.searchTextboxControl.patchValue('');
  }

  setSelectedValues() {
    if (this.selectFormControl.value && this.selectFormControl.value.length > 0) {
      this.selectFormControl.value.forEach((e) => {
        if (this.selectedValues.indexOf(e) === -1) {
          this.selectedValues.push(e);
        }
      });
    }
  }

  openModal() {
    $('#FilterModal').modal('show');
  }

  dragDrop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  // set column list
  async setColumns() {
    this.column_list = [];
    for (let i = 0; i < this.selectedTables.length; i++) {
      const tempArr = this.column_obj[this.selectedTables[i]];
      for (let j = 0; j < tempArr.length; j++) {
        this.column_list.push(this.selectedTables[i] + '.' + tempArr[j]);
      }
    }
    this.filteredOptions = this.searchTextboxControl.valueChanges
      .pipe(
        startWith<string>(''),
        map(name => this._filter(name))
      );
  }

}
