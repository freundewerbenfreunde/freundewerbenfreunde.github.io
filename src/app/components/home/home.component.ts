import { Component, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ObjectType } from 'deta/dist/types/types/basic';
import { FWFService } from 'src/app/services/fwf.service';
import { AppDialogComponent } from '../app-dialog/app-dialog.component';
import { ResizeableComponent } from '../resizeable/resizeable.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends ResizeableComponent {

  search?: string;
  category?: string;
  sortBy: string = 'name';
  source?: string;
  categories: ObjectType[] = [];
  allApps: ObjectType[] = [];
  apps: ObjectType[] = [];

  constructor(fwfService: FWFService, private dialog: MatDialog) {
    super(fwfService);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.refreshCategories();
    this.refreshAllApps();
  }

  searchApp(): void {
    this.refreshApps();
  }

  selectCategory(category?: string): void {
    if (category != this.category) {
      this.category = category;
      this.refreshApps();
    }
  }

  sort(sortBy: string): void {
    if (sortBy != this.sortBy) {
      this.sortBy = sortBy;
    } else {
      this.sortBy = 'name';
    }
    this.refreshApps();
  }

  filter(source: string): void {
    if (source != this.source) {
      this.source = source;
    } else {
      this.source = undefined;
    }
    this.refreshApps();
  }

  private refreshCategories(): void {
    this.fwfService.getAllCategories().subscribe(
      {
        next: (categories: ObjectType[]) => this.categories = categories
      }
    );
  }

  private refreshAllApps(): void {
    this.fwfService.getApps().subscribe(
      {
        next: (apps: ObjectType[]) => this.allApps = apps
      }
    );
  }

  private refreshApps(): void {
    this.fwfService.getApps(this.search, this.category, this.sortBy, this.source).subscribe(
      {
        next: (apps: ObjectType[]) => this.apps = apps
      }
    );
  }

  openAppProposalDialog(): void {
    this.dialog.open(AppDialogComponent, {
      minWidth: '320px',
      maxWidth: '600px',
      width: '80vw'
    });
  }

  protected override getFactor(): number {
    return 140000;
  }

}
