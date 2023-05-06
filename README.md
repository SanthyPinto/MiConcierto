# Cloudinary Image Uploader

This is a Node.js script that updates concert logos in a MongoDB database and uploads them to Cloudinary.

## Requirements

Before running this script, make sure you have the following dependencies installed:

- **Node.js** (version 14 or higher)
- **MongoDB** (running locally or remotely)
- **NPM** package manager
- **Cloudinary** account
- **dotenv**, **cloudinary**, and **mongodb** NPM packages

## Installation

To install the necessary packages, run the following command:

npm install


## Configuration

Create a file called **.env** in the project's root directory with the following **Cloudinary** and **MongoDB** credentials:

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

MONGODB_URI=your-mongodb-uri


## Usage

To run the script, use the following command:

npm run cloudinary


This will update the concert logo titled "Diego El Cigala Canta A México" and upload all concert logos to **Cloudinary**. If there is an error uploading a logo, the script will log an error message to the console and continue processing the remaining concert logos.
