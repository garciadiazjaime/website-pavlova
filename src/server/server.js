/* eslint max-len: [2, 500, 4] */
import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RoutingContext } from 'react-router';
import bodyParser from 'body-parser';
import _ from 'lodash';

import DataWrapper from './dataWrapper';
import config from '../../config';
import apiRoutes from './helpers/api';
import routes from '../shared/config/routes';
import restClient from './helpers/rest-client';
import sitemap from '../shared/config/sitemap';

const app = express();
const _data = {};
const apiUrl = config.get('apiUrl');

function getSectionId(data, url) {
  if (_.isObject(data.items) && !_.isEmpty(data.items) && _.isArray(data.items.children) && data.items.children.length) {
    for (let i = 0, len = data.items.children.length; i < len; i++) {
      if (data.items.children[i].url === '/' + url) {
        return data.items.children[i].id;
      }
    }
  }
  return 0;
}

function getDataLevelTwo(props, data) {
  const response = {};
  const prop = props.substring(0, props.length - 1);
  if (_.isArray(data) && data.length) {
    data.map((item, index) => {
      response[prop + (index + 1)] = item;
    });
  }
  return response;
}

function getBlocksData(data) {
  const properties = ['slides', 'buttons', 'images', 'paragraphs', 'titles'];
  const response = {};
  if (_.isArray(data) && data.length) {
    data.map((item, index) => {
      const key = 'block' + (index + 1);
      response[key] = {};
      properties.map((prop) => {
        if (_.isArray(item[prop]) && item[prop].length) {
          response[key][prop] = prop === 'slides' ? item[prop] : getDataLevelTwo(prop, item[prop]);
        }
      });
    });
  }
  return response;
}

app.set('views', './views');
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false,
}));

app.use(express.static('static'));

app.use('/api/', apiRoutes);

app.get('/*', (req, res, next) => {
  const bits = req.url.split('/');
  const url = bits[1] || 'inicio';
  const sectionId = getSectionId(sitemap, url);
  if (sectionId) {
    const promises = [];
    promises.push(new Promise((resolve, reject) => {
      restClient({
        path: apiUrl + 'api/block/?section_id=' + sectionId,
      }).then((response) => {
        resolve(response.entity);
      }, (response) => {
        reject(response);
      });
    }));

    if (promises.length) {
      Promise.all(promises).then((data) => {
        const blocks = getBlocksData(data[0]);
        _data.blocks = blocks;
        next();
      });
    } else {
      next();
    }
  } else {
    next();
  }
}, (req, res) => {
  match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {
      const props = {
        blocks: _data.blocks,
      };
      const content = renderToString(<DataWrapper data={props}><RoutingContext {...renderProps} /></DataWrapper>);
      res.render('index', { content, props, apiUrl });
    } else {
      res.status(404).send('Not found');
    }
  });
});

app.set('ipaddress', config.get('ipaddress'));
app.set('port', config.get('port'));

const server = app.listen(app.get('port'), app.get('ipaddress'), (err) => {
  if (err) {
    console.log(err);
  }

  const host = server.address().address;
  const port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
