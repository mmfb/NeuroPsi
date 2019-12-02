var map = L.map('map').setView([38.7075175, -9.1528528], 16);

var attribution = "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors";
var tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

var tiles = L.tileLayer(tileUrl, {attribution});
tiles.addTo(map);

var markers = [
  {
    latLng: [38.7075175, -9.1528528],
    icon: {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 60
    }
  } 
];

window.onload(loadMarkers(markers));

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


