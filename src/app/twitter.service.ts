import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';

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

  getTweets(position) {
    let params = new HttpParams();
    params = params.append('latitude', position.coords.latitude);
    params = params.append('longitude', position.coords.longitude);
    return this.http.get<TwitterResponse>(endpoint + 'api/tweets', {params: params});
  }

  tweet(comment, videoUrl) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const params = new HttpParams()
      .set('comment', comment)
      .set('videoUrl', videoUrl);

    return this.http.post<TwitterResponse>(endpoint + 'api/tweet', {}, {headers: headers, params: params});
  }
}
