import { CityState, SearchCityState, Place, PlaceResult } from './../struct/CityState';
import { Injectable } from '@angular/core';
import { AjaxService } from './ajax.service';
import { Observable, forkJoin } from 'rxjs';
import { LibRandom } from '../lib/lib-random';
import { ConfigService } from './config.service';
import { map } from 'rxjs/operators';
import { ApiCallService } from './api-call.service';
import { API_Response } from '../api/structure/API_AITravelPlan';
// import { resolve } from 'path';
// import { error } from 'console';
declare var google: any;

@Injectable({
    providedIn: 'root'
})


export class PlacesService {
    service = new google.maps.places.PlacesService(document.createElement('div'));
    private API_KEY = 'AIzaSyDjD2_-EGRNJ7xsioVE60TaGjiYhL3Zx88'; // 將YOUR_API_KEY替換為您自己的API金鑰
    public cityState: CityState[] = [];
    public searchCityState: SearchCityState[] = [];
    public isLoading: boolean = false;

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
                })
            })
        })
    }

    searchKeywordPlaces(keyword: string, type: PlaceType) {
        let url = this.config.placesUrl + `textsearch/json?query=${keyword}`;
        if (type !== PlaceType.全部) {
            url += `&type=${type}`;
        }

        url += `&key=${this.API_KEY}`
        return this.ajax.get(url).pipe(
            map((response: any) => response)
        );
    }


    searchLocalPlaces(location: string, keyword: string, type: PlaceType, nextToken: string = ""): Promise<any> {
        return new Promise((resolve, error) => {
            this.service.textSearch({
                query: `${keyword}+in+${location}`,
                // location: location,
                location: new google.maps.LatLng(23.69781, 120.960515),
                radius: 1000,
                type: type
            }, (results: any[], status: string, pagination: any) => {
                if (status === 'OK') {
                    // 獲取到商家的資訊，處理商家資訊
                    if (nextToken != "") {
                        pagination.nextPage();
                    }
                    let nextPageToken = pagination.hasNextPage ? pagination.nextPage() : '';
                    resolve({
                        results: results,
                        next_page_token: nextPageToken
                    });
                } else {
                    error('搜索商家失敗，狀態：');
                }
            });
        })

        // let url = this.config.placesUrl + `textsearch/json?`;

        // if (type !== PlaceType.全部) {
        //     url += `&type=${type}`;
        // }
        // url += `query=${keyword}+in+${location}`;

        // if (nextToken != "") {
        //     url += `&pagetoken=${nextToken}`;
        // }

        // url += `&key=${this.API_KEY}`
        // return this.ajax.get(url).pipe(
        //     map((response: any) => response)
        // );
    }

    attractionsScroll(searchPos: string) {
        let next_page_token = this.attractionsInf[searchPos].next_page_token;
        this.searchLocalPlaces(searchPos, "景點", PlaceType.全部, next_page_token).then((res: Place) => {
            this.attractionsInf[searchPos].next_page_token = res.next_page_token;
            res.results.forEach(el => {
                this.attractionsInf[searchPos].results.push(el);
            })
        });
    }

    foodsScroll(searchPos: string) {
        this.searchLocalPlaces(searchPos, "美食", PlaceType.全部, this.foodInf[searchPos].next_page_token).then((res: Place) => {
            this.foodInf[searchPos].next_page_token = res.next_page_token;
            res.results.forEach(el => {
                this.foodInf[searchPos].results.push(el);
            })
        });
    }

    attractionsInf: { [key: string]: Place } = {};
    hotelInf: { [key: string]: Place } = {};
    foodInf: { [key: string]: Place } = {};
    searchInf: { [key: string]: Place } = {};
    dateRange?: Date[];
    searchPlaces(searchKeyWord: string) {
        let el = this.searchCityState[this.searchCityState.length - 1];
        let searchPos = el.searchPos
        this.searchLocalPlaces(searchPos, searchKeyWord, PlaceType.全部).then((el: Place) => {
            this.searchInf[searchPos] = el;
            this.searchInf[searchPos].results.forEach(el => {
                el["checked"] = false;
            })
        })
    }

    searchSelectLocalPlaces() {
        let el = this.searchCityState[this.searchCityState.length - 1];
        // this.searchCityState.forEach((el) => {
        let selectCity = el.selectCity == -1 ? LibRandom.randomIndex(this.cityState) : el.selectCity;
        let selectSate = el.selectSate == -1 ? LibRandom.randomIndex(this.cityState[selectCity].State) : el.selectSate;
        let city = this.cityState[selectCity].cnName;
        let state = this.cityState[selectCity].State[selectSate].cnName;
        let searchPos = (el.selectCity == -1 || el.selectSate == -1) ? city : city + " " + state
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

            this.attractionsInf[searchPos] = el[0];
            this.attractionsInf[searchPos].results.forEach(el => {
                el["checked"] = false;
            })

            this.foodInf[searchPos] = el[1];
            this.foodInf[searchPos].results.forEach(el => {
                el["checked"] = false;
            })
        });
    }

    exportPlanDoc: string = "";
    tranvePlan(searchPos: string) {
        let _this = this;
        let searchForm = this.searchCityState[this.searchCityState.length - 1];
        let trans = this.searchCityState[this.searchCityState.length - 1].trans;
        let attractions = "";
        let foods = "";
        if (searchForm.isAttractionsRandom) {
            let randomCount = LibRandom.getRandomNumberInRange(3, 5);
            let arrTemp = LibRandom.getRandomNumbersInRange(0, _this.attractionsInf[searchPos].results.length - 1, randomCount);
            arrTemp.forEach(el => {
                _this.attractionsInf[searchPos].results[el].checked = true;
            })
        }

        let attractionsChecked = _this.attractionsInf[searchPos].results.filter(inf => inf.checked == true);
        attractions = attractionsChecked.map(x => x.name + ":" + x.formatted_address).join(",");

        if (searchForm.isFoodRandom) {
            let randomCount2 = LibRandom.getRandomNumberInRange(3, 5);
            let arrTemp2 = LibRandom.getRandomNumbersInRange(0, _this.foodInf[searchPos].results.length - 1, randomCount2);
            arrTemp2.forEach(el => {
                _this.foodInf[searchPos].results[el].checked = true;
            })
        }

        let foodsChecked = _this.foodInf[searchPos].results.filter(inf => inf.checked == true);
        foods = foodsChecked.map(x => x.name + ":" + x.formatted_address).join(",");

        if (attractions == "" || foods == "") {
            alert("請選擇景點與美食!");
            return;
        }

        _this.attractionsInf[searchPos].results = _this.attractionsInf[searchPos].results.filter(inf => inf.checked == false)
        _this.foodInf[searchPos].results = _this.foodInf[searchPos].results.filter(inf => inf.checked == false)
        _this.isLoading = true;
        _this.travelPlanCall(attractions, foods, trans).subscribe(
            {
                next: (res: API_Response) => {
                    if (res.error != undefined) {

                    } else {
                        if (res.choices.length > 0) {


                            let planTem = res.choices[0].text;
                            attractionsChecked.forEach(ael => {
                                // console.log("===ael===");
                                // console.log(ael);
                                const regex = new RegExp(ael.name, 'g');
                                planTem = planTem.replace(regex, '<a target="_blank" href="https://www.google.com/maps/search/?api=1&query=' + ael.geometry.location.lat + ',' + ael.geometry.location.lng + '&query_place_id=' + ael.place_id + '">' + ael.name + '</a>');
                            })

                            foodsChecked.forEach(fel => {
                                // console.log("===ael===");
                                // console.log(fel);
                                const regex = new RegExp(fel.name, 'g');
                                planTem = planTem.replace(regex, '<a target="_blank" href="https://www.google.com/maps/search/?api=1&query=' + fel.geometry.location.lat + ',' + fel.geometry.location.lng + '&query_place_id=' + fel.place_id + '">' + fel.name + '</a>');
                            })
                            searchForm.plan = planTem;
                            if (_this.exportPlanDoc != "")
                                _this.exportPlanDoc += "<br>"
                            _this.exportPlanDoc += planTem;
                        }

                        _this.isLoading = false;

                    }
                },
                error: (error) => {
                    alert("發生錯誤，請稍後再試!");
                    _this.isLoading = false;
                },
                complete: () => {
                }
            }
        );
    }

    tranvePlanNew(searchPos: string, checkedPlan: PlaceResult[]) {
        let _this = this;
        let searchForm = this.searchCityState[this.searchCityState.length - 1];
        let trans = this.searchCityState[this.searchCityState.length - 1].trans;
        let attractions = "";
        let planPlace = [];

        if (searchForm.isAttractionsRandom || searchForm.isFoodRandom) {
            let randomCount = LibRandom.getRandomNumberInRange(3, 5);
            let arrTemp = LibRandom.getRandomNumbersInRange(0, _this.attractionsInf[searchPos].results.length - 1, randomCount);
            arrTemp.forEach(el => {
                planPlace.push(_this.attractionsInf[searchPos].results[el]);
            })

            let randomCount2 = LibRandom.getRandomNumberInRange(3, 5);
            let arrTemp2 = LibRandom.getRandomNumbersInRange(0, _this.foodInf[searchPos].results.length - 1, randomCount2);
            arrTemp2.forEach(el => {
                planPlace.push(_this.foodInf[searchPos].results[el]);
            })
        }

        checkedPlan.forEach(el => {
            planPlace.push(el);
        })

        attractions = planPlace.map(x => x.name + " type:" + x.types[0] + " address:" + x.formatted_address).join(",");

        if (attractions == "") {
            alert("請選擇景點與美食!");
            return;
        }

        _this.isLoading = true;
        _this.travelPlanCall(attractions, "", trans).subscribe(
            (res: API_Response) => {
                if (res.error != undefined) {

                } else {
                    if (res.choices.length > 0) {
                        let planTem = res.choices[0].text;
                        planPlace.forEach(ael => {
                            const regex = new RegExp(ael.name, 'g');
                            planTem = planTem.replace(regex, '<a target="_blank" href="https://www.google.com/maps/search/?api=1&query=' + ael.geometry.location.lat + ',' + ael.geometry.location.lng + '&query_place_id=' + ael.place_id + '">' + ael.name + '</a>');
                        })

                        searchForm.plan = planTem;
                        if (_this.exportPlanDoc != "")
                            _this.exportPlanDoc += "<br>"
                        _this.exportPlanDoc += (searchPos + planTem);
                    }

                    _this.isLoading = false;

                }
            },
            (err) => {
                alert("發生錯誤，請稍後再試!");
                _this.isLoading = false;
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
    }

    //儲存會員旅遊計畫
    storePlan(idToken: string, title: string, context: string) {
        return this.apiCallService.StoreTravelPlan.call(
            {
                idToken: idToken,
                title: title,
                context: context,
            }
        );
    }

    //儲存會員旅遊計畫
    getPlan(idToken: string, pg: number) {
        return this.apiCallService.GetTravelPlan.call(
            {
                idToken: idToken,
                pg: pg
            }
        );
    }

    releasePlan(idToken: string, pid: number) {
        return this.apiCallService.ReleaseTravelPlan.call(
            {
                idToken: idToken,
                pid: pid
            }
        );
    }

    deletePlan(idToken: string, pid: number) {
        return this.apiCallService.DeleteTravelPlan.call(
            {
                idToken: idToken,
                pid: pid
            }
        );
    }

    modifyPlan(idToken: string, pid: number, title: string, context: string) {
        return this.apiCallService.ModifyTravelPlan.call(
            {
                idToken: idToken,
                pid: pid,
                title: title,
                context: context
            }
        );
    }

    getAllPlan(pg: number) {
        return this.apiCallService.GetAllTravelPlan.call(
            {
                pg: pg
            }
        );
    }

    commentPlan(idToken: string, pid: number, comment: string, stars: number) {
        return this.apiCallService.CommentTravelPlan.call(
            {
                idToken: idToken,
                pid: pid,
                comment: comment,
                stars: stars
            }
        );
    }

    getCommentPlan(idToken: string, pid: number) {
        return this.apiCallService.GetCommentTravelPlan.call(
            {
                idToken: idToken,
                pid: pid,
            }
        );
    }

    getAllComment(pid: number, pg: number) {
        return this.apiCallService.GetAllCommentTravelPlan.call(
            {
                pid: pid,
                pg: pg
            }
        );
    }
}