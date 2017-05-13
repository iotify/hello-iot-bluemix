# MQTT
import ibmiotf.application
import time
import json

# External module imports                                                                                                        
import RPi.GPIO as GPIO

#logging module
import logging 

# twilio module
from twilio.rest import Client

# datetime module
import datetime

from sht21 import SHT21

LOG_FILENAME = 'HelloIoTBluemix.log'
logging.basicConfig(filename=LOG_FILENAME,level=logging.DEBUG,format='%(asctime)s, %(levelname)s, %(message)s', datefmt='%Y-%m-%d %H:%M:%S')

account_sid = ""  # Enter your account sid
auth_token  = ""  # Enter your auth token

twilioClient = Client(account_sid, auth_token)

twilionumber = "" # Your Twilio phone Number you will get it while registration
receivernumber = "" #Your verified phone number

# GPIO set as input that can be used to disable sensor readings
# (0 means readings enabled, 1 means readings disabled)
SENSOR_DISABLE = 14

# GPIO set as output that signals when temperature is above a threshold value
# (0 means temperature below threshold, 1 means temperature above threshold)
TEMP_ALARM = 24

'''****************************************************************************************
Function Name 	:	sensorLoop()
Description		:	Periodically reads temperature and humidity value from the
SHT21 sensor and sends them to IBM Bluemix; sends an alert message when
temperature reaches a critical value
Parameters 		:	-
****************************************************************************************'''
currentCriticalLevelFlag = False
criticalLevelChangeOverFlag = False
sensorReadingTime = 0
criticalLevelReachedTime = 0
currentTemperature = 0
currentHumidity = 0
notificationSentTime = 0

LOOP_SAMPLING_TIME = 2
CRITICAL_TEMPERATURE = 40
NOTIFICATION_TIME_DELAY = 15


def sensorLoop():
	try:
		global client,deviceType,LOOP_SAMPLING_TIME,NOTIFICATION_TIME_DELAY,CRITICAL_TEMPERATURE,currentCriticalLevelFlag,criticalLevelChangeOverFlag
		sht21 = SHT21(1)
		GPIO.setmode(GPIO.BCM)
		GPIO.setup(SENSOR_DISABLE, GPIO.IN)
		GPIO.setup(TEMP_ALARM, GPIO.OUT)
		GPIO.output(TEMP_ALARM,False)

		deviceId = "RASPBERRY_PI_001"
		deviceType = "raspberry_pi"
		messageBody = "Critical temperature reached"
			
		while 1:

			if GPIO.input(SENSOR_DISABLE) == 0:
				time.sleep(LOOP_SAMPLING_TIME)		
				currentTemperature = sht21.read_temperature()
				currentHumidity = sht21.read_humidity()
				sensorReadingTime = datetime.datetime.now()

				message = {"ID":1,"temperature":currentTemperature,"humidity":currentHumidity}
				
				try:
					# publish the message to IBM Bluemix
					pubReturn = client.publishEvent(deviceType, deviceId, "status", "json", message)
					if pubReturn ==True:
						logging.info("The message successfully sent")
				except Exception  as e:
						logging.info("The sent message Failed")
						logging.error("The publishEvent exception httpcode :%s,message:%s,response:%s"(e.httpcode,e.message,e.response))
				

				if currentTemperature >= CRITICAL_TEMPERATURE:
					GPIO.output(TEMP_ALARM,True)
					if currentCriticalLevelFlag == False:
						currentCriticalLevelFlag = True
						criticalLevelChangeOverFlag = True
						criticalLevelReachedTime = datetime.datetime.now()
					else:
						criticalLevelChangeOverFlag = False

				else:
					GPIO.output(TEMP_ALARM,False)
					currentCriticalLevelFlag = False
					criticalLevelChangeOverFlag = False


				#This means that in this measurement loop , the changeover has happend 
				if criticalLevelChangeOverFlag == True:
					message = twilioClient.messages.create(body=messageBody,to=receivernumber,from_=twilionumber)

					notificationSentTime = datetime.datetime.now()
				

				# This means that in this measurement loop the level stays at the critical level
				
				elif (currentCriticalLevelFlag == True):
					#calculate timedifference
					diff = sensorReadingTime - notificationSentTime
	
					day  = diff.days
					hour = (day*24 + diff.seconds/3600)
					diff_minutes = (diff.days *24*60)+(diff.seconds/60)			

					if diff_minutes > NOTIFICATION_TIME_DELAY:
						message = twilioClient.messages.create(body=messageBody,to=receivernumber,from_=twilionumber)
						
						notificationSentTime = datetime.datetime.now()
			
						
	except KeyboardInterrupt: 
		GPIO.cleanup()
	except Exception as e:
		logging.error("Exception is %s,%s"%(e,type(e)))

	

'''****************************************************************************************
Function Name 	:	init()
Description		:	Function which connects to the ibmiotf service
Parameters 		:	-
****************************************************************************************'''

def init():
	global client,deviceType
	# Enter your organizations ID
	organization = "" #Your organization ID
	
	appId = "RASPBERRY_PI_001"   # The IBM Bluemix device you've created
	authMethod = "apikey" #Method of authentication (the only value currently supported is apikey)
	
	# Enter the autkey and authToken(These you will when you generate the api keys)
	
	authKey = "" #API key (required if auth-method is apikey).
	authToken = ""#API key token (required if auth-method is apikey).
	
	try:
		# options require for the connection
		options = {"org": organization, "id":appId, "auth-method": authMethod, "auth-key": authKey, "auth-token": authToken}
		client = ibmiotf.application.Client(options)
		client.connect()
	except ibmiotf.connectionException as e:
		logging.error("The iotfconnection Exception is %s,%s"%(e,type(e)))	


if __name__ == '__main__':
	init()
	sensorLoop()