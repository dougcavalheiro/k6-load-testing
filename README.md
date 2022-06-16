# K6 load testing

This is a brief project created to perform tests using [K6](https://k6.io/).

## Setup

Requirements:
- [AWS dev/qa account](https://viafoura.atlassian.net/wiki/spaces/EK/pages/890896435/AWS) 
- Docker and docker-compose installed

## Contents

Inside all scripts must be stored into **scripts** dir

## Running

### Grafana Dashboard

Both docker-compose files contain Influxdb and Grafana to integrate with K6 tests in real time.
To check how the tests are going just access [this]( http://localhost:3000/d/k6/k6-load-testing-results) into your local machine after running any script

### Local tests

The local tests contain all the images needed to run a livecomments environment. 

First, run the docker-compose local entirely
```
docker-compose -f docker-compose.local.yaml up
```

Then, run k6 into another terminal
```
 docker-compose -f docker-compose.remote.yaml run k6 run /scripts/livecomments-local.js
```

### Remote

First, start the influxdb and grafana
```
docker-compose -f docker-compose.remote.yaml up influxdb grafana
```

Then, run k6 into another terminal
```
 docker-compose -f docker-compose.remote.yaml run k6 run /scripts/livecomments.js
```
#### Environment Variables
You also can overwrite the variables by running: 
```
 docker-compose -f docker-compose.remote.yaml run k6 run -e VARIABLE_NAME={VALUE} -e -e VARIABLE_2_NAME={VALUE}  /scripts/livecomments.js
```

As an example these are the variables for the above script (livecomments.js):

- ENVIRONMENT (vf-dev2, vf-dev3...)
- USERNAME (username to obtain the JWT token seen [here](https://documentation.viafoura.com/docs/make-api-call))
- PASS (password to obtain the JWT token seen [here](https://documentation.viafoura.com/docs/make-api-call))
- SCOPE (site/site_group uuid)
- SECTION_UUID (section or site uuid)