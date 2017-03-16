/*Generating custom Google Map
  See documentation below for more details.
  https://developers.google.com/maps/documentation/javascript/reference
*/
var map; // declares a global map variable
var yelpResults; //results of Yelp Search API
var markers = {};
var currentInfoWindow = false;
var currentMarker;
var InfoWindow;





/*
  inital google maps & Star Wars Venue Marker & infowindow.
  todo: styling map.
*/
function initMap() {

      //default map center. No Marker.
      var mapCenter = {lat:28.432204 , lng: -81.451681};

      //location of Star Wars Celebration 2017, &  1 marker of map
      var starWarsVenue = {lat: 28.424653, lng: -81.469516};

      var mapOptions = {
        center: mapCenter,
        zoom: 14
      }

      map = new google.maps.Map(document.getElementById('map'), mapOptions);


      var venueMarker = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        position: starWarsVenue,
        title: "Star Wars Celebration 2017!",
        icon: '.\/images/SW-Logo.png'
      });

      var venueInfoWindow = new google.maps.InfoWindow({
        content: venueMarker.title
      });

      venueMarker.addListener('click', function() {
        venueInfoWindow.open(map,venueMarker);
      });

      InfoWindow = new google.maps.InfoWindow();

}

      //Error handling for Google Maps
      function mapError() {
          document.getElementById("map").innerHTML = "<h2> Sorry, this is not the map you are looking for. </h2>";
          console.log("This is not the map you are looking for.");
      };


      /**
        *@function getYelpData()
        *Makes an asynch call to the Yelp Search API,
        *calls (todo: yelpMarkers()) with the results & stores the
        *results in a global var.
        *@param {array}  dataArray - the oberservvable Array of Yelp Business Results
      */
    function getYelpData (dataArray) {

          /**
           * Generates a random number and returns it as a string for OAuthentication
           * @return {string}
           */
          function nonce_generate() {
            return (Math.floor(Math.random() * 1e12).toString());
          }

          var yelp_url = 'https://api.yelp.com/v2/search?';

          var parameters = {
            term: 'food',
            location: '28.424653,-81.469516',
            category_filter: 'restaurants,bars',
            oauth_consumer_key: 'tAeJBk-kezO_eK060FfFBA',
            oauth_token: '_wdmTDQpJY92me5jlra4gcHjGiAxud_W',
            oauth_nonce: nonce_generate(),
            oauth_timestamp: Math.floor(Date.now()/1000),
            oauth_signature_method: 'HMAC-SHA1',
            oauth_version : '1.0',
            callback: 'cb', // This is crucial to include for jsonp implementation in AJAX or else the oauth-signature will be wrong.
          };

          var encodedSignature = oauthSignature.generate('GET',yelp_url, parameters, 'hWt0uDkG3Q5VaiihR7ucS3-teRc', 'zealgMUsh5QoVVSuOJEqg3-fxH4');
          parameters.oauth_signature = encodedSignature;


          var settings = {
            url: yelp_url,
            data: parameters,
            cache: true,
            dataType: 'jsonp',
            success: function(results) {
              yelpResults = results.businesses;

              //push each yelp business into yelpList array; create yelpMarker instance
              yelpResults.forEach (function(i) {
                dataArray.push( new YelpMarker(i));
              });
              //extend map bounds to all markers
              var bounds = new google.maps.LatLngBounds();
              dataArray().forEach (function (business) {
                bounds.extend(business.marker.position);
              });
              //Responsive map for resize browser window
              google.maps.event.addDomListener(window, 'resize', function() {
                map.fitBounds(bounds);
              });

              console.log(yelpResults);

            },
            error: function(error) {
              alert('Warning: This is not the Yelp data you are looking for!')
              console.log("I have a bad feeling about this.");
            }
          };

          // Send AJAX query via jQuery library.
          $.ajax(settings);
    }

    /**
      *@var YelpMarker
      *constructor function for each yelp business (YelpMarker instance) on the map.
      *@param {array}  dataArray - results of getYelpData();
    */
