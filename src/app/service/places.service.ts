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
            map((response: any) => response.results)
        );
    }

    searchLocalPlaces(location: string, keyword: string, type: PlaceType): Observable<any> {
        let url = this.config.placesUrl + `textsearch/json?`;
        // let url: string = `https://maps.googleapis.com/maps/api/place/textsearch/json?`;

        if (type !== PlaceType.全部) {
            url += `&type=${type}`;
        }
        url += `query=${keyword}+in+${location}`;

        // if (type !== PlaceType.全部) {
        //     url += `query=${keyword}`;
        // } else {
        //     url += `query=${keyword}+in+${location}`;
        // }

        url += `&key=${this.API_KEY}`
        return this.ajax.get(url).pipe(
            map((response: any) => response.results)
        );
    }

    attractionsInf!: Place
    hotelInf!: Place
    foodInf!: Place
    dateRange?: Date[];
    searchSelectLocalPlaces() {
        this.searchCityState.forEach((el) => {
            let selectCity = el.selectCity == -1 ? LibRandom.randomIndex(this.cityState) : el.selectCity;
            let selectSate = el.selectSate == -1 ? LibRandom.randomIndex(this.cityState[selectCity].State) : el.selectSate;
            let city = this.cityState[selectCity].cnName;
            let state = this.cityState[selectCity].State[selectSate].cnName;
            let searchPos = el.selectCity == -1 ? city : city + " " + state
            let attractions = "";
            let hotel = "";
            let food = "";
            let sd = this.dateRange[0].getFullYear() + "年" + (this.dateRange[0].getMonth() + 1) + "月" + this.dateRange[0].getDate() + "日";
            let ed = this.dateRange[1].getFullYear() + "年" + (this.dateRange[1].getMonth() + 1) + "月" + this.dateRange[1].getDate() + "日";
            let time = sd + "~" + ed;


            forkJoin(
                [
                    this.searchLocalPlaces(searchPos, "景點", PlaceType.全部),
                    this.searchLocalPlaces(searchPos, "旅店", PlaceType.全部),
                    this.searchLocalPlaces(searchPos, "美食", PlaceType.全部)
                ]
            ).subscribe(el => {
                const diffTime = Math.abs(this.dateRange[0].getTime() - this.dateRange[1].getTime()); // 取得相差的毫秒數
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // 將毫秒數轉換為天數

                console.log("================================");
                console.log(el);
                this.attractionsInf = el[0];
                // attractions = el[0].map(x => x.name).join("、");
                attractions = LibRandom.selectRandomItemsFromArray(el[0].map(x => x.name), 3 * diffDays, 5 * diffDays).join("、");

                this.hotelInf = el[1];
                // hotel = el[1].map(x => x.name).join("、");
                hotel = LibRandom.selectRandomItemsFromArray(el[1].map(x => x.name), 1 * diffDays, 3 * diffDays).join("、");

                this.foodInf = el[2];
                // food = el[2].map(x => x.name).join("、");
                food = LibRandom.selectRandomItemsFromArray(el[2].map(x => x.name), 3 * diffDays, 5 * diffDays).join("、S");

                if (attractions != "" && hotel != "" && food != "" && time != "") {
                    this.travelPlan(attractions, hotel, food, time)
                }
            });
        })
    }

    travelPlan(attractions: string, hotel: string, food: string, time: string): void {
        this.apiCallService.AITravelPlan.call(
            {
                attractions: attractions,
                hotel: hotel,
                food: food,
                time: time
            }
        ).subscribe(
            (res: API_Response) => {
                if (res.error != undefined) {

                } else {
                    let result = "";
                    if (res.choices.length > 0)
                        result = res.choices[0].text;
                }

            },
            (err) => {

            }
        );
    }
}