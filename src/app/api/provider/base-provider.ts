import { Injector } from '@angular/core';

export class BaseProvider {
  static injector: Injector;

  InjectorService<T>(Service: T) {
    return BaseProvider.injector.get(Service);
  }
}