var YelpMarker = function(data) {


        var self = this;

        this.lat = data.location.coordinate.latitude;
        this.lng = data.location.coordinate.longitude;
        this.name = ko.observable(data.name);
        this.img = data.image_url;
        this.ratingImg = ko.observable(data.rating_img_url_small);
        this.reviewCount = data.review_count;
        this.phoneNumber = data.display_phone;
        this.address = data.location.display_address[0];
        this.city = data.location.city;
        this.stateCode = data.location.state_code;
        this.postalCode = data.location.postal_code;
        this.description = data.snippet_text;
        this.businessURL = data.url;


        this.marker = new google.maps.Marker({
              title: self.name(),
              position: new google.maps.LatLng(self.lat, self.lng),
              map: map,
              icon: '.\/images/Red.png',
              animation: google.maps.Animation.DROP,
        });

      //changes Marker to Red icon
      this.changeRed = function ()  {
        self.marker.setIcon('.\/images/Red.png');
      };
      //changes Marker to Green icon
      this.changeGreen = function ()  {
        self.marker.setIcon('.\/images/Green.png');
      };
      //center of map becomes marker location
      this.reCenterMap = function () {
           map.panTo(new google.maps.LatLng(self.lat, self.lng));
       };

       // location of starWarsVenue
        var venue = "28.424653,-81.469516";

        var contentString = '<div id="content">' +
                '<h3 id="placeName">' + self.name() + '</h3>' +
                '<img src="' + self.ratingImg() + '"></img>' + '(' + self.reviewCount + ')' +
                '<img id="yelp-img" src="' + self.img + '"/>' +
                '<p class="phone"><a href="tel: +' + self.phoneNumber + '">' + self.phoneNumber + '</a></p>' + //'<br>'
                '<p class="address"><a href="https://www.google.com/maps/dir/' + venue + '/' + self.address + '+' + self.city + '+' + self.stateCode + '+' + self.postalCode + '">' + self.address + '<br>' + self.city + ', ' + self.stateCode + ' ' + self.postalCode + '</a></p>' +
                '<p class="description">' + self.description + '<a href="' + self.businessURL +'" target="_blank"> (&#8230;)</a></p>' +
                '</div>'; //end id=content

      /* Recenters Map to new marker lat & lng.
       * Opens Infowwindow of marker and sets contentString
       *Changes Marker to Green
      */
      this.yelpInfoWindow = function() {
          self.reCenterMap();
          InfoWindow.open(map, self.marker);
          self.changeGreen();
          InfoWindow.setContent(contentString);
      };

      //Set Bounce Animation on Marker.
      this.toggleBounce = function() {
       self.marker.setAnimation(google.maps.Animation.BOUNCE);
       setTimeout(function () {
           self.marker.setAnimation(null);
       }, 1400);
     };


     /*If A marker is open, and
      *if user clicks on B marker,
      *A marker will close and changeRed();
      *B marker will open.
     */
     this.switchMarker = function() {
           if (currentInfoWindow) {
             currentInfoWindow.close();
             currentMarker.setIcon('.\/images/Red.png');
           }

           currentInfoWindow = InfoWindow;
           currentMarker = self.marker;

           self.yelpInfoWindow();
     };

     //closes infowindow when click on Map. changes marker to Red.
     this.mapClickCloseInfoWindow = function() {
          google.maps.event.addListener(map, 'click', function() {
                  InfoWindow.close();
                  self.changeRed();
            });
     };

     /*
      * combines all helper functions into 1 click listener event,
       *for the list view sidebar filter function in the viewmodel.
     */
     this.showMarkerInteraction = function() {
           self.yelpInfoWindow();
           self.toggleBounce();
           self.switchMarker();
           self.mapClickCloseInfoWindow();
     };

 /*visibility state & filter function help from:
    *http://stackoverflow.com/questions/29557938/removing-map-pin-with-search
 */

     //map click listener on Marker.
      this.marker.addListener('click', function() {
            self.yelpInfoWindow();
            self.toggleBounce();
            self.switchMarker();
            self.mapClickCloseInfoWindow();
        });

      //set visibility observable for yelpMarker
      this.isVisible = ko.observable(false);

      //toggle visibility state & automatically register/deregister with map
      this.isVisible.subscribe(function(currentState) {
          if (currentState) {
            self.marker.setMap(map);
          } else {
            self.marker.setMap(null);
          }
        });
      //set default state to true
      this.isVisible(true);

}






function ViewModel ()   {
      var self = this;

      /*
        *array of Yelp API data loaded from getYelpData
      */
      this.yelpList = ko.observableArray([]);
      getYelpData(this.yelpList);

      //user key input into search bar
      this.query = ko.observable('');


      /*visibility state & filter function help from:
         *http://stackoverflow.com/questions/29557938/removing-map-pin-with-search
      */
      /*
          Returns matched markers & sets their visibility = display
          Returns matching subset of location items, similar to this.yelpList
          forEach over the return value of the filterYelp computed observable in the view
      */
      this.filterYelp = ko.computed(function () {
         // query is non case sensitive
          var search = self.query().toLowerCase();


          return ko.utils.arrayFilter(self.yelpList(), function (business) {
                //if any character matches any marker
                var doesMatch = business.name().toLowerCase().indexOf(search) >= 0;
                //sets markers with match to visible
                business.isVisible(doesMatch);

                return doesMatch;

            });
        });

      //data-bind: Click event for listed items in side bar view.
      //Open marker infowindow to corresponding marker from the list
      this.selectYelp = function(YelpMarker) {
              YelpMarker.showMarkerInteraction();
        };


};


var vm = new ViewModel();
ko.applyBindings (vm)
