import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { MatTable } from '@angular/material';
import { ErrorStateMatcher} from '@angular/material/core';
import { Observable, of } from 'rxjs';
import { Sort} from '@angular/material';
import { Teammate } from '../../../models/teammate';
import { SearchService } from '../../../services/search.service';
import { SelectionModel } from '@angular/cdk/collections';


@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.sass']
})
export class TeamComponent implements OnInit {

  @Input() id: number = 88;
  teammates: Teammate[];
  emailToSearch: string;
  displayedColumns: string[] = ['status', 'name', 'email', 'rights', 'options' ];
  dataSource: MatTableDataSource<Teammate>;
  emailFormControl = new FormControl('', [
    Validators.email,
  ]);
  searchResultRecieved: boolean = false;
  ckb: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;

  constructor(private searchService: SearchService) {
    //debugger;
    this.searchService.GetTranslatorsByTeam(this.id)
        .subscribe((data: Teammate[]) => {
          //debugger;
          this.teammates = data;
          this.dataSource = new MatTableDataSource(this.teammates);
          console.log(this.teammates);
        })
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
  }
  
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  searchTranslators() {
    this.searchService.FindTranslatorsByEmail(this.emailToSearch)
        .subscribe((data: Teammate[]) => {
          this.teammates = data.concat(this.teammates);
          this.dataSource = new MatTableDataSource(this.teammates);
          this.dataSource.paginator = this.paginator;
          this.paginator.pageIndex = 0;
        });
  }

  checkTranslatorRight(id: number, rightName: string) : boolean{
    //debugger;
    let teammate = this.teammates.find(t => t.id === id);
    if(!teammate)
      return false;
      
      try{
        return teammate.rights
          .find(r => r.definition.trim().toLowerCase() === rightName.trim().toLowerCase())
          != null;

      } catch(error) {
        console.log(error.message);
    }
      return false;
  }

  changeTranslatorRight(e, id){
    debugger;
    if(e.target.checked)
      {
        // add right
      }
    else
      {
        //remove right
      }
  }
}