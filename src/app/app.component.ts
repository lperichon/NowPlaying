import { Component, OnInit } from '@angular/core';
import { TwitterService } from './twitter.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	constructor(private twitter: TwitterService, public domSanitizer: DomSanitizer) {}

  title = 'NowPlaying';
  tweets = [];

  ngOnInit() { 
  	let self = this;
  	if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(function(position) {
      	self.twitter.getTweets(position).subscribe(twitterResponse => {
		  		self.tweets = twitterResponse.data.statuses
			  });
      });
    }
  	
  }

  getYouTubeUrl(tweet) {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;

    var match = tweet.entities.urls[0].expanded_url.match(regExp);
    if (match && match[2].length == 11) {
        return "//www.youtube.com/embed/" + match[2];
    } else {
        return 'error';
    }
}
}
