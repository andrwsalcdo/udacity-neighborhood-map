/*Generating custom Google Map
  See documentation below for more details.
  https://developers.google.com/maps/documentation/javascript/reference
*/
var map; // declares a global map variable
var yelpResults; //results of Yelp Search API
var markers = {};
//var lat_lng;
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

      getYelpData('food', '28.424653,-81.469516', 'restaurants,bars');


      var venueMarker = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        position: starWarsVenue,
        title: "Star Wars Celebration 2017!"
      });

      var venueInfoWindow = new google.maps.InfoWindow({
        content: venueMarker.title
      });

      venueMarker.addListener('click', function() {
        venueInfoWindow.open(map,venueMarker);
      });


      // ko.applyBindings(new ViewModel());
}




function yelpMarkers (locationData, map) {
      // var self = this;
      // self.title = yelpLocations.name;

      TODO: //  yelp logo variable. file in images folder

      locationData.businesses.forEach(function(business) {

            lat_lng = {
              lat: business.location.coordinate.latitude,
              lng: business.location.coordinate.longitude
            };
            var directions = "business.location.coordinate.latitude, business.location.coordinate.longitude";
            var venue = "28.424653,-81.469516";

            var name = business.name;
            var img = business.image_url;
            var ratingImg = business.rating_img_url_small; //YELP display req
            var reviewCount = business.review_count; //YElP display req
            var phoneNumber = business.display_phone;
            var address = business.location.display_address[0];
            var city = business.location.city;
            var stateCode = business.location.state_code;
            var postalCode = business.location.postal_code;
            var description = business.snippet_text;
            var businessURL = business.url; // YELP display requirement

            var contentString = '<div id="content">' +
                  '<h3 id="placeName">' + name + '</h3>' +
                  '<img src="' + ratingImg + '"></img>' + '(' + reviewCount + ')' +
                  '<img id="yelp-img" src="' + img + '"/>' +
                  '<p class="phone"><a href="tel: +' + phoneNumber + '">' + phoneNumber + '</a></p>' + //'<br>'
                  '<p class="address"><a href="https://www.google.com/maps/dir/' + venue + '/' + directions + '">' + address + '<br>' + city + ', ' + stateCode + ' ' + postalCode + '</a></p>' +
                  '<p class="description">' + description + '<a href="' + businessURL +'" target="_blank"> (&#8230;)</a></p>' +
                  '</div>'; //end id=content


          var infowindow = new google.maps.InfoWindow({
                content: contentString,
                maxWidth: 300  
          });

          markers[name] = new google.maps.Marker({
                position: lat_lng,
                map: map,
                animation: google.maps.Animation.DROP,
                title: name
          });

          markers[name].addListener('click', function() {
                if (currentInfoWindow) {
                    currentInfoWindow.close();
                    currentMarker.setAnimation(null);
                }

                currentInfoWindow = infowindow;
                currentMarker = markers[name];

                infowindow.open(map, markers[name]);
                markers[name].setAnimation(google.maps.Animation.BOUNCE);

                google.maps.event.addListener(infowindow, 'closeclick', function() {
                    currentMarker.setAnimation(null);
                });
            });
        });
  // self.isVisible = ko.observable(true);
}




  /**
    *@function getYelpData()
    *Makes an asynch call to the Yelp Search API,
    *calls (todo: yelpMarkers()) with the results & stores the
    *results in a global var.
    *@param {string} termVal - Search term (food, bars, etc)
    *@param {string} locationVal - specifies the combination of address, city,etc
    *@param {string} categoryVal - Category to filter search results with.
  */
function getYelpData (termVal, locationVal, categoryVal) {

      /**
       * Generates a random number and returns it as a string for OAuthentication
       * @return {string}
       */
      function nonce_generate() {
        return (Math.floor(Math.random() * 1e12).toString());
      }

      var yelp_url = 'https://api.yelp.com/v2/search?';

      var parameters = {
        term: termVal,
        location: locationVal,
        category_filter: categoryVal,
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

          yelpMarkers(results, map)
          yelpResults = results;
          console.log(results);

        },
        error: function(error) {
          alert('Warning: This is not the location data you are looking for!')
          console.log("I have a bad feeling about this.");
        }
      };

      // Send AJAX query via jQuery library.
      $.ajax(settings);
}












// var ViewModel = function() {
//   var self = this;
//   //place array
//   this.placeList = ko.observableArray([]);
//
// }
/*
  Calls the initMap() function when the page loads
    (implements the map)
*/
window.addEventListener('load', initMap);
