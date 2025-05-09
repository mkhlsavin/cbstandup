#!/bin/bash

# Build the frontend
echo "Building frontend..."
npm run build

# Create deployment directory if it doesn't exist
echo "Creating deployment directory..."
sudo mkdir -p /var/www/cbstandup

# Copy build files to deployment directory
echo "Copying build files..."
sudo cp -r build/* /var/www/cbstandup/

# Set proper permissions
echo "Setting permissions..."
sudo chown -R www-data:www-data /var/www/cbstandup
sudo chmod -R 755 /var/www/cbstandup

# Restart Nginx
echo "Restarting Nginx..."
sudo systemctl restart nginx

echo "Deployment completed!" 