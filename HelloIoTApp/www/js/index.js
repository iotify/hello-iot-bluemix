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
        "auth-key":"",
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
    FUNCTION NAME : containerlevel()
    DESCRIPTION   : sets the container height with appropriate input garbage level 
****************************************************************************************************/ 
    containerlevel:function(p_container,level){
            var color_red ="#e12727";
            var color_orange ="#fec057";
            console.log(level);
            $garbage = $(p_container);
           if (level >= 300) 
            {   
                console.log('opened');
                
                $("#s11").prop("hidden", false);
            }


            if (level>=220 && level <=299){ 
                $(s1).hide();
                $(s2).hide();
                $(s3).hide();
                $(s4).hide();
                $(s5).hide();
                $(s6).hide();
                $(s7).hide();
                $(s8).hide();
                $(s9).hide();
                $(s10).hide();
                $("#s11").prop("hidden", true); 
                
            }
            else if(level<= 220 && level>=161 ){ 
                $(s1).hide();
                $(s2).hide();
                $(s3).hide();
                $(s4).hide();
                $(s5).hide();
                $(s6).hide();
                $(s7).hide();
                $("#s11").prop("hidden", true);                
                $(s8,$garbage).attr('style',"fill:"+color_orange);
                $(s9,$garbage).attr('style',"fill:"+color_orange);
                $(s10,$garbage).attr('style',"fill:"+color_orange);
            }
            else if(level<= 160&& level>=101){ 
                $(s1).hide();
                $(s2).hide();
                $(s3).hide();
                $(s4).hide();
                $(s5).hide();
                $("#s11").prop("hidden", true);
                $(s6,$garbage).attr('style',"fill:"+color_orange);
                $(s7,$garbage).attr('style',"fill:"+color_orange);
                $(s8,$garbage).attr('style',"fill:"+color_orange);
                $(s9,$garbage).attr('style',"fill:"+color_orange);
                $(s10,$garbage).attr('style',"fill:"+color_orange);
            }
            else if(level<=100 && level>=65){ 
                $(s1).hide();
                $(s2).hide();
                $(s3).hide();                
                $("#s11").prop("hidden", true);
                $(s4,$garbage).attr('style',"fill:"+color_orange);
                $(s5,$garbage).attr('style',"fill:"+color_orange);
                $(s6,$garbage).attr('style',"fill:"+color_orange);
                $(s7,$garbage).attr('style',"fill:"+color_orange);
                $(s8,$garbage).attr('style',"fill:"+color_orange);
                $(s9,$garbage).attr('style',"fill:"+color_orange);
                $(s10,$garbage).attr('style',"fill:"+color_orange);
            }
            else if(level<=60){ 
                
                $("#s11").prop("hidden", true);
                $(s1,$garbage).attr('style',"fill:"+color_red);
                $(s2,$garbage).attr('style',"fill:"+color_red);
                $(s3,$garbage).attr('style',"fill:"+color_red);
                $(s4,$garbage).attr('style',"fill:"+color_red);
                $(s5,$garbage).attr('style',"fill:"+color_red);
                $(s6,$garbage).attr('style',"fill:"+color_red);
                $(s7,$garbage).attr('style',"fill:"+color_red);
                $(s8,$garbage).attr('style',"fill:"+color_red);
                $(s9,$garbage).attr('style',"fill:"+color_red);
                $(s10,$garbage).attr('style',"fill:"+color_red);
            }
            
    },



    subscribe: function(){  
    	console.log('subscribing');
        appClient.on("deviceEvent", function (deviceType, deviceId, eventType, format, payload) {
        console.log('got a message');
        console.log("Device Event from :: "+deviceType+" : "+deviceId+" of event "+eventType+" with payload : "+payload);
        var parsed = JSON.parse(payload);
        console.log(parsed.distance); 
        
        app.containerlevel("#container001",parsed.distance);
         
        
    });

     }
};
