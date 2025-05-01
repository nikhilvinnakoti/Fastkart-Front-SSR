#!/bin/bash

echo "Cleaning up old files..."

# Fix permissions to ensure ec2-user can delete all files
chmod -R u+rwX /home/ec2-user/fastkart/frontend

# Remove everything inside the frontend directory
rm -rf /home/ec2-user/fastkart/frontend/*

# Confirm cleanup
echo "Cleanup completed."

# Exit successfully
exit 0
