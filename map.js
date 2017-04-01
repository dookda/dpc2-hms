  var map, newUser, users, osm, firstLoad;

      firstLoad = true;

      //users = new L.FeatureGroup();
      users = new L.MarkerClusterGroup({spiderfyOnMaxZoom: true, showCoverageOnHover: false, zoomToBoundsOnClick: true});
      newUser = new L.LayerGroup();


        var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });

      map = L.map('map', {
        //center: new L.LatLng(16, 100),
        //zoom: 10,
        center: [16, 100],
        zoom: 13,
        //layers: [osm, users, newUser]
        layers: [osm, users, newUser]
      });

      // GeoLocation Control
      function geoLocate() {
        map.locate({setView: true, maxZoom: 17});
      }
      var geolocControl = new L.control({
        position: 'topright'
      });
      geolocControl.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'leaflet-control-zoom leaflet-control');
        div.innerHTML = '<a class="leaflet-control-geoloc" href="#" onclick="geoLocate(); return false;" title="My location"></a>';
        return div;
      };

      map.addControl(geolocControl);
      map.addControl(new L.Control.Scale());

      //map.locate({setView: true, maxZoom: 3});

      $(document).ready(function() {
        $.ajaxSetup({cache:false});
        $('#map').css('height', ($(window).height() - 40));
        getUsers();
      });

      $(window).resize(function () {
        $('#map').css('height', ($(window).height() - 40));
      }).resize();

      function geoLocate() {
        map.locate({setView: true, maxZoom: 17});
      }

      function initRegistration() {
        map.addEventListener('click', onMapClick);
        $('#map').css('cursor', 'crosshair');
        return false;
      }

      function cancelRegistration() {
        newUser.clearLayers();
        $('#map').css('cursor', '');
        map.removeEventListener('click', onMapClick);
      }

      function getUsers() {
        $.getJSON("get_users.php", function (data) {
          for (var i = 0; i < data.length; i++) {
            var location = L.latLng(data[i].lat, data[i].lng);
            var name = data[i].name;
            var website = data[i].website;
            if (data[i].website.length > 7) {
              var title = "<div style='font-size: 18px; color: #0078A8;'><a href='"+ data[i].website +"' target='_blank'>"+ data[i].name + "</a></div>";
            }
            else {
              var title = "<div style='font-size: 18px; color: #0078A8;'>"+ data[i].name +"</div>";
            }
            if (data[i].city.length > 0) {
              var city = "<div style='font-size: 14px;'>"+ data[i].city +"</div>";
            }
            else {
              var city = "";
            }
            var marker = L.marker(location, {
              title: name
            }).addTo(map);
            marker.bindPopup("<div style='text-align: center; margin-left: auto; margin-right: auto;'>"+ title + city +"</div>", {maxWidth: '400'});
            //users.addLayer(marker);
          }
        })

        /*.complete(function() {
          if (firstLoad == true) {
            map.fitBounds(users.getBounds());
            firstLoad = false;
          };
        });*/
      }

      function insertUser() {
        $("#loading-mask").show();
        $("#loading").show();
        var name = $("#name").val();
        var email = $("#email").val();
        var website = $("#website").val();
        var city = $("#city").val();
        var lat = $("#lat").val();
        var lng = $("#lng").val();
        if (name.length == 0) {
          alert("Name is required!");
          return false;
        }
        if (email.length == 0) {
          alert("Email is required!");
          return false;
        }
        var dataString = 'name='+ name + '&email=' + email + '&website=' + website + '&city=' + city + '&lat=' + lat + '&lng=' + lng;
        $.ajax({
          type: "POST",
          url: "insert_user.php",
          data: dataString,
          success: function() {
            cancelRegistration();
            users.clearLayers();
            getUsers();
            $("#loading-mask").hide();
            $("#loading").hide();
            //$('#insertSuccessModal').modal('show');
          }
        });
        return false;
      }

      function removeUser() {
        var email = $("#email_remove").val();
        var token = $("#token_remove").val();
        if (email.length == 0) {
          alert("Email is required!");
          return false;
        }
        if (token.length == 0) {
          alert("Token is required!");
          return false;
        }
        var dataString = 'email='+ email + '&token=' + token;
        $.ajax({
          type: "POST",
          url: "remove_user.php",
          data: dataString,
          success: function(data) {
            //console.log(data);
            if (data > 0) {
              $('#removemeModal').modal('hide');
              users.clearLayers();
              getUsers();
              $('#removeSuccessModal').modal('show');
            }
            else {
              alert("Incorrect email or token. Please try again.");
            }
          }
        });
        return false;
      }

      function onMapClick(e) {
        var markerLocation = new L.LatLng(e.latlng.lat, e.latlng.lng);
        var marker = new L.Marker(markerLocation);
        newUser.clearLayers();
        newUser.addLayer(marker);
        var form =  '<form id="inputform" enctype="multipart/form-data" class="well">'+
              '<label><strong>Name:</strong> <i>marker title</i></label>'+
              '<input type="text" class="span3" placeholder="Required" id="name" name="name" />'+
              '<label><strong>Email:</strong> <i>never shared</i></label>'+
              '<input type="text" class="span3" placeholder="Required" id="email" name="email" />'+
              '<label><strong>City:</strong></label>'+
              '<input type="text" class="span3" placeholder="Optional" id="city" name="city" />'+
              '<label><strong>Website:</strong></label>'+
              '<input type="text" class="span3" placeholder="Optional" id="website" name="website" value="http://" />'+
              '<input style="display: none;" type="text" id="lat" name="lat" value="'+e.latlng.lat.toFixed(6)+'" />'+
              '<input style="display: none;" type="text" id="lng" name="lng" value="'+e.latlng.lng.toFixed(6)+'" /><br><br>'+
              '<div class="row-fluid">'+
                '<div class="span6" style="text-align:center;"><button type="button" class="btn" onclick="cancelRegistration()">Cancel</button></div>'+
                '<div class="span6" style="text-align:center;"><button type="button" class="btn btn-primary" onclick="insertUser()">Submit</button></div>'+
              '</div>'+
              '</form>';
        marker.bindPopup(form).openPopup();
      }