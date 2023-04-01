import { PlacesService } from '../../service/places.service';
import { Component, OnInit, HostListener } from '@angular/core';
import noUiSlider from "nouislider";
import { SpeechRecognitionService } from 'src/app/service/speech-recognition.service';
import { AIConversationService } from 'src/app/service/ai-conversation.service';
import { WordService } from 'src/app/service/word.service';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { WordSearch } from 'src/app/struct/WordSearch';
import { AIConversation } from '../../struct/AIConversation';
import { CityState, Place, PlaceResult, SearchCityState } from 'src/app/struct/CityState';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { LoginService } from "src/app/service/login.service";


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
  selfRole = ChatRole.自己;
  robotRole = ChatRole.機器人;
  recognitionText: string = "";
  status: string = "開始辨識";
  searchWord: string = "";

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
  constructor(
    private speechRecognitionService: SpeechRecognitionService,
    private AIConversation: AIConversationService,
    private wordService: WordService,
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
      console.log('logined!!');
      console.log(
        this.LoginService.user
      );
    }
  }

  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("index-page");
  }

  startRecognition() {
    if (this.status == "開始辨識") {
      this.status = "顯示辨識結果";
      this.speechRecognitionService.start().subscribe(
        (text) => {
          console.log('============');
          console.log(text);

          this.recognitionText += text;
        },
        (err) => {
          console.error(err);
          this.status = "開始辨識";
        },
        () => {
          console.log("complete!");
        }
      );
    } else {
      this.status = "開始辨識";
      this.speechRecognitionService.stop()
    }
  }

  stopRecording() {
    this.speechRecognitionService.stop();
  }

  showConfig() {
    // var msg = new SpeechSynthesisUtterance('Hello World');
    // window.speechSynthesis.speak(msg);
  }

  AIConversationSend() {
    this.AIConversation.sentMsg(this.recognitionText);
    this.recognitionText = "";
  }

  get getChatRecord(): AIConversation[] {
    return this.AIConversation.chatGPTRecord;
  }

  WordSearchResult!: WordSearch;
  searchWordDefine() {
    this.wordService.searchWord(
      this.searchWord
    ).subscribe(el => {
      this.WordSearchResult = el;
    });
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
  tranvePlan(searchPos: string) {
    this.placesService.tranvePlan(searchPos);
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

  onAttractionsScroll(searchPos: string) {
    this.placesService.attractionsScroll(searchPos);
  }

  onFoodsScroll(searchPos: string) {
    this.placesService.foodsScroll(searchPos);
  }

  get isLoading(): boolean {
    return this.placesService.isLoading;
  }

  isExportPlan = false;
  exportPlan() {
    this.isExportPlan = true;
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

  storePlan() {
    if (this.LoginService.loggedIn) {

    } else {
      
    }
  }
}
