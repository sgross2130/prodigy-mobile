var map;

function showMap(position) {
    // center on current location
	// var mapCenter = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    // center on specific location
    var mapCenter = new google.maps.LatLng('32.728987', '-97.115008');

    var mapOptions = {
        center: mapCenter,
        zoom: 16,
        zoomControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    // create map
    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

    // create current location marker
    createMarker(position.coords.latitude, position.coords.longitude, 'Current Location');

    // create samsung marker
    //createMarker('32.9855859', '-96.700884', 'Samsung', '1301 E Lookout Dr, Richardson, TX', '(972) 761-7000');
    
    createMarker('32.728987', '-97.115008', 'UTA - Texas Hall', '701 S. Nedderman Dr., Arlington, TX', '');
    // get local places by type
                    var request = {
                        location: mapCenter,
                        radius: '5000',
                        types: [
                        //"department_store","clothing_store","shopping_mall","home_goods_store",
                        "gas_station","grocery_or_supermarket","convenience_store",
                        "bar","meal_delivery","meal_takeaway","restaurant","cafe","food",
                        //"movie_theater",
                        "hospital","doctor",
                        "lodging",
                        ]};

    //service = new google.maps.places.PlacesService(map);
    //service.nearbySearch(request, mapsearchcallback);

    // set label text
    $("#Lat").html(position.coords.latitude);
    $("#Lon").html(position.coords.longitude);
    $("#latlong").show();
    // resize map
    var newheight = $(window).height() - 230;
    $("#map_canvas").height(newheight).show();
    
}

            function mapsearchcallback(results, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    for (var i = 0; i < results.length; i++) {
                        var place = results[i];
                        createPlaceMarker(place);
                    }
                }
            }
            // create marker via PlaceResult object
            function createPlaceMarker(place) {
                console.log('creating marker for ' + place.name);
                var infoWindow = new google.maps.InfoWindow();
                var p = new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng());
                console.log(place.formatted_address);
                console.log(place.formatted_phone);
                var html = place.name + '<br/>';
                if (place.formatted_address != undefined) html += place.formatted_address + '<br/>';
                if (place.formatted_phone != undefined) html += place.formatted_phone;
                var marker = new google.maps.Marker({ map: map, position: p, title: place.name });
                google.maps.event.addListener(marker, 'click', function () {
                    infoWindow.setContent(html);
                    infoWindow.open(map, marker);
                });
            }


// manual creation of a marker
function createMarker(lat, lng, name, addr, phone) {
    console.log('creating marker for ' + name);

    var infoWindow = new google.maps.InfoWindow();
    var p = new google.maps.LatLng(lat, lng);

    var html = name + '<br/>';
    if (addr != undefined) html += addr + '<br/>';
    if (phone != undefined) html += phone;

    var marker = new google.maps.Marker({ map: map, position: p, title: name });
    google.maps.event.addListener(marker, 'click', function () {
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
    });
}