import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';

const endpoint = 'http://localhost:3000/';

export interface TwitterResponse {
  data: any;
  resp: any;
}

@Injectable({
  providedIn: 'root'
})
export class TwitterService {

  constructor(private http: HttpClient) { }

  getTweets() {
    return this.http.get<TwitterResponse>(endpoint + 'api/tweets');
  }
}
