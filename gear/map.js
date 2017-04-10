  var map, newUser, users, osm, firstLoad;

      firstLoad = true;

      //users = new L.FeatureGroup();
      users = new L.MarkerClusterGroup({spiderfyOnMaxZoom: true, showCoverageOnHover: false, zoomToBoundsOnClick: true});
      newUser = new L.LayerGroup();


        var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });

        var Esri_WorldImagery = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        });

        var Esri_WorldTopoMap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
        });

        var prov = L.tileLayer.wms('http://localhost:8080/geoserver/ows?', {
            layers: 'hms:pro_dhf',
            format: 'image/png',
            transparent: true
        });

        var amp = L.tileLayer.wms('http://localhost:8080/geoserver/ows?', {
            layers: 'hms:amp_dhf',
            format: 'image/png',
            transparent: true
        });

        var tam = L.tileLayer.wms('http://localhost:8080/geoserver/ows?', {
            layers: 'hms:tam_dhf',
            format: 'image/png',
            transparent: true
        });

        var dengue_buffer = L.tileLayer.wms('http://localhost:8080/geoserver/ows?', {
            layers: 'hms:dengue_buffer',
            format: 'image/png',
            transparent: true
        });

        var dengue_point1 = L.tileLayer.wms('http://localhost:8080/geoserver/ows?', {
            layers: 'hms:dengue_point',
            format: 'image/png',
            transparent: true
        });

        var dengue_point = L.tileLayer.wms('http://localhost:8080/geoserver/ows?', {
            layers: 'hms:dengue_point',
            format: 'image/png',
            transparent: true
        });

        var vill = L.tileLayer.wms('http://localhost:8080/geoserver/ows?', {
            layers: 'hms:vill_dhf',
            format: 'image/png',
            transparent: true
        });

        var baseMaps = {
            "OSM": osm,
            "Esri_WorldImagery": Esri_WorldImagery,
            "Esri_WorldTopoMap": Esri_WorldTopoMap
        };

        var overlayMaps = {
            "dengue_buff": dengue_buffer,
            "dengue_point": dengue_point,
            "vill": vill,
            
            "tam": tam,
            "amp": amp,
            "prov": prov
        };

      map = L.map('map', {
        //center: new L.LatLng(16, 100),
        //zoom: 10,
        center: [16.8, 100],
        zoom: 8,
        //layers: [osm, users, newUser]
        layers: [Esri_WorldTopoMap, dengue_point, prov, amp, tam, users, newUser]
      });

      L.control.layers(baseMaps, overlayMaps).addTo(map);

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

        getUsers();



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
            var name = data[i].pat_name;

            var title = "<div style='font-size: 18px; color: #0078A8;'>"+ data[i].pat_name +"</div>";

            var marker = L.marker(location, {
              title: name
            });
            //.addTo(map);
            marker.bindPopup("<div style='text-align: center; margin-left: auto; margin-right: auto;'>"+ title +"</div>", {maxWidth: '400'});
            users.addLayer(marker);
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
       // $("#loading-mask").show();
        $("#loading").show();
        var pat_name = $("#pat_name").val();
        var doc_name = $("#doc_name").val();
        var add_no = $("#add_no").val();
        var vill_name = $("#vill_name").val();
        var date_sick = $("#date_sick").val();
        var lat = $("#lat").val();
        var lng = $("#lng").val();
        if (pat_name.length == 0) {
          alert("Name is required!");
          return false;
        }
        if (add_no.length == 0) {
          alert("address is required!");
          return false;
        }

        var dataString = 'pat_name='+ pat_name + 
        '&doc_name=' + doc_name + 
        '&add_no=' + add_no + 
        '&vill_name=' + vill_name + 
        '&date_sick=' + date_sick + 
        '&lat=' + lat + '&lng=' + lng;

        $.ajax({
          type: "POST",
          url: "insert_user.php",
          data: dataString,
          success: function() {
            cancelRegistration();
            users.clearLayers();
            getUsers();
            //$("#loading-mask").hide();
            $("#loading").hide();
            //$('#insertSuccessModal').modal('show');
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
            '<div class="form-group">'+
              '<label><strong>ชื่อคนไข้:</strong> <i>marker title</i></label>'+
              '<input type="text" class="form-control" placeholder="Required" id="pat_name" name="pat_name" />'+
              '</div><div class="form-group">'+
              '<label><strong>ชื่อหมอ:</strong> <i>marker title</i></label>'+
              '<input type="text" class="form-control" placeholder="Required" id="doc_name" name="doc_name" />'+
              '</div><div class="form-group">'+
              '<label><strong>ที่อยู่:</strong> <i>never shared</i></label>'+
              '<input type="text" class="form-control" placeholder="Required" id="add_no" name="add_no" />'+
              '</div><div class="form-group">'+
              '<label><strong>หมู่บ้าน:</strong></label>'+
              '<input type="text" class="form-control" placeholder="Optional" id="vill_name" name="vill_name" />'+
              '</div><div class="form-group">'+
              '<label><strong>วันรายงาน:</strong></label>'+
              '<input type="date" class="form-control" placeholder="Optional" id="date_sick" name="date_sick" />'+
              '</div>'+
              '<input style="display: none;" type="text" id="lat" name="lat" value="'+e.latlng.lat.toFixed(8)+'" />'+
              '<input style="display: none;" type="text" id="lng" name="lng" value="'+e.latlng.lng.toFixed(8)+'" /><br><br>'+
              '<div class="row">'+
                '<button type="button" class="btn" onclick="cancelRegistration()">Cancel</button>  '+
                '<button type="button" class="btn btn-primary" onclick="insertUser()">Submit</button>'+
              '</div>'+
              '</form>';
        marker.bindPopup(form).openPopup();
      }