
/* eslint-disable */
export const displayMap = locations => {

  mapboxgl.accessToken = "pk.eyJ1Ijoia2VlcGtsaW5jb2RlIiwiYSI6ImNsN2F0a3M4YzB2dWczeW84ZDFlMXphaDQifQ.u7qzQtpewcbvZ9AKtAaE7A";

var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/keepklincode/cl7fwkicu000014rvu3igv08z",
  scrollZoom: false
  // center: [-118.113491, 34.111745],
  // zoom: 1,
  // interactive: false
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
  // create marker

  const el = document.createElement("div")
  el.className = "marker";


  //Add marker
  new mapboxgl.Marker({
    element: el,
    anchor: "botton"
  })
  .setLngLat(loc.coordinates)
  .addTo(map);

  //Add Popup

  new mapboxgl.Popup({
    offset: 30
  })
  .setLngLat(loc.coordinates)
  .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
  .addTo(map);

  // Extend the map bounds to include the current location
  bounds.extend(loc.coordinates)
 
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100
  }
});

}

