/*Generate the custom Google Map
  See documentation below for more details.
  https://developers.google.com/maps/documentation/javascript/reference
*/
var map; // declares a global map variable


/*
  Start here! initMap() is called when page is loaded.
*/
function initMap() {
  //create a new map-- only center & zoom required
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 28.424653  , lng: -81.469516 },
    zoom: 13
  });
}

/*
  Calls the initMap() function when the page loads
    (implements the map)
*/
window.addEventListener('load', initMap);
