/* eslint-disable */

const locations =JSON.parse(document.getElementById('map').dataset.locations);

console.log(locations);


  mapboxgl.accessToken = 'pk.eyJ1IjoiamF2aWVyaGR6YiIsImEiOiJjbDQxdnhmMjMwMGFrM2RxdG1na2ZoejlhIn0.hyY9TrdfPufanUjhNA2leQ';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/javierhdzb/cl41watk9000v15mhmbyscdv8',
    center:[-101.715188,21.195659],
    zoom: 1, 
    scrollZoom: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    
    const el = document.createElement('div');
    el.className = 'marker';

    
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  });