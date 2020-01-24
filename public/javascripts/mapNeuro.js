
var map = L.map('map').setView([38.7075175, -9.1528528], 16);
var attribution = "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors";
var tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

var tiles = L.tileLayer(tileUrl, {attribution});
tiles.addTo(map);

var options = {
  expand: "click",
  placeholder: "Procurar"
}
var geocoder = L.Control.geocoder(options).addTo(map);

const neuroId = parseInt(sessionStorage.getItem("neuroId"));
const patientsL = document.getElementById("patientsL");

var layers = [];
var heats = [];
var mapLayers = [];
var mapHeats = [];


window.onload = function(){
  getNeuroTestsRoutes(neuroId);
}

/*$.getJSON("https://nominatim.openstreetmap.org/search/alges%20Portugal?format=json", function(data){

  var lat = data[0].lat;
  var lng = data[0].lon;
  L.marker([lat, lng]).addTo(map)
})*/

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
  alert('Total distance is ' + distance + ' km and total time is ' + time + ' minutes');
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
});


window.onload = function(){
  L.marker([38.720356, -9.131448]).addTo(map);
  var circle = L.circle([38.770611, -9.10697], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 220
}).addTo(map);

  $.ajax({
    url:"/api/neuros/"+2+"/patients/"+2+"/routes",
    method:"get",
    success: function(result, status){
      var routes = result.routes;
      var waypoints = JSON.parse(routes[0].waypoints);
      var polyline = L.polyline(waypoints, {color: 'blue'}).addTo(map);
      // zoom the map to the polyline
      map.fitBounds(polyline.getBounds());
    },
    error: function(){
        console.log("Error");
    }
  })
}*/

/*function loadMarkers(markers){
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
}*/

function showHeatmap(){
  for(l of mapLayers){
    map.removeLayer(l)
  }
  for(h of mapHeats){
    h.addTo(map)
  }
}

function showCircles(){
  for(l of mapLayers){
    l.addTo(map)
  }
  for(h of mapHeats){
    map.removeLayer(h)
  }
}

function getNeuroTestsRoutes(neuroId){
  $.ajax({
    url:"/api/neuros/"+neuroId+"/patients/tests/routes",
    method:"get",
    success: function(result, status){
      var testsRoutes = result.routes;
      setLayers(testsRoutes);
      loadHtmlRoutes(testsRoutes);
    },
    error: function(){
        console.log("Error");
    }
  })
}

function setLayers(testsRoutes){
  var item = {color: 'blue', fillColor: 'blue', fillOpacity: 0.5, radius: 100}
  for(p of testsRoutes){
    var layer = L.featureGroup();
    var heat = L.featureGroup();
    var points = [];
    for(r of p.routes){
      item.radius = r.repetitions*100;
      L.circle([r.coords.y, r.coords.x], item).addTo(layer).bindPopup("Tempo poupado: "+r.time).on('mouseover', function(e){this.openPopup()});
      points.push([r.coords.y, r.coords.x, r.repetitions*10]);
    }
    layers.push({patientId: p.patientId, layer: layer});
    L.heatLayer(points, {radius: 25}).addTo(heat);
    heats.push({patientId: p.patientId, heat: heat});
  }
}

function checkboxEvent(checkboxElem, patientId){
  var layer;
  var heat;
  for(l of layers){
    if(l.patientId == patientId){
      layer = l.layer;
    }
  }
  for(h of heats){
    if(h.patientId == patientId){
      heat = h.heat;
    }
  }
  if (checkboxElem.checked) {
    mapLayers.push(layer);
    mapHeats.push(heat)
  }else{
    const index = mapLayers.indexOf(layer);
    if (index > -1) {
      mapLayers.splice(index, 1);
    }
    const index = mapHeats.indexOf(heat);
    if (index > -1) {
      mapHeats.splice(index, 1);
    }
  }
}

function loadHtmlRoutes(testsRoutes){
  str = "";
  for(r of testsRoutes){
    str += "<li>"+r.patientId+": "+r.name+"<input type='checkbox' onchange='checkboxEvent(this,"+r.patientId+")'></li>";
  }
  patientsL.innerHTML = str;
}

//str += "<li>"+r.patientId+": "+r.name+"<input type='checkbox' onchange='checkboxEvent(this,\""+JSON.stringify(r.routes).replace(/\"/g,"\\\"")+"\")'></li>";

/*function loadHtmlRoutes(routes){
  str = "";
  for(i=0; i<routes.length; i++){
    if(!routes[i+1] || routes[i+1].patientId != routes[i].patientId){
      str += "<li>"+routes[i].patientId+": "+routes[i].name+"<input type='checkbox' onchange='checkboxEvent(this,\"";
      var patientRoutes = routes.splice(0,i+1);
      console.log(JSON.stringify(patientRoutes));
      str += JSON.stringify(patientRoutes).replace(/\"/g,"\\\"")+"\")'></li>";
      i=-1;
    }
  }
  patientsL.innerHTML = str;
}*/


