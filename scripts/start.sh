#!/bin/bash
# start.sh

# Copy built Angular files to Nginx's default directory
sudo cp -r dist/* /var/www/html/
