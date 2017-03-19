# Udacity Neighborhood Map Project

### Overview
Udacity project in the Front End Web Developer Nanodegree. This is a single page application featuring a map of a chosen neighborhood.
Map functionalities includes map markers to identify popular locations or places you’d like to visit, a search function to easily discover these locations, a list view to support simple browsing of all locations, and third-party APIs that provide additional information about each of these locations.
This project features [Knockout.js](http://knockoutjs.com/documentation/introduction.html)

Project was evaluated by a Udacity reviewer according to this [rubric](https://review.udacity.com/#!/rubrics/17/view)

### Synopsis
A map surrounding the Orange County Convention Center in Orlando, FL showing local restaurants and bars using [Google Map API V3](https://developers.google.com/maps/documentation/javascript/reference) and [Yelp API v2](https://www.yelp.com/developers/documentation/v2/overview).

[Star Wars Celebration 2017](http://www.starwarscelebration.com/Home/) is used as inspiration for the project. It takes place between April 13 -- April 16, 2017.

>Starting on April 1st, 2017, you will no longer be able to sign up for Yelp API v2.

### How to get started

Experience the app at https://andrwsalcdo.github.io/udacity-neighborhood-map

To explore the codebase:
- Visit https://github.com/andrwsalcdo/udacity-neighborhood-map
- Clone or download the repository

### App functionalities
- Automatically adapts to different viewports, adjusts bounds and zooms to accommodate all markers.
- Notifies users if an error occurs.
- Menu opens and closes with the hamburger icon
- Collects data using Google Maps APIs and Yelp APIs.
- List of venues can be filtered by keywords in the Search bar. Filtering the list also filters respective map markers.
- Click on item in list view changes css properties, changes marker's icon and animation, and opens infowindow with Yelp information.
- Clik on marker changes icon, animation, and infowindow properties.
- Click on map closes marker if a marker is open.

### Tools
- [Knockout.js](http://knockoutjs.com/documentation/introduction.html)
- [Bootstrap](http://getbootstrap.com/)
- [jQuery](http://api.jquery.com/)
- [Google Map API V3](https://developers.google.com/maps/documentation/javascript/reference)
- [Yelp API V2](https://www.yelp.com/developers/documentation/v2/overview)

### Attributions

#### Icons
- [Green Light Saber](https://www.iconfinder.com/icons/15786/green_light_saber_star_wars_icon#size=128)
- [Red Light Saber](https://www.iconfinder.com/icons/15777/darth_mauls_light_saber_star_wars_icon#size=128)
- [Star Wars Logo](https://icons8.com/web-app/for/all/star%20wars)

#### References  
- http://stackoverflow.com/questions/7095574/google-maps-api-3-custom-marker-color-for-default-dot-marker
- http://stackoverflow.com/questions/30093381/what-does-data-and-root-mean-in-the-following-context
- https://discussions.udacity.com/t/yelp-search-api-not-enough-data-length-problem/227106
