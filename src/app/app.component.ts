import { Component, OnInit } from '@angular/core';
import { TwitterService } from './twitter.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services';
 
declare var google: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	geocoder:any;
  title = 'NowPlaying';
  tweets = [];
  city;

	constructor(private twitter: TwitterService, public domSanitizer: DomSanitizer,public mapsApiLoader: MapsAPILoader, private wrapper: GoogleMapsAPIWrapper) {
		this.mapsApiLoader = mapsApiLoader;
		this.wrapper = wrapper;
    this.mapsApiLoader.load().then(() => {
      this.geocoder = new google.maps.Geocoder();
    });
	}

  ngOnInit() { 
  	let self = this;
  	if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(function(position) {
      	var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      	self.geocoder.geocode( { 'location': latlng}, function(results, status) {
      		if (status == 'OK') {
      			results.forEach(function(element){
				      element.address_components.forEach(function(element2){
				        element2.types.forEach(function(element3){
				          switch(element3){
				            case 'locality':
				              self.city = element2.long_name;
				              break;
				          }
				        })
				      });
				    });
      		}
      	});

      	self.twitter.getTweets(position).subscribe(twitterResponse => {
           (<any>window).twttr = (function(d, s, id) {
            let js, fjs = d.getElementsByTagName(s)[0],
              t = (<any>window).twttr || {};
            if (d.getElementById(id)) return t;
            js = d.createElement(s);
            js.id = id;
            js.src = 'https://platform.twitter.com/widgets.js';
            fjs.parentNode.insertBefore(js, fjs);

            t._e = [];
            t.ready = function(f) {
              t._e.push(f);
            };

            return t;
          }(document, 'script', 'twitter-wjs'));
		  		self.tweets = twitterResponse.data.statuses
          if ((<any>window).twttr.ready())
            (<any>window).twttr.widgets.load();
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
