//  對safe-html.pipe.ts做適當修改

import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Pipe({name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform {
    constructor(private sanitized: DomSanitizer) {
    }

    transform(value:any) {
        return this.sanitized.bypassSecurityTrustHtml(value);
    }
}

// 在使用innerHTML標籤的屬性裡使用以上safeHtml管道
