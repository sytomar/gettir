#!/bin/bash
red=`tput setaf 1`
green=`tput setaf 2`
reset=`tput sgr0`
if [ -z "$NODE_ENV" ]; then
    echo "WARNING: ${red}NODE_ENV not set. Setting NODE_ENV=local${reset}";
    export NODE_ENV=local
fi
echo "${green}Running for $NODE_ENV environment ${reset}"
# Create logs directory
mkdir -p logs
# Create api docs swagger directory
mkdir -p apiDocs/swagger/
# Delete old Swagger generated file
rm -f apiDocs/swagger/swagger.yaml
# Install all npm packages
echo "${green}Installing node dependencies...${reset}"
#npm install
# Generate swagger documentations
node scripts/generateDocs.js