import { CityState, SearchCityState, Place } from './../struct/CityState';
import { Injectable } from '@angular/core';
import { AjaxService } from './ajax.service';
import { Observable, forkJoin } from 'rxjs';
import { LibRandom } from '../lib/lib-random';
import { ConfigService } from './config.service';
import { map } from 'rxjs/operators';
import { ApiCallService } from './api-call.service';
import { API_Response } from '../api/structure/API_AITravelPlan';

@Injectable({
    providedIn: 'root'
})

export class PlacesService {
    private API_KEY = 'AIzaSyDjD2_-EGRNJ7xsioVE60TaGjiYhL3Zx88'; // 將YOUR_API_KEY替換為您自己的API金鑰
    public cityState: CityState[] = [];
    public searchCityState: SearchCityState[] = [];

    constructor(
        private ajax: AjaxService,
        private config: ConfigService,
        private apiCallService: ApiCallService
    ) {
        this.searchCityState.push(new SearchCityState);

        this.ajax.get("assets/json/City.json").subscribe((res: { [key: string]: string }) => {
            Object.keys(res).forEach(el => {
                this.ajax.get("assets/json/" + el.replace(/\s+/g, "") + ".json").subscribe((res2: { [key: string]: string }) => {
                    let state = [];
                    Object.keys(res2).forEach(el2 => {
                        state.push({
                            enName: el2,
                            cnName: res2[el2]
                        })
                    })
                    this.cityState.push({
                        enName: el,
                        cnName: res[el],
                        State: state
                    });

                    let test = this.cityState;
                })
            })
        })
    }

    searchKeywordPlaces(keyword: string, type: PlaceType) {
        // 將您想查詢的關鍵字和場所類型傳遞到Google Places API中的URL
        let url = this.config.placesUrl + `textsearch/json?query=${keyword}`;
        // let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${keyword}`;
        if (type !== PlaceType.全部) {
            url += `&type=${type}`;
        }

        url += `&key=${this.API_KEY}`
        return this.ajax.get(url).pipe(
            map((response: any) => response)
        );
    }


    searchLocalPlaces(location: string, keyword: string, type: PlaceType, nextToken: string = ""): Observable<any> {
        let url = this.config.placesUrl + `textsearch/json?`;
        // let url: string = `https://maps.googleapis.com/maps/api/place/textsearch/json?`;

        if (type !== PlaceType.全部) {
            url += `&type=${type}`;
        }
        url += `query=${keyword}+in+${location}`;

        if (nextToken != "") {
            url += `&pagetoken=${nextToken}`;
        }

        url += `&key=${this.API_KEY}`
        return this.ajax.get(url).pipe(
            map((response: any) => response)
        );
    }

    attractionsScroll(searchPos: string) {
        let next_page_token = this.attractionsInf[searchPos].next_page_token;
        this.searchLocalPlaces(searchPos, "景點", PlaceType.全部, next_page_token).subscribe((res: Place) => {
            let test = this.attractionsInf[searchPos];
            this.attractionsInf[searchPos].next_page_token = res.next_page_token;
            res.results.forEach(el => {
                this.attractionsInf[searchPos].results.push(el);
            })
        });
    }

    foodsScroll(searchPos: string) {
        this.searchLocalPlaces(searchPos, "美食", PlaceType.全部, this.foodInf[searchPos].next_page_token).subscribe((res: Place) => {
            this.foodInf[searchPos].next_page_token = res.next_page_token;
            res.results.forEach(el => {
                this.foodInf[searchPos].results.push(el);
            })
        });
    }

    attractionsInf: { [key: string]: Place } = {};
    hotelInf: { [key: string]: Place } = {};
    foodInf: { [key: string]: Place } = {};

    // attractionsInf = new Map();
    // hotelInf = new Map();
    // foodInf = new Map();
    dateRange?: Date[];

