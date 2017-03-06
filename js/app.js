/*Generate the custom Google Map
  See documentation below for more details.
  https://developers.google.com/maps/documentation/javascript/reference
*/
var map; // declares a global map variable


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

  venueMarker = new google.maps.Marker({
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



}

/*
  Calls the initMap() function when the page loads
    (implements the map)
*/
window.addEventListener('load', initMap);
