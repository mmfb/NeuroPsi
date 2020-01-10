
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
  L.marker([lat, lng]).addTo(map)
})

/*var routeControl = L.Routing.control({
  waypoints: [
    L.latLng(38.770611, -9.10697),
    L.latLng(38.720356, -9.131448)
  ],
  show: false,
  routeWhileDragging: false,
  addWaypoints: false,
  draggableWaypoints: false,
  lineOptions: {
    styles: [{color: 'black', opacity: 0.15, weight: 9},
    {color: 'white',opacity: 0.8, weight: 6},
    {color: 'orange', opacity: 1, weight: 2}]}
}).addTo(map);

routeControl.on('routesfound', function(e) {
  var routes = e.routes;
  var summary = routes[0].summary;
  var latlngs = e.routes[0].coordinates;
  var time = Math.round(summary.totalTime % 3600 / 60);
  var distance = summary.totalDistance / 1000;
  //alert('Total distance is ' + distance + ' km and total time is ' + time + ' minutes');
  var waypoints = []
  for (i of latlngs){
    waypoints.push([i.lat, i.lng]);
  }
  
  $.ajax({
    url:"/api/patients/"+1+"/tests/"+1+"/routes",
    method:"post",
    data: {waypoints: JSON.stringify(waypoints), time: time, distance: distance},
    success: function(data, status){
        alert("Route guadada");
    },
    error: function(){
        console.log("Error");
    }
  })
});*/


window.onload = function(){
  loadMarkers(markers)

  $.ajax({
    url:"/api/neros/"+2+"/patients/"+2+"/routes",
    method:"get",
    success: function(result, status){
      var routes = result.routes;
      var waypoints = JSON.parse(routes[0].waypoints);
      var polyline = L.polyline(waypoints, {color: 'red'}).addTo(map);
      // zoom the map to the polyline
      map.fitBounds(polyline.getBounds());
    },
    error: function(){
        console.log("Error");
    }
  })
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


