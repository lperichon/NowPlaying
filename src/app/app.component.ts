import { Component, OnInit } from '@angular/core';
import { TwitterService } from './twitter.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	constructor(private twitter: TwitterService) {}

  title = 'NowPlaying';
  tweets = [];

  ngOnInit() { 
  	this.twitter.getTweets().subscribe(twitterResponse => {
  		console.log(twitterResponse.data.statuses)
  		this.tweets = twitterResponse.data.statuses
	  });
  }
}
