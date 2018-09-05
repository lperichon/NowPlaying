import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { TwitterService } from './twitter.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
 
declare var google: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	geocoder:any;
  position = {
    coords: {
      latitude: 37.774929,
      longitude: -122.4194183
    }
  }
  title = 'NowPlaying';
  items = [];
  city = "San Francisco";
  tweetForm: FormGroup;
  nearMe = false;
  interval;

	constructor(private twitter: TwitterService, public domSanitizer: DomSanitizer,public mapsApiLoader: MapsAPILoader, private wrapper: GoogleMapsAPIWrapper, private formBuilder: FormBuilder) {
		this.mapsApiLoader = mapsApiLoader;
		this.wrapper = wrapper;
    this.mapsApiLoader.load().then(() => {
      this.geocoder = new google.maps.Geocoder();
    });
	}

  @ViewChildren('items') itemsQueryList: QueryList<any>;

  ngAfterViewInit() {
    this.itemsQueryList.changes.subscribe(t => {
      this.renderTweets();
    })
  }

  ngOnInit() { 
  	let self = this;
    this.tweetForm = this.formBuilder.group({
            videoUrl: ['', Validators.required],
            comment: ['', Validators.required]
        });
    this.getItems(this.position);
    this.interval = setInterval(() => { 
            this.getItems(this.position);
    }, 60000);
  		
  }

  onSubmit() {
    let self = this;
    // stop here if form is invalid
    if (this.tweetForm.invalid) {
        return;
    }

    this.twitter.tweet(this.tweetForm.controls.comment.value, this.tweetForm.controls.videoUrl.value).subscribe(
          data => this.items.unshift({tweet: data.data, videoUrl: self.getYouTubeUrl(data.data) != 'error' ? self.domSanitizer.bypassSecurityTrustResourceUrl(self.getYouTubeUrl(data.data)) : null}),
          err => console.log(err),
          () => this.tweetForm.reset()
      );

  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  getCurrentLocation() {
    let self = this;
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(function(position) {
        self.position = position;
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
        self.nearMe = true;
        self.getItems(position);
      });
    }
  }

  getItems(position) {
    let self = this;
    self.twitter.getTweets(position).subscribe(twitterResponse => {
      
      self.items = twitterResponse.data.statuses.map(obj => ({
          tweet: obj,
          videoUrl: self.getYouTubeUrl(obj) != 'error' ? self.domSanitizer.bypassSecurityTrustResourceUrl(self.getYouTubeUrl(obj)) : null
      }));
    });
  }

  renderTweets() {
    (<any>window).twttr.widgets.load();
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
