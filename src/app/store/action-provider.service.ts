import { Injectable } from '@angular/core';
import { createProviderFrom } from '../basic-store/actionProvider';

@Injectable({
  providedIn: 'root'
})
export class ActionProviderService {

  provider = createProviderFrom({}).provider;

  constructor() { }
}