    searchSelectLocalPlaces() {
        let el = this.searchCityState[this.searchCityState.length - 1];
        // this.searchCityState.forEach((el) => {
        let selectCity = el.selectCity == -1 ? LibRandom.randomIndex(this.cityState) : el.selectCity;
        let selectSate = el.selectSate == -1 ? LibRandom.randomIndex(this.cityState[selectCity].State) : el.selectSate;
        let city = this.cityState[selectCity].cnName;
        let state = this.cityState[selectCity].State[selectSate].cnName;
        let searchPos = el.selectCity == -1 ? city : city + " " + state
        let attractions = "";
        let hotel = "";
        let food = "";
        // let sd = this.dateRange[0].getFullYear() + "年" + (this.dateRange[0].getMonth() + 1) + "月" + this.dateRange[0].getDate() + "日";
        // let ed = this.dateRange[1].getFullYear() + "年" + (this.dateRange[1].getMonth() + 1) + "月" + this.dateRange[1].getDate() + "日";
        // let time = sd + "~" + ed;

        el.searchPos = searchPos;
        if (this.attractionsInf.hasOwnProperty(searchPos) && this.foodInf.hasOwnProperty(searchPos))
            return;

        forkJoin(
            [
                this.searchLocalPlaces(searchPos, "景點", PlaceType.全部),
                this.searchLocalPlaces(searchPos, "美食", PlaceType.全部),
                // this.searchLocalPlaces(searchPos, "旅店", PlaceType.全部)
            ]
        ).subscribe((el: Place[]) => {
            // const diffTime = Math.abs(this.dateRange[0].getTime() - this.dateRange[1].getTime()); // 取得相差的毫秒數
            // const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // 將毫秒數轉換為天數
            // const diffDays = 1;

            console.log("================================");
            console.log(el);

            this.attractionsInf[searchPos] = el[0];
            this.attractionsInf[searchPos].results.forEach(el => {
                el["checked"] = false;
            })
            // attractions = el[0].map(x => x.name).join("、");
            // let attractionsArr: Place[] = LibRandom.selectRandomItemsFromArray(this.attractionsInf, 3, 5);

            // attractions = attractionsArr.map(x => x.name).join("、");



            this.foodInf[searchPos] = el[1];
            this.foodInf[searchPos].results.forEach(el => {
                el["checked"] = false;
            })
            // food = el[2].map(x => x.name).join("、");
            // food = LibRandom.selectRandomItemsFromArray(el[1].map(x => x.name), 3, 5).join("、S");

            // this.hotelInf = el[2];
            // hotel = el[1].map(x => x.name).join("、");
            // hotel = LibRandom.selectRandomItemsFromArray(el[2].map(x => x.name), 1 * diffDays, 3 * diffDays).join("、");

            // if (attractions != "" && hotel != "" && food != "" && time != "") {
            //     this.travelPlan(attractions, hotel, food, time)
            // }
        });
    }

    tranvePlan(searchPos: string) {
        let searchForm = this.searchCityState[this.searchCityState.length - 1];
        let trans = this.searchCityState[this.searchCityState.length - 1].trans;
        let attractions = "";
        let foods = "";
        if (searchForm.isAttractionsRandom) {
            let randomCount = LibRandom.getRandomNumberInRange(3, 5);
            let arrTemp = LibRandom.getRandomNumbersInRange(0, this.attractionsInf[searchPos].results.length - 1, randomCount);
            let tm = [];
            arrTemp.forEach(el => {
                tm.push(this.attractionsInf[searchPos].results[el].name + ":" + this.attractionsInf[searchPos].results[el].formatted_address);
            })
            attractions = tm.join(",");
        } else {
            attractions = this.attractionsInf[searchPos].results.filter(inf => inf.checked == true).map(x => x.name + ":" + x.formatted_address).join(",");
        }

        if (searchForm.isFoodRandom) {
            let randomCount2 = LibRandom.getRandomNumberInRange(3, 5);
            let arrTemp2 = LibRandom.getRandomNumbersInRange(0, this.foodInf[searchPos].results.length - 1, randomCount2);
            let tm2 = [];
            arrTemp2.forEach(el => {
                tm2.push(this.foodInf[searchPos].results[el].name + ":" + this.foodInf[searchPos].results[el].formatted_address);
            })
            foods = tm2.join(",");
        } else {
            foods = this.foodInf[searchPos].results.filter(inf => inf.checked == true).map(x => x.name + ":" + x.formatted_address).join(",");
        }
        if (attractions == "" || foods == "") {
            alert("請選擇景點與美食!");
            return;
        }
        this.travelPlanCall(attractions, foods, trans).subscribe(
            (res: API_Response) => {
                if (res.error != undefined) {

                } else {
                    if (res.choices.length > 0)
                        searchForm.plan = res.choices[0].text;
                }
            },
            (err) => {

            }
        );
    }
    travelPlanCall(attractions: string, foods: string, trans: string): Observable<any> {
        return this.apiCallService.AITravelPlan.call(
            {
                food: foods,
                attractions: attractions,
                trans: trans
            }
        );
        // this.apiCallService.AITravelPlan.call(
        //     {
        //         food: foods,
        //         attractions: attractions,
        //         trans: trans
        //     }
        // ).subscribe(
        //     (res: API_Response) => {
        //         if (res.error != undefined) {

        //         } else {
        //             let result = "";
        //             if (res.choices.length > 0)
        //                 result = res.choices[0].text;
        //         }

        //     },
        //     (err) => {

        //     }
        // );
    }
}