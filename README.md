# Hello IoT with IOTIFY & IBM IoT Framework

This is the accompanying source code for [this](https://iotify.help/virtual-lab/hello-iot/ibm.html) IOTIFY documentation.

This project runs an emulated Raspberry Pi with a temperature and humidity sensor which can send to users the current temperature and humidity values through a mobile app and also notify via SMS in case temperature reaches a critical point. It uses IBM's IoT Platform to enable MQTT based messaging between the Raspberry Pi and the mobile app.

#Overview
Mobile app which is used to display the current temperature and humidity values. The emulated Raspberry PI in IoTIFY's virtual lab is connected via an I2C bus to a virtual sensor which provides temperature and humidity values.


# [Pre Requisites](#pre-requisites)

1. [IBM Id Bluemix Account](https://console.ng.bluemix.net/registration/) 
2. [Twillio Account](https://www.twilio.com/try-twilio)


# [Python Script Configuration](#python-script-configuration)
You will have to add some configuration settings to make the application work with IBM IoT platform service and Twilio messaging.
These configurations are to be done as variables, which are already defined in the application code under [bluemix.py](https://github.com/iotify/hello-iot-bluemix/blob/master/bluemix.py).

Edit the variables in the following lines as follows 

          Variable name       Line no.           Description

          account_sid         23                 Twilio account SID

          auth_token          24                 Twilio account authToken
          
          twilionumber        28                 Twilio Number ( Your Twilio subscribed number)
          
          receivernumber      29                 Twilio verified number (where you want to receive the SMS notifications). 
                                                 Should have country code, for example +18458892405

          organization        146                IBM account organization ID

          authKey             153                Generated API key

          authToken	          154                Generated Authentication token

# [Mobile App Configuration](#mobile-app-configuration)
The IBM IoT platform configuration has to be done in the mobile app as well, since the mobile app is also registered as a device instance for receiving the readings published by the Raspberry Pi.

Edit the line numbers in [index.js](https://github.com/iotify/hello-iot-bluemix/blob/master/HelloIoTApp/www/js/index.js)

          Variable Name        Line no.            Description

          org                  55                  IBM account organization ID

          auth-key             60                  Generated API key	

          auth-token           61                  Generated authentication token  
