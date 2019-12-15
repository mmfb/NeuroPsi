
var map = L.map('map').setView([38.7075175, -9.1528528], 16);
var markers = [];
var attribution = "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors";
var tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

var tiles = L.tileLayer(tileUrl, {attribution});
tiles.addTo(map);

var options = {
  expand: "click",
  placeholder: "Procurar"
}
var geocoder = L.Control.geocoder(options).addTo(map);

$.getJSON("https://nominatim.openstreetmap.org/search/alges%20Portugal?format=json", function(data){

  var lat = data[0].lat;
  var lng = data[0].lon;
  console.log(lat+","+lng);
  L.marker([lat, lng]).addTo(map)
})




//var osmGeocoder = new L.Control.OSMGeocoder({placeholder: 'Search location...'});

//map.addControl(osmGeocoder);

/*if('geolocation' in navigator){
  navigator.geolocation.getCurrentPosition(function(position){
    markers.push({
      latLng:[position.coords.latitude, position.coords.longitude],
      icon:{
        color: 'blue',
        fillColor: 'blue',
        fillOpacity: 0.3,
        radius: 100
      }
    })
    loadMarkers(markers);
  })
}*/

window.onload = function(){
  loadMarkers(markers)
}

function loadMarkers(markers){
  for(m of markers){
    L.marker(m.latLng)
      .addTo(map)
      .bindPopup("Paciente")
      .on('mouseover', function(e){
        this.openPopup()
      })
      .on('mouseout', function(e){
        this.closePopup()
      });
    if('item' in m){
      L.circle(m.latLng, m.icon)
      .addTo(map)
      .bindPopup("Total poupado")
      .on('mouseover', function(e){
        this.openPopup()
      })
      .on('mouseout', function(e){
        this.closePopup()
      });
    }
  }
}


