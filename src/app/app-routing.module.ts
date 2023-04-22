
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";

import { IndexComponent } from "./pages/index/index.component";
import { ProfilepageComponent } from "./pages/examples/profilepage/profilepage.component";
import { RegisterpageComponent } from "./pages/examples/registerpage/registerpage.component";
import { LandingpageComponent } from "./pages/examples/landingpage/landingpage.component";

import { HomeComponent } from "./pages/home/home.component";

import { TourPlanComponent } from './pages/TourPlan/TourPlan.component';
import { MyPlanComponent } from './pages/examples/MyPlan/MyPlan.component';
import { AllPlanComponent } from './pages/examples/AllPlan/AllPlan.component';
import { ContactMeComponent } from './pages/examples/ContactMe/ContactMe.component';

import { PagesModule } from "./pages/pages.module";

const routes: Routes = [
  { path: "", redirectTo: "tour-plan", pathMatch: "full" },
  { path: "home", component: HomeComponent },
  
  { path: "homex", component: IndexComponent },
  { path: "profile", component: ProfilepageComponent },
  { path: "register", component: RegisterpageComponent },
  { path: "landing", component: LandingpageComponent },
  
  { path: "tour-plan", component: TourPlanComponent },
  { path: "my-plan", component: MyPlanComponent },
  { path: "all-plan", component: AllPlanComponent },
  { path: "contact-me", component: ContactMeComponent }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  exports: []
})
export class AppRoutingModule { }
