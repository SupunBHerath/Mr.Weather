let currentLocation;
let currentTown;
//  ================================= map ===========================
getCurrentLocation(); 
CurrentWeather();

var currentLocationMarker;
var map;
function initializeMap(latitude, longitude) {
    if (map) {
        map.remove(); // Remove existing map if any
    }

    map = L.map('map').setView([latitude, longitude], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Reverse geocoding to get location name
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
        .then(response => response.json())
        .then(data => {
            const locationName = data.display_name;
            console.log(data);
            currentLocation=data['address']['hamlet']
            currentTown=data['address']['town']
            console.log(currentLocation);

            currentLocationMarker = L.marker([latitude, longitude]).addTo(map);
            console.log(currentLocation);
            // currentLocationMarker.bindPopup(`location: ${currentLocation}`).openPopup(); 
            // updateMarker(latitude, longitude);
        })
        .catch(error => console.error('Error fetching location name:', error));
}


function updateMarker(latitude, longitude) {
    if (currentLocationMarker) {
        currentLocationMarker.setLatLng([latitude, longitude]);
        currentLocationMarker.bindPopup("Your updated location").openPopup();
    }
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;
                    initializeMap(latitude, longitude);
                
            },
            function (error) {
                console.error('Error getting location:', error.message);
                alert('Error getting your location. Please make sure location services are enabled.');
            }
        );
    } else {
        alert('Geolocation is not supported by your browser.');
    }
}
 //  =================================  Current  weather ===========================

 function CurrentWeather() {
    // currentTown ="Colombo";
    for (let i = 1; i < 4; i++) {
        let currentDate = new Date();
        let DaysAgo = new Date(currentDate);
        DaysAgo.setDate(currentDate.getDate()- i);

        // Format the date to match the API's expected format (YYYY-MM-DD)
        let formattedDate = DaysAgo.toISOString().split('T')[0];
        let apiUrl = `http://api.weatherapi.com/v1/history.json?key=f743f38e0e294672b4593454240702&q=${currentTown}&dt=${formattedDate}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                document.getElementById(d).innerHTML = formattedDate;
                let tem = "currentTemp" + i;
                let img = "homeIconY" + i;
                document.getElementById(tem).innerHTML = data["forecast"]["forecastday"]["0"]["day"]["avgtemp_c"] + "°C";
                document.getElementById(img).src = data["forecast"]["forecastday"]["0"]["day"]["condition"]["icon"];
            })
            .catch(error => {
                showError(error);
                console.error("Error fetching weather data:", error);
            });
    }
    let repo = {
        method: "GET"
    };
    fetch(`http://api.weatherapi.com/v1/current.json?key=f743f38e0e294672b4593454240702&q=${currentTown}`, repo).then(respone => respone.json())
        .then(data => {
            console.log(data);
            // let Search = search.charAt(0).toUpperCase() + search.slice(1)
            document.getElementById("sCity").innerHTML = "";
            document.getElementById("cwIcon").src = data["current"]["condition"]["icon"];
            document.getElementById("temp").innerHTML = data["current"]["temp_c"] + " °C";
            document.getElementById("tz_id").innerHTML = data["location"]["tz_id"] ;
            document.getElementById("temp_c").innerHTML = data["current"]["temp_c"] +" °C";
            document.getElementById("humidity").innerHTML = data["current"]["humidity"]+" % ";
            document.getElementById("wind_kph").innerHTML = data["current"]["wind_kph"] +" kph";
            document.getElementById("url").innerHTML = data["current"]["condition"]["text"];
            document.getElementById("region").innerHTML = data["location"]["region"];
            document.getElementById("country").innerHTML = data["location"]["country"];
            document.getElementById("cityName").innerHTML = currentTown;
            console.log(currentLocation);
            let lat = data["location"]["lat"];
            let lon = data["location"]["lon"];
            initializeMap(lat, lon);
            // document.getElementById("t4").innerHTML = data["current"]["temp_c"] + "°C";

            dayData();
        })
        .catch(error => {
            document.getElementById("sCity").innerHTML = "Suggester city ";

            alert('City not found');


            fetch(`http://api.weatherapi.com/v1/current.json?key=f743f38e0e294672b4593454240702&q=Colombo`, repo).then(respone => respone.json())
            .then(data => {
                console.log(data);
                // let Search = search.charAt(0).toUpperCase() + search.slice(1)
                // document.getElementById("sCity").innerHTML = "";
                document.getElementById("cwIcon").src = data["current"]["condition"]["icon"];
                document.getElementById("temp").innerHTML = data["current"]["temp_c"] + " °C";
                document.getElementById("tz_id").innerHTML = data["location"]["tz_id"] ;
                document.getElementById("temp_c").innerHTML = data["current"]["temp_c"] +" °C";
                document.getElementById("humidity").innerHTML = data["current"]["humidity"]+" % ";
                document.getElementById("wind_kph").innerHTML = data["current"]["wind_kph"] +" kph";
                document.getElementById("url").innerHTML = data["current"]["condition"]["text"];
                document.getElementById("region").innerHTML = data["location"]["region"];
                document.getElementById("country").innerHTML = data["location"]["country"];
                document.getElementById("cityName").innerHTML = "Colombo";
                console.log(currentLocation);
                let lat = data["location"]["lat"];
                let lon = data["location"]["lon"];
                initializeMap(lat, lon);
                // document.getElementById("t4").innerHTML = data["current"]["temp_c"] + "°C";
    
                dayData();
            })
        })


}
// ================ weather seach ============================
function weatherSearch() {
    console.log("weather Search");
    let search = document.getElementById("searchText").value;
    console.log(search);
    let repo = {
        method: "GET"
    };
    fetch(`http://api.weatherapi.com/v1/current.json?key=f743f38e0e294672b4593454240702&q=${search}`, repo).then(respone => respone.json())
        .then(data => {
            console.log(data);
            let Search = search.charAt(0).toUpperCase() + search.slice(1)
            document.getElementById("sCity").innerHTML = "";
            document.getElementById("cwIcon").src = data["current"]["condition"]["icon"];
            document.getElementById("temp").innerHTML = data["current"]["temp_c"] + " °C";
            document.getElementById("tz_id").innerHTML = data["location"]["tz_id"] ;
            document.getElementById("temp_c").innerHTML = data["current"]["temp_c"] +" °C";
            document.getElementById("humidity").innerHTML = data["current"]["humidity"]+" % ";
            document.getElementById("wind_kph").innerHTML = data["current"]["wind_kph"] +" kph";
            document.getElementById("url").innerHTML = data["current"]["condition"]["text"];
            document.getElementById("region").innerHTML = data["location"]["region"];
            document.getElementById("country").innerHTML = data["location"]["country"];
            document.getElementById("cityName").innerHTML = data.location.name;
            currentLocation=search;
            console.log(currentLocation);
            let lat = data["location"]["lat"];
            let lon = data["location"]["lon"];
            initializeMap(lat, lon);
            // document.getElementById("t4").innerHTML = data["current"]["temp_c"] + "°C";

            dayData();
        })
        .catch(error => {
            document.getElementById("sCity").innerHTML = "Suggester city ";
            alert('City not found');
            
        })
};





// =================== 7 days forecast ================= 
function dayData() {
    let search = document.getElementById("searchText").value;
    for (let i = 1; i < 8; i++) {
        let currentDate = new Date();
        let DaysAgo = new Date(currentDate);
        DaysAgo.setDate(currentDate.getDate() + 2 - i);

        // Format the date to match the API's expected format (YYYY-MM-DD)
        let formattedDate = DaysAgo.toISOString().split('T')[0];
        let apiUrl = `http://api.weatherapi.com/v1/history.json?key=f743f38e0e294672b4593454240702&q=${search}&dt=${formattedDate}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                let d = "d" + i;
                console.log(d);
                document.getElementById(d).innerHTML = formattedDate;
                let tem = "t" + i;
                let img = "i" + i;
                document.getElementById(tem).innerHTML = data["forecast"]["forecastday"]["0"]["day"]["avgtemp_c"] + "°C";
                document.getElementById(img).src = data["forecast"]["forecastday"]["0"]["day"]["condition"]["icon"];


            })
            .catch(error => {
                showError(error);
                console.error("Error fetching weather data:", error);
            });
    }


}
