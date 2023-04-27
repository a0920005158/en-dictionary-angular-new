import { map } from 'rxjs/operators';
import { PlacesService } from '../../service/places.service';
import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { CityState, Place, PlaceResult, SearchCityState } from 'src/app/struct/CityState';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { LoginService } from "src/app/service/login.service";
import { API_StoreTravelPlan_Response } from '../../api/structure/API_StoreTravelPlan';
import * as htmlToPdf from 'html2pdf.js';

@Component({
  selector: 'tour-plan',
  templateUrl: './TourPlan.component.html',
  styleUrls: ['./TourPlan.component.scss']
})
export class TourPlanComponent implements OnInit {
  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
    // 在此加入拒絕離開的程式碼
    if (!confirm("要離開網站嗎?系統可能不會儲存你所做的變更。")) {
      event.preventDefault();
      event.returnValue = false;
    }
  }

  @HostListener('window:unload', ['$event'])
  unloadHandler(event) {
    // 在此加入拒絕離開的程式碼
    if (!confirm("要離開網站嗎?系統可能不會儲存你所做的變更。")) {
      event.preventDefault();
      event.returnValue = false;
    }
  }

  htmlContent: string = "";
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold']
    ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };

  trans = ["開車", "公共交通運輸"]

  transcript: string;
  isRecording: boolean;

  user: SocialUser | null = null;
  loggedIn: boolean;

  isCollapsed = true;
  focus;
  focus1;
  focus2;
  date = new Date();
  pagination = 3;
  pagination1 = 1;
  searchKeyWord: string = ""
  constructor(
    private placesService: PlacesService,
    public LoginService: LoginService,
    private authService: SocialAuthService,
  ) { }
  scrollToDownload(element: any) {
    element.scrollIntoView({ behavior: "smooth" });
  }
  ngOnInit() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("index-page");

    if (this.LoginService.user == null) {
      this.authService.authState.subscribe((user) => {
        this.LoginService.user = user;
        this.LoginService.loggedIn = (user != null);
      });
    } else {
    }
  }

  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("index-page");
  }

  get cityState(): CityState[] {
    return this.placesService.cityState;
  }

  get searchCityState(): SearchCityState[] {
    return this.placesService.searchCityState;
  }

  addCityState() {
    this.placesService.searchCityState.push(new SearchCityState);
  }

  searchLocalPlaces() {
    this.placesService.searchSelectLocalPlaces();
  }

  searchPlaces(searchKeyWord: string) {
    this.placesService.searchPlaces(searchKeyWord);
  }

  tranvePlan(searchPos: string) {
    this.placesService.tranvePlan(searchPos);
  }

  tranvePlanNew(searchPos: string) {
    this.placesService.tranvePlanNew(searchPos, this.checkedPlan);
  }

  get dateRange(): Date[] {
    return this.placesService.dateRange;
  }

  set dateRange(val: Date[]) {
    this.placesService.dateRange = val;
  }

  get attractionsInf(): { [key: string]: Place } {
    return this.placesService.attractionsInf;
  }

  get foodInf(): { [key: string]: Place } {
    return this.placesService.foodInf;
  }

  get searchInf(): { [key: string]: Place } {
    return this.placesService.searchInf;
  }

  onAttractionsScroll(searchPos: string) {
    this.placesService.attractionsScroll(searchPos);
  }

  onFoodsScroll(searchPos: string) {
    this.placesService.foodsScroll(searchPos);
  }

  get isLoading(): boolean {
    return this.placesService.isLoading;
  }

  set isLoading(val: boolean) {
    this.placesService.isLoading = val;
  }

  get exportPlanDoc(): string {
    return this.placesService.exportPlanDoc;
  }

  set exportPlanDoc(val: string) {
    this.placesService.exportPlanDoc = val;
  }

  getCheckedCount(value: PlaceResult[]) {
    let count = value.filter(x => x.checked == true).length;
    if (count > 2) {
      return true;
    }
    return false
  }

  storePlanTitle = "";
  storePlan() {
    if (this.LoginService.loggedIn) {
      this.isLoading = true;
      this.placesService.storePlan(this.LoginService.user.idToken, this.storePlanTitle, this.exportPlanDoc).subscribe(
        {
          next: (res: API_StoreTravelPlan_Response) => {
            if (res.errorCode == 0) {
              this.clearPlan();
              alert("儲存成功!");
            } else {
              alert("儲存失敗!");
            }
            this.isLoading = false;
          },
          error: (error) => {
            alert("發生錯誤!");
            this.isLoading = false;
          },
          complete: () => {
          }
        }
      );
    } else {
      alert("請登入Google帳號!");
    }
  }

  @ViewChild('content') content: ElementRef;

  isExportPlan = false;
  exportPlan() {
    const options = {
      filename: 'example.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };

    let styles = `
      <head>
        <style>
        p {
              color: #333;
            }
        </style>
      </head>
    `
    const content = this.content.nativeElement;
    htmlToPdf().set(options).from(styles + "<body>" + content.innerHTML + "</body>").save();
  }

  clearPlan() {
    this.placesService.searchCityState = [new SearchCityState];
    this.exportPlanDoc = "";
    this.isExportPlan = false;
  }

  checkedPlan: PlaceResult[] = []
  selectPlan(item: PlaceResult) {
    if (this.checkedPlan.length >= 9) {
      alert("超出九個選項限制!")
    } else {
      let index = this.checkedPlan.map(x => x.place_id).indexOf(item.place_id)
      if (index == -1) {
        this.checkedPlan.push(item);
      } else {
        alert("已有此選項")
      }
    }
  }

  deleteCheckedPlan(index: number) {
    this.checkedPlan.splice(index, 1);
  }
}

