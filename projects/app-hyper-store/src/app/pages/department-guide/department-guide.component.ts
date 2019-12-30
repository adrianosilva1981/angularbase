import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { BroadcastEventService } from 'lib-services';
import { SharedService } from '@app-hyper-store/services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hyper-store-department-guide',
  templateUrl: './department-guide.component.html',
  styleUrls: ['./department-guide.component.less']
})
export class DepartmentGuideComponent implements OnInit, OnDestroy {
  public columnCount = 5;
  public filtered = false;
  public selectedCat: any;
  public inputSearch: any;
  public cat = [];
  constructor(
    private _sharedServices: SharedService,
    private _router: Router
  ) { }

  ngOnInit() {
    this.columnCount = Math.floor((window.innerWidth > 1170 ? 1170 : window.innerWidth) / 270);
    BroadcastEventService.event('onResetBreadCrumbOnRouterChange').emit(false);
    this.categoriesGuide();
    this._sharedServices.filterGuide.category = undefined;
    this._sharedServices.filterGuide.search = [];
  }
  @HostListener('window:resize')
  onResize() {
    this.columnCount = Math.floor((window.innerWidth > 1170 ? 1170 : window.innerWidth) / 270);
  }
  categoriesGuide() {
    this._sharedServices.categoriesGuide().subscribe(
      (response: any) => {
        const aux: Array<any> = response.data;
        // Ordenação ordem alfabetica da categorias
        aux.sort((a, b) => a.superCategory.localeCompare(b.superCategory));
        this.cat = [];
        let first = true;
        aux.forEach(element => {
          const obj = {
            title: element.superCategory,
            icon: element.urlicon,
            subCat: [{ id: element.id, text: element.category }]
          };
          if (first || this.cat[this.cat.length - 1].title != element.superCategory) {
            this.cat.push(obj);
          } else if (this.cat[this.cat.length - 1].subCat.length < 11) {
            this.cat[this.cat.length - 1].subCat.push(...obj.subCat);
          }
          first = false;
        });

      }
    );
  }
  filter(subcatId: any) {
    this._sharedServices.filterGuide.category = subcatId;
    this._router.navigate(['department/guide/companies']);
  }
  ngOnDestroy() {
    BroadcastEventService.event('onResetBreadCrumbOnRouterChange').emit(true);
  }
}
