#!/bin/sh

cd test/spec/functionalTest/rocketboard && mvn clean install && mvn compile && mvn -Dtest=rocketboard.RocketboardTests test ; cd ../../../..
