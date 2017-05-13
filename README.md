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

          organization        144                IBM account organization ID

          authKey             151                Generated API key

          authToken	          152                Generated Authentication token

# [Mobile App Configuration](#mobile-app-configuration)
The IBM IoT platform configuration has to be done in the mobile app as well, since the mobile app is also registered as a device instance for receiving the readings published by the Raspberry Pi.

Edit the line numbers in [index.js](https://github.com/iotify/hello-iot-bluemix/blob/master/HelloIoTApp/www/js/index.js)

          Variable Name        Line no.            Description

          org                  55                  IBM account organization ID

          auth-key             60                  Generated API key	

          auth-token           61                  Generated authentication token  


# [Steps to Build the Mobile App](#steps-to-build-the-mobile-app)

For building the mobile app, please refer to the official Cordova & Android documentation to setup the build dependencies. You will have to setup a build system with the dependencies, primarily the NodeJS, Java and Ant among others. 

Follow the steps below to build the APK file for the mobile app. All these steps are to be performed on the build system. These steps have been verified on a build system with Ubuntu mate OS along with Android version 23 & Cordova 6.3.0

Step 1: Clone this repository and run the following commands from within the repository to pull the submodules from https://github.com/ibm-watson-iot/iot-nodejs to get the nodejs sdk for the IBM IoT platform.

	git submodule init
	git submodule update

Step 2: Add the android platform by executing this command in the terminal under the app root folder (HelloIoTApp)

		cordova platform add android
		
Step 3:	In the config.xml file in the root folder change the name of the app to the name you want. This is optional step. By default the app name is "Hello IoT"

Step 4: Build the app by executing the following command in the terminal in the root folder of the cordova app
          
          cordova build android

Step 5: Once build is successful, you can find the generated apk file in the following path relative to the cordova project root directory.
	
		/platforms/android/build/outputs/apk
			




