var appClient

       
/*************************************************************************************************
                       GARBAGE BIN MOBILE APP
**************************************************************************************************/
var app = {
/*************************************************************************************************
    FUNCTION NAME : initialize()
    DESCRIPTION   : initialize the app with events
**************************************************************************************************/
    initialize: function() {
        this.bindEvents();
        $(window).on("navigate", function (event, data) {          
            event.preventDefault();      
        })
    },
/**************************************************************************************************
    FUNCTION NAME : bindEvents()
    DESCRIPTION   : Initialize Pubnub and adds device ready eventListner to app 
****************************************************************************************************/ 
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        app.mqttInit();
    },
/**************************************************************************************************
    FUNCTION NAME : onDeviceReady()
    DESCRIPTION   : pass device ready id to received event 
****************************************************************************************************/   
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        console.log('deviceready');
         
    },
/**************************************************************************************************
    FUNCTION NAME : receivedEvent()
    DESCRIPTION   : on Deviceready loads the app displaying main page
****************************************************************************************************/ 
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
    },
/**************************************************************************************************
    FUNCTION NAME : mqttInit()
    DESCRIPTION   : initialize pubnub keys and set app to default function 
****************************************************************************************************/ 
    mqttInit: function() {

        
        var Client = require('ibmiotf');
        var appClientConfig = {
        "org" : "",
        "id" : "HELLO_IOT_APP_001",
        "domain": "internetofthings.ibmcloud.com",
        "type" : "IOTIFY_APP",
        "auth-method" : "apikey",
        "auth-key": "",
        "auth-token" : ""
        };
      appClient = new Client.IotfApplication(appClientConfig);
      
      appClient.connect();
       
       console.log('connected');
        appClient.on('connect', function () {
            
            appClient.subscribeToDeviceEvents("raspberry_pi");
            app.subscribe();

             
    	});
        
        
     

        
    },
/**************************************************************************************************
    FUNCTION NAME : sensordisplay()
    DESCRIPTION   : displays temperature and humidity levels
****************************************************************************************************/ 
    sensordisplay:function(temperature, humidity) {
        $temp = $("#temp001");
        $humid = $("#humid001");
        $temp[0].innerText = '' + temperature.toFixed(2) + '°C';
        $humid[0].innerText = '' + humidity.toFixed(2) + '%';
    },



    subscribe: function(){  
    	console.log('subscribing');
        appClient.on("deviceEvent", function (deviceType, deviceId, eventType, format, payload) {
        console.log('got a message');
        console.log("Device Event from :: "+deviceType+" : "+deviceId+" of event "+eventType+" with payload : "+payload);
        var parsed = JSON.parse(payload);
        console.log(parsed.temperature, parsed.humidity); 
        
        app.sensordisplay(parsed.temperature, parsed.humidity);
         
        
    });

     }
};
