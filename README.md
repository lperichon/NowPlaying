# NowPlaying

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.1.5.

It uses Node.js and Express for a simple Twitter client that handles communication between the app and Twitter servers.

The Simple UI uses Bootstrap & Font Awesome.

In order to render Tweets we use the Twitter's official embed widget script.

The YouTube videos are embeded using the standard iframe method.

## Instructions

Run `node server.js` to start the twitter client.

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`.

## Work Log

1st day of work had almost no visible results, approximately 6/7 hours were spent with tools and API analysis and multiple tests

2nd day of work was a half day (3 or 4) hours, progress starts to be visible. I can list tweets, filtered by location and hashtag.

3rd day of work was also a half day, worked on various bugs getting the youtube video url. By the end of the day I had youtube videos and tweets rendered.

Final sprint. fixed the issue where the browser refused to do geolocation unless fired by user action. Installed bootstrap & font awesome to improve general style, added the tweet form, and refresh every 60s.
