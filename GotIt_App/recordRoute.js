            
                        
            
            
            // This function initilize GPS and tells to listen to GPS events
            function initGPS(){
                console.log("Starting GPS");
                // check to see geo location available and if so get the data
                if ("geolocation" in navigator) {    
                 // call the watch position evetn
                    watchID = navigator.geolocation.watchPosition(getCoordinate,error);
                } else {
                 console.log("GPS not available");
                }
             
            }
            
            // This function gets called when ever a GPS coordinate is available
            function getCoordinate(position){ 
                var acc=document.getElementById("accuracyL");
                
                coord.lat  = position.coords.latitude;
                coord.lng = position.coords.longitude;
                console.log(coord.lat +"   "+coord.lng + "are coord"); 
                // new code testing start here
                placeCurruntMarker(coord);
                var posLatLon = converToLatLonObject(coord);
                drawPath(posLatLon);
            }
            
            // Error handling function for GPS
            function error(){
                console.log("ERROR: Unable to retrieve your location");
            }
            
            
            // This function change the currunt marker location on the map
            function placeCurruntMarker(pos){                
                console.log("Placing marker" + pos.lng);
                var posC = new google.maps.LatLng(pos.lat,pos.lng);
                console.log(posC);
                markerCurrent.setPosition(posC);
                map.setCenter(posC);            
                
            }
            
            // This function converts a longitude and latitude to LatLng Object
            function converToLatLonObject(pos){
                console.log("Change to coordinate");
                var posC = new google.maps.LatLng(pos.lat,pos.lng)
                return posC;
            }
            
            function drawPath(p){
                console.log("updating the polyline");
                path = pathLine.getPath();
                path.push(p);
            }
            
            

// This function execute when start button is clicked
            function routeStart(){
                console.log("Start Button clicked");
                var buttonClickedDate=new Date();
                modeStart=!modeStart;
                console.log("Start Button is clicked");
                // Start the timer. This timer will start collecting points to the route array and update the route array.
                // Also this timer will update the path array
                var buttonStart=document.getElementById("startR");
                
                if (modeStart){
                    startDate=new Date();
                    buttonStart.innerHTML="Pause";
                    timerV=setInterval(timerFunction,1000);
                }else{
                    duration=duration+(buttonClickedDate-startDate);
                    buttonStart.innerHTML="Start";
                    clearTimeout(timerV);
                }
            }
            
            // This function starts when Reset button is clicked.
            // It clears the routeArray and path array.
                    
            function routeReset(){
                routePoints=[];
                path=[];
                
            }
            
            function routeSave(){
                var date=new Date();
                var routeObj={
                    routeName:null,
                    routePoints:routePoints,
                    routeDate:date.toString(),
                    routeDuration: duration
                }
                
                clearTimeout(timerV);
                if (typeof(Storage) !== "undefined") {
                    var routeName = prompt("Please enter a route name", "myroute1");
                    if (/*(routeName != undefined) &*/ (typeof(routeName)==String)){
                        routeObj.routeName=routeName;
                        // Code for localStorage/sessionStorage.
                        var jsonVersion=JSON.stringify(routeObj);
                        localStorage.setItem(routeName,jsonVersion);
                        alert("Route is saved");                    
                    } else {
                        alert("Invalid route Name");
                    }
                }
                else{
                        
                    // Sorry! No Web Storage support..
                    alert("Storage is not supported");
                }
            }
            
            function panMapToCurruntLocation(){
             
                map.setCenter(converToLatLonObject(coord));
            }
            // Save the coordinate to an array when timer event occured.
            // In side this function a new coordinate is saved if it is not very close to the last saved coordinate.
            function timerFunction(){
                var MIN_DISTANCE_TH=0;
                console.log("Timer Event occured");
                // saving the coordinate
                if (routePoints.length>1){
                    console.log("Pushing the subsequent items to the array as length is>1");
                    // if the array is not empty
                    if (calculateDistance(routePoints[routePoints.length-1],coord)>MIN_DISTANCE_TH){
                        console.log("The point are apart. Points is added to the array");
                        routePoints.push(coord);
                    }else{
                        console.log("Distance between points is less then 5m");
                    }
                }else{
                    console.log("Push first items to array");
                    routePoints.push(coord);
                }
                // update currunt marker with the 
                if (coord.lat!=null){
                    placeCurruntMarker(coord);
                   // placeCurruntMarker(routePoints[routePoints.length-1]);
                }
                
                // update the polyline path
                if (routePoints.length>=2)
                    drawPath();
            }
 
            
            // This function calculates the distance between two coordinates points using
            //  Haversine Distance Formula
            function calculateDistance(point1,point2){
                var R = 6371000; // metres
                var delataLat = (point2.lat-point1.lat)*Math.PI/180;
                var deltaLng = (point2.lng-point1.lng)*Math.PI/180;
                var term1= Math.sin(delataLat/2)*Math.sin(delataLat/2)
                var term2= Math.cos(point1.lat*Math.PI/180)*Math.cos(point2.lat*Math.PI/180)*Math.sin(deltaLng/2)*Math.sin(deltaLng/2);
                var a=term1+term2;
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                var d = R * c; 
                return d;               
                
            }
            
            // This function draw a polyline using the routePath array
            
            function drawPath(){
                console.log("updating the polyline");
                path = pathLine.getPath();
                path.push(converToLatLonObject(routePoints[routePoints.length-1]));
            }

                
                
                             