/*Generate the custom Google Map
  See documentation below for more details.
  https://developers.google.com/maps/documentation/javascript/reference
*/
var map; // declares a global map variable
var yelpLocations; //array of yelp locations
var marker;
var latlng;


function getYelpData () {

  /**
   * Generates a random number and returns it as a string for OAuthentication
   * @return {string}
   */
  function nonce_generate() {
    return (Math.floor(Math.random() * 1e12).toString());
  }

  var yelp_url = 'https://api.yelp.com/v2/search?';

  var parameters = {
    oauth_consumer_key: 'tAeJBk-kezO_eK060FfFBA',
    oauth_token: '_wdmTDQpJY92me5jlra4gcHjGiAxud_W',
    oauth_nonce: nonce_generate(),
    oauth_timestamp: Math.floor(Date.now()/1000),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_version : '1.0',
    callback: 'cb',             // This is crucial to include for jsonp implementation in AJAX or else the oauth-signature will be wrong.
    // term: 'food',
    // location: 'Orlando',
    ll: '28.424653,-81.469516', //starWarsVenue 
    sort: 1,
    radius_filter: 16000
  };

  var encodedSignature = oauthSignature.generate('GET',yelp_url, parameters, 'hWt0uDkG3Q5VaiihR7ucS3-teRc', 'zealgMUsh5QoVVSuOJEqg3-fxH4');
  parameters.oauth_signature = encodedSignature;

  var settings = {
    url: yelp_url,
    data: parameters,
    cache: true,                // This is crucial to include as well to prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
    dataType: 'jsonp',
    success: function(yelpData) {
      yelpLocations = yelpData.businesses;
      console.log(yelpLocations);
      console.log(yelpLocations[0].name) //lazy moon
      console.log(yelpLocations[0].location.coordinate.latitude)
    },
    error: function() {
      console.log("I have a bad feeling about this.");
    }
  };

  // Send AJAX query via jQuery library.
  $.ajax(settings);
}

getYelpData();


var Place = function (yelpLocations) {
        var self = this;
        self.title = yelpLocations.name;

        self.marker = new google.maps.Marker({
            title: yelpLocations.name,
            map: map,
            position: {
                lat: (yelpLocations.location.coordinate.latitude),
                lng: (yelpLocations.location.coordinate.longitude)
            }
        });

        self.isVisible = ko.observable(true);
}

var ViewModel = function() {
  var self = this;
  //place array
  this.placeList = ko.observableArray([]);
   //run through locations
   var j = yelpLocations.length;
   for (var i = 0; i < j; i++) {
       var tempMarker = new Place(yelpLocations[i]);
       this.placeList.push(tempMarker);
   }


}

/*
  Start here! initMap() is called when page is loaded.
*/
function initMap() {
  //location of Star Wars Celebration 2017, & 'center' & 1 marker of map
  var starWarsVenue = {lat: 28.424653, lng: -81.469516};
  //properties of Map
  var mapOptions = {
    center: starWarsVenue,
    zoom: 13
  }
  //create a new map-- only center & zoom required
  map = new google.maps.Map(document.getElementById('map'), mapOptions);

  var venueMarker = new google.maps.Marker({
    map: map,
    animation: google.maps.Animation.DROP,
    position: starWarsVenue,
    title: "Star Wars Celebration 2017!"
  });

  var infowindow = new google.maps.InfoWindow({
    content: venueMarker.title
  });

  venueMarker.addListener('click', function() {
    infowindow.open(map,venueMarker);
  });

  ko.applyBindings(new ViewModel());
}




/*
  Calls the initMap() function when the page loads
    (implements the map)
*/
window.addEventListener('load', initMap);
