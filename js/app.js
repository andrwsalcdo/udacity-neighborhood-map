/*Generating custom Google Map
  See documentation below for more details.
  https://developers.google.com/maps/documentation/javascript/reference
*/
var map; // declares a global map variable
var yelpResults; //results of Yelp Search API
var markers = {};
var currentInfoWindow = false;
var currentMarker;





/*
  Start here! initMap() is called when page is loaded.
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

      var markerArray = [];

      map = new google.maps.Map(document.getElementById('map'), mapOptions);


      var venueMarker = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        position: starWarsVenue,
        title: "Star Wars Celebration 2017!"
        //icon: todo: Some Star Wars icon, if possible.
      });

      var venueInfoWindow = new google.maps.InfoWindow({
        content: venueMarker.title
      });

      venueMarker.addListener('click', function() {
        venueInfoWindow.open(map,venueMarker);
      });

}



      /**
        *@function getYelpData()
        *Makes an asynch call to the Yelp Search API,
        *calls (todo: yelpMarkers()) with the results & stores the
        *results in a global var.
        *@param {string} termVal - Search term (food, bars, etc)
        *@param {string} locationVal - specifies the combination of address, city,etc
        *@param {string} categoryVal - Category to filter search results with.
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
            cache: true,                // This is crucial to include as well to prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
            dataType: 'jsonp',
            success: function(results) {
              yelpResults = results.businesses;

              //push each yelp business into yelpList array; create yelpMarker instance
              yelpResults.forEach (function(i) {
                dataArray.push( new yelpMarker(i));
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
              alert('Warning: This is not the location data you are looking for!')
              console.log("I have a bad feeling about this.");
            }
          };

          // Send AJAX query via jQuery library.
          $.ajax(settings);
    }


var YelpMarker = function(data) {

      TODO: //  yelp logo variable. file in images folder


      var self = this;
      var venue = "28.424653,-81.469516"; // location of starWarsVenue

      this.lat = data.location.coordinate.latitude;
      this.lng = data.location.coordinate.longitude;
      this.name = ko.observable(data.name);
      this.img = data.image_url;
      this.ratingImg = ko.observable(data.rating_img_url_small);
      this.reviewCount = data.reviewCount;
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
            //icon: TODO,
            animation: google.maps.Animation.DROP,
      });


      // var contentString = '<div id="content">' +
      //         '<h3 id="placeName">' + name + '</h3>' +
      //         '<img src="' + ratingImg + '"></img>' + '(' + reviewCount + ')' +
      //         '<img id="yelp-img" src="' + img + '"/>' +
      //         '<p class="phone"><a href="tel: +' + phoneNumber + '">' + phoneNumber + '</a></p>' + //'<br>'
      //         '<p class="address"><a href="https://www.google.com/maps/dir/' + venue + '/' + address + '+' + city + '+' + stateCode + '+' + postalCode + '">' + address + '<br>' + city + ', ' + stateCode + ' ' + postalCode + '</a></p>' +
      //         '<p class="description">' + description + '<a href="' + businessURL +'" target="_blank"> (&#8230;)</a></p>' +
      //         '</div>'; //end id=content


      // var infowindow = new google.maps.InfoWindow({
      //       content: contentString,
      //       maxWidth: 300
      // });

      // markers[name].addListener('click', function() {
      //       if (currentInfoWindow) {
      //           currentInfoWindow.close();
      //           currentMarker.setAnimation(null);
      //       }
      //
      //       currentInfoWindow = infowindow;
      //       currentMarker = markers[name];
      //
      //       infowindow.open(map, markers[name]);
      //       markers[name].setAnimation(google.maps.Animation.BOUNCE);
      //
      //       //pans to the marker
      //       map.panTo(lat_lng);
      //       //closes infowindow when a closeclick happens
      //       google.maps.event.addListener(infowindow, 'closeclick', function() {
      //           currentMarker.setAnimation(null);
      //       });
      //       //Close an open infowindow when the map is clicked
      //       google.maps.event.addListener(map, 'click', function() {
      //           infowindow.close();
      //       });
      //   });
    //});

  // self.isVisible = ko.observable(true);
}






var ViewModel = function() {
      var self = this;

      /*
        *array of Yelp API data loaded from getYelpData
        *bind yelpList to <ul> view
      */
      this.yelpList = ko.observableArray([]);
      getYelpData(this.yelpList);

      //user input into search bar
      self.userInput = ko.observable('');




};
var vm = new ViewModel();
ko.applyBindings (vm);
