#!/bin/bash

source /etc/profile
if [ ! -z $CATALINA_HOME ];then
	unset -v CATALINA_HOME
fi

DIRNAME=`dirname $0`
RUNHOME=`cd $DIRNAME/;pwd`

APP_PACKAGE=`basename $RUNHOME/*.war`
APP_NAME=`echo $APP_PACKAGE | sed -r 's/-((v|V)|[0-9])(.*).war//g'`
APP_PORT=8080

TOMCAT_PACKAGE=`basename $RUNHOME/../tomcat/*.tar.gz`
TOMCAT_NAME=${TOMCAT_PACKAGE%.tar.gz*}

JAVA="$JAVA_HOME/bin/java"
JAVA_OPTS="-Xms50M -Xmx128M -Djava.security.egd=file:/dev/./urandom"
export JAVA_OPTS=$JAVA_OPTS

LOGS_DIR=$RUNHOME/logs
LOG_FILE=${APP_NAME}.log
PID_FILE=${APP_NAME}.pid

check_status()
{
	check_process_port_and_name $APP_PORT tomcat
	if [ $status -eq 1 ];then
		echo "---$APP_NAME is already running---"
		exit 0
	fi
}

check_java()
{
	if [ -z "$JAVA_HOME" ];then
		echo -e "---the env parameter \"JAVA_HOME\" is not setted.---"
		exit 1
	elif [ ! -d $JAVA_HOME ];then
		echo -e "---the env parameter \"JAVA_HOME\" is not setted correctly.---"
		exit 1
	fi
}

create_log()
{
	if [ ! -d $LOGS_DIR ];then
    		mkdir $LOGS_DIR
	else
		rm -rf $LOGS_DIR/*
  	fi

	echo ===================RUN INFO=============== > $LOGS_DIR/$LOG_FILE
  	echo  @RUNHOME@ $RUNHOME >> $LOGS_DIR/$LOG_FILE
	echo  @APP_PACKAGE@ $APP_PACKAGE >> $LOGS_DIR/$LOG_FILE
	echo  @APP_NAME@ $APP_NAME >> $LOGS_DIR/$LOG_FILE
	echo  @APP_PORT@ $APP_PORT >> $LOGS_DIR/$LOG_FILE

	echo  @TOMCAT_PACKAGE@ $TOMCAT_PACKAGE >> $LOGS_DIR/$LOG_FILE
	echo  @TOMCAT_NAME@ $TOMCAT_NAME >> $LOGS_DIR/$LOG_FILE

  	echo  @JAVA@ $JAVA >> $LOGS_DIR/$LOG_FILE
  	echo  ============================================ >> $LOGS_DIR/$LOG_FILE
}

init_tomcat()
{	
	cd $RUNHOME	
	if [ ! -d tomcat ];then
		if [ -d $TOMCAT_NAME ];then
			mv $TOMCAT_NAME tomcat
		else
			if [ ! -f $TOMCAT_PACKAGE ];then
				cp -f ../tomcat/$TOMCAT_PACKAGE .
			fi
		
			tar -zxf $TOMCAT_PACKAGE

			mv $TOMCAT_NAME tomcat		
		fi	 
	fi

	if [ -f $TOMCAT_PACKAGE ];then
		rm -f $TOMCAT_PACKAGE
	fi

	rm -f tomcat/conf/server.xml
	cp -f server.xml tomcat/conf

	unzip -o -q -d tomcat/webapps/ROOT $APP_PACKAGE
}

start_app()
{
	SLEEP_NUM=6
	SLEEP_TIME=5

	#cd $RUNHOME/tomcat/bin	
	pid=$(nohup $RUNHOME/tomcat/bin/catalina.sh run >> $LOGS_DIR/$LOG_FILE 2>&1 & echo $!)
	echo $pid > $LOGS_DIR/$PID_FILE

	echo "---starting $APP_NAME, pid=$pid, please wait---"
	
	bStart=0		
	for n in $(seq $SLEEP_NUM);do	
		sleep $SLEEP_TIME

		process_status=$(ps -ef | grep $pid | grep -v grep | wc -l)
		port_status=$(lsof -i :$APP_PORT | grep LISTEN | grep -v grep | wc -l)
		if [ ! $process_status -eq 0 ] && [ ! $port_status -eq 0 ];then
			echo "---$APP_NAME start sucessfully, pid=$pid, port=$APP_PORT---"
			bStart=1
			break
		fi
	done
	
	if [ $bStart -eq 0 ];then
		echo "---$APP_NAME failed to start, please check logs for reason---"
	fi
}

check_process_port_and_name()
{
	# 1---ok 0---ng
	port_status=$(lsof -i :$1 | grep LISTEN | grep -v grep | wc -l)
	if [ ! $port_status -eq 0 ];then
		pid=$(lsof -i :$1 | grep LISTEN | grep -v grep | awk '{print $2}')
		process_status=$(ps -ef | grep $pid | grep $2 | grep -v grep | wc -l)
		if [ ! $process_status -eq 0 ];then
			status=1
		else
			status=0
		fi
	else
		status=0
	fi
}


check_status
check_java
create_log
init_tomcat
start_app
