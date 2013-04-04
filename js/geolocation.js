function getGeolocation() {
	spinnerShow();
    navigator.geolocation.getCurrentPosition(onGeolocationSuccess, onGeolocationError);
}

function onGeolocationSuccess(position) {

    //                        alert('Latitude: ' + position.coords.latitude + '\n' +
    //                              'Longitude: ' + position.coords.longitude + '\n' +
    //                              'Altitude: ' + position.coords.altitude + '\n' +
    //                              'Accuracy: ' + position.coords.accuracy + '\n' +
    //                              'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
    //                              'Heading: ' + position.coords.heading + '\n' +
    //                              'Speed: ' + position.coords.speed + '\n' +
    //                              'Timestamp: ' + position.timestamp + '\n');
	spinnerHide();
    showMap(position);
}

function onGeolocationError(error) {
	spinnerHide();
    switch (error.code) {
        case error.PERMISSION_DENIED: alert("user did not share geolocation data");
            break;
        case error.POSITION_UNAVAILABLE: alert("could not detect current position");
            break;
        case error.TIMEOUT: alert("retrieving position timed out");
            break;
        default: alert("unknown error");
            break;
    }
}