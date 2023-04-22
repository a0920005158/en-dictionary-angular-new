import { API_GetTravelPlan_Result, Pg } from '../../../api/structure/API_GetTravelPlan';
import { Component, OnInit, OnDestroy, HostListener } from "@angular/core";
import { PlacesService } from '../../../service/places.service';
import { LoginService } from "src/app/service/login.service";
import { SocialAuthService } from '@abacritt/angularx-social-login';
import Chart from "chart.js";
import { API_GetTravelPlan_Response } from "src/app/api/structure/API_GetTravelPlan";

@Component({
  selector: "app-all-plan",
  styleUrls: ['./AllPlan.component.scss'],
  templateUrl: "AllPlan.component.html"
})
export class AllPlanComponent implements OnInit, OnDestroy {
  isCollapsed = true;
  focus;
  focus1;
  focus2;
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
        this.getAllPlan(0);
      });
    } else {
      this.getAllPlan(0);
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

  isLoading: boolean = false
  getAllPlan(pg: number) {
    this.isLoading = true;
    this.placesService.getAllPlan(pg).subscribe(
      (res: API_GetTravelPlan_Response) => {
        if (res.errorCode == 0) {
          this.myPlan = res.result;
        } else {
          alert("發生錯誤!");
        }
        this.isLoading = false;
      },
      (err) => {
        alert("發生錯誤!");
        this.isLoading = false;
      }
    );
  }

  showPlanIndex: number = 0
}
