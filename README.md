Website Pavlova
----

[![Build Status](https://travis-ci.org/garciadiazjaime/website-pavlova.svg)](https://travis-ci.org/garciadiazjaime/website-pavlova)

Run project:
----
a) let's install all packages:

`npm install`

b) let's run dev server

`npm run dev`

By default server will run on http://127.0.0.1:8080/

Note: `npm run sprites` requires 'sass'
http://sass-lang.com/install

Deploy project
`npm run update`
`git status`
`git diff`
`npm run deploy`

Login rch
rhc -l setup email

Remove Cartridge
http://stackoverflow.com/questions/31323791/how-do-you-delete-a-database-cartridge-on-an-openshift-app

Setting up Envs
rhc env set DB_NAME=value -a app
rhc env set DB_USER=value -a app
rhc env set DB_PASSWORD=value -a app
rhc env set DJANGO_SETTINGS_MODULE=settings.prod -a app
rhc env set SENDGRID_API_KEY=value -a app
rhc env set NPM_CONFIG_PRODUCTION=true -a app
rhc env set API_URL=value -a app

Checking Envs
rhc env list -a app

Code to increase jslint max line length limit
/* eslint max-len: [2, 500, 4] */

API_URL=http://45.55.12.200:49179/ npm start

docker build -t garciadiazjaime/website-pavlova .
docker run -d -p 49172:3072 garciadiazjaime/website-pavlova
docker push garciadiazjaime/website-pavlova
docker pull garciadiazjaime/website-pavlova
