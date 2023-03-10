import { Injector } from '@angular/core';
import { AjaxService } from 'src/app/service/ajax.service';
import { WordSearch } from 'src/app/struct/WordSearch';
import { BaseProvider } from './base-provider';

export class WordProvider extends BaseProvider {
  private url: string = "https://api.wordnik.com/v4/word.json/";
  private Wordnik_API_Key: string = "nxf8br2c6444ehxws2yz63o7tv2l6hiptwa1rjs6wonhizkqg";

  ajax!: AjaxService;
  constructor() {
    super();
    this.ajax = this.InjectorService(AjaxService);
  }

  static injector: Injector;

  searchDefinitions(word: string) {
    let url = this.url + word + "/definitions";
    let useCanonical = "?useCanonical=false";
    let limitCount = "&limit=5";
    let apiKey = "&api_key=" + this.Wordnik_API_Key;

    this.ajax.get(url + useCanonical + limitCount + apiKey).subscribe(
      (res: WordSearch) => {
        console.log(res);
      },
      (error) => {

      }
    )

    this.searchExample(word);
  }

  searchExample(word: string) {
    let url = this.url + word + "/examples";
    let useCanonical = "?useCanonical=false";
    let includeDuplicates = "&includeDuplicates=false";
    let apiKey = "&api_key=" + this.Wordnik_API_Key;
    this.ajax.get(url + useCanonical + includeDuplicates + apiKey).subscribe(
      (res: WordSearch) => {
        console.log(res);
      },
      (error) => {

      }
    )
  }
}
