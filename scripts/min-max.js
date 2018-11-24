const scores = require('./scores.json');
const _ = require('lodash');

console.log(
  _.max(Object.keys(scores).map(s => parseFloat(scores[s].sustainability)))
);

console.log(
  Object.keys(scores).filter(
    k => parseFloat(scores[k].sustainability) === 16892
  )
);
