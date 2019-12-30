import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { BroadcastEventService, HyperToastsService } from 'lib-services';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from '@app-hyper-store/services/shared.service';
import { FilterGuideComponent } from '@app-hyper-store/components/filter-guide/filter-guide.component';

@Component({
  selector: 'app-hyper-store-guide-companies',
  templateUrl: './guide-companies.component.html',
  styleUrls: ['./guide-companies.component.less']
})
export class GuideCompaniesComponent implements OnInit, OnDestroy {
  public category = [];
  public search: any;
  private currentPage = 1;
  private currentSize = 15;
  public display: any;

  public filters: any = [];
  public catSelected = [];

  public hyperGuide = [];
  public queryParams: any = {};
  public count: Number = 0;

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _filterGuide: FilterGuideComponent
  ) { }

  ngOnInit() {
    this.categoriesGuide();
    this.filtered(this._sharedService.filterGuide.search);
    BroadcastEventService.event('onResetBreadCrumbOnRouterChange').emit(false);

  }

  getGift() {
    if (this.category != undefined) {
      this._sharedService.listGift({ category: this.category }).subscribe(
        (res: any) => {
          if (res.return) {
            res.data.forEach(element => {
              element.mediasCompanies = JSON.parse(element.mediasCompanies);
              element.mediasCompanies = JSON.parse('[' + element.mediasCompanies.images + ']');
              // element.mediasGift = JSON.parse(element.mediasGift);
              // element.mediasGift = JSON.parse('[' + element.mediasGift.images + ']');
            });
            this.hyperGuide = [...res.data];
            this._sharedService.filterGuide.category = undefined;
            this._sharedService.filterGuide.search = [];
            this.count = res.count;
          }
        });
    }

    BroadcastEventService.event('onResetBreadCrumbOnRouterChange').emit(false);
  }
  filtered(obj) {
    this.hyperGuide = [];
    this.hyperGuide = [...obj];
    this._sharedService.filterGuide.search = [];

  }

  loadMoreResults() {
    this.currentPage++;

    this.queryParams.page = this.currentPage;
    this.queryParams.size = this.currentSize;
  }

  categoriesGuide() {
    this._sharedService.categoriesGuide().subscribe(
      (response: any) => {
        const aux: Array<any> = response.data;
        // Ordenação ordem alfabetica da categorias
        aux.sort((a, b) => a.superCategory.localeCompare(b.superCategory));
        this.filters = [];
        let first = true;
        aux.forEach(element => {
          const obj = {
            title: element.superCategory,
            icon: element.urlicon,
            subCat: [{ id: element.id, title: element.category }]
          };
          if (first || this.filters[this.filters.length - 1].title != element.superCategory) {
            this.filters.push(obj);
          } else if (this.filters[this.filters.length - 1].subCat.length < 11) {
            this.filters[this.filters.length - 1].subCat.push(...obj.subCat);
          }
          first = false;
        });

      }
    );
  }

  attFilter(obj) {
    if (obj.subCat != undefined) {
      this.filters = [...obj.subCat];
    } else {
      const aux = this.category.findIndex(x => x == obj.id);
      aux == -1 ? this.category.push(obj.id) : this.category.splice(aux, 1);
      obj.selected = !obj.selected;
      this.getGift();
    }
  }

  attCategory() {
    this.catSelected.forEach(element => {
      const ref = this.filters.find(x => x.id == element);
      if (ref) {
        ref.selected = true;
      }
    });
  }
  clearFilter() {
    this.category = [];
    this._filterGuide.getGift();
    this.categoriesGuide();
    setTimeout(() => {
      this.filtered(this._sharedService.filterGuide.search);
    }, 500);
  }

  ngOnDestroy() {
    BroadcastEventService.event('onResetBreadCrumbOnRouterChange').emit(true);
  }


}
