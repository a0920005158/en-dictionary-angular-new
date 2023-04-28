import { API_GetTravelPlan_Result, Pg } from './../../../api/structure/API_GetTravelPlan';
import { Component, OnInit, OnDestroy, HostListener } from "@angular/core";
import { PlacesService } from '../../../service/places.service';
import { LoginService } from "src/app/service/login.service";
import { SocialAuthService } from '@abacritt/angularx-social-login';
import Chart from "chart.js";
import { API_GetTravelPlan_Response } from "src/app/api/structure/API_GetTravelPlan";
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: "app-my-plan",
  styleUrls: ['./MyPlan.component.scss'],
  templateUrl: "MyPlan.component.html"
})
export class MyPlanComponent implements OnInit, OnDestroy {
  isCollapsed = true;
  focus;
  focus1;
  focus2;
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

  constructor(private placesService: PlacesService, public LoginService: LoginService, private authService: SocialAuthService,) {

  }
  @HostListener("document:mousemove", ["$event"])
  onMouseMove(e) {
    var squares1 = document.getElementById("square1");
    var squares2 = document.getElementById("square2");
    var squares3 = document.getElementById("square3");
    var squares4 = document.getElementById("square4");
    var squares5 = document.getElementById("square5");
    var squares6 = document.getElementById("square6");
    var squares7 = document.getElementById("square7");
    var squares8 = document.getElementById("square8");

    var posX = e.clientX - window.innerWidth / 2;
    var posY = e.clientY - window.innerWidth / 6;

    squares1.style.transform =
      "perspective(500px) rotateY(" +
      posX * 0.05 +
      "deg) rotateX(" +
      posY * -0.05 +
      "deg)";
    squares2.style.transform =
      "perspective(500px) rotateY(" +
      posX * 0.05 +
      "deg) rotateX(" +
      posY * -0.05 +
      "deg)";
    squares3.style.transform =
      "perspective(500px) rotateY(" +
      posX * 0.05 +
      "deg) rotateX(" +
      posY * -0.05 +
      "deg)";
    squares4.style.transform =
      "perspective(500px) rotateY(" +
      posX * 0.05 +
      "deg) rotateX(" +
      posY * -0.05 +
      "deg)";
    squares5.style.transform =
      "perspective(500px) rotateY(" +
      posX * 0.05 +
      "deg) rotateX(" +
      posY * -0.05 +
      "deg)";
    squares6.style.transform =
      "perspective(500px) rotateY(" +
      posX * 0.05 +
      "deg) rotateX(" +
      posY * -0.05 +
      "deg)";
    squares7.style.transform =
      "perspective(500px) rotateY(" +
      posX * 0.02 +
      "deg) rotateX(" +
      posY * -0.02 +
      "deg)";
    squares8.style.transform =
      "perspective(500px) rotateY(" +
      posX * 0.02 +
      "deg) rotateX(" +
      posY * -0.02 +
      "deg)";
  }

  ngOnInit() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("register-page");

    this.onMouseMove(event);

    if (this.LoginService.user == null) {
      this.authService.authState.subscribe((user) => {
        this.LoginService.user = user;
        this.LoginService.loggedIn = (user != null);
        this.getPlan(0);
      });
    } else {
      this.getPlan(0);
    }
  }
  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("register-page");
  }

  myPlan: API_GetTravelPlan_Result = {
    List: [],
    pg: {
      current: 0,
      amount: 0,
      pagesize: 0
    }
  }

  getPlan(pg: number) {
    this.isLoading = true;
    this.placesService.getPlan(this.LoginService.user.idToken, pg).subscribe(
      {
        next: (res: API_GetTravelPlan_Response) => {
          if (res.errorCode == 0) {
            this.myPlan = res.result;
          } else {
            alert("發生錯誤!");
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
  }

  showPlanIndex: number = 0

  releasePlan(pid: number, isOp: number) {
    if (confirm("你是否確定"+(isOp?"取消":"")+"分享您的旅遊計畫?")) {
      this.isLoading = true;
      this.placesService.releasePlan(this.LoginService.user.idToken, pid).subscribe(
        {
          next: (res: API_GetTravelPlan_Response) => {
            if (res.errorCode == 0) {
              let index = this.myPlan.List.map(x => x.id).indexOf(pid);
              this.myPlan.List[index].isOp = this.myPlan.List[index].isOp ? 0 : 1;
            } else {
              alert("發生錯誤!");
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
    }
  }

  isLoading: boolean = false;

  deletePlan(pid: number) {
    this.isLoading = true;
    this.placesService.deletePlan(this.LoginService.user.idToken, pid).subscribe(
      {
        next: (res: API_GetTravelPlan_Response) => {
          if (res.errorCode == 0) {
            this.getPlan(0);
          } else {
            alert("發生錯誤!");
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
  }

  isEditmyPlan = false
  editMyPlan() {
    this.isEditmyPlan = true;
    this.isLoading = true;
    this.placesService.modifyPlan(
      this.LoginService.user.idToken,
      this.myPlan.List[this.showPlanIndex].id,
      this.myPlan.List[this.showPlanIndex].title,
      this.myPlan.List[this.showPlanIndex].context
    ).subscribe(
      {
        next: (res: API_GetTravelPlan_Response) => {
          if (res.errorCode == 0) {
            alert("修改成功!");
            this.getPlan(0);
          } else {
            alert("發生錯誤!");
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
  }
}
