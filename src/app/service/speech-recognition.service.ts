import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SpeechRecognitionService {
  private recognition: any;
  private speechRecognitionStarted = new Subject<void>();
  private speechRecognitionStopped = new Subject<void>();

  constructor() {
    const { webkitSpeechRecognition }: IWindow = <IWindow><unknown>window;
    this.recognition = new webkitSpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    // this.recognition.lang = 'zh-TW';
    this.recognition.lang = 'en-US';

    this.recognition.onstart = () => {
      this.speechRecognitionStarted.next();
    };

    this.recognition.onend = () => {
      this.speechRecognitionStopped.next();
    };
  }

  status = 0;
  start(): Observable<string> {
    if (this.status == 1) {
      this.status = 0;
      this.recognition.stop();
    }

    this.recognition.start();
    this.status = 1;
    return new Observable(observer => {
      this.recognition.onresult = (event) => {
        this.status = 0;
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        // this.recognition.stop();

        observer.next(finalTranscript);
      };

      this.recognition.onspeechend = (event) => {
        this.status = 0;
        this.recognition.stop();
      };
    });
  }

  stop() {
    this.recognition.stop();
  }

  get speechStarted(): Observable<void> {
    return this.speechRecognitionStarted.asObservable();
  }

  get speechStopped(): Observable<void> {
    return this.speechRecognitionStopped.asObservable();
  }
}

interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}
