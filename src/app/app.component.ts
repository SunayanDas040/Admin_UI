import { Component } from '@angular/core';
import { AppService } from './app.service';
import { OnInit, OnDestroy } from '@angular/core';
import { User } from './model/user.model';
import { Subscription } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'admin-ui';
  public userList: User[] = [];
  public subscription: Subscription | undefined;
  displayedColumns: string[] = ['select', 'name', 'email', 'role', 'actions'];
  dataSource = new MatTableDataSource<User>();
  selection = new SelectionModel<User>(true, []);
  constructor(private appService: AppService) {}

  async ngOnInit() {
    this.subscription = this.appService.dataChanged.subscribe((userData: User[]) => {
      console.log(userData);
      this.userList = userData;
      this.dataSource = new MatTableDataSource(this.userList);
    });

  }



  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: User): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

    applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
