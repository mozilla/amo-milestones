[![Build Status](https://travis-ci.org/mozilla/amo-milestones.svg?branch=master)](https://travis-ci.org/mozilla/amo-milestones)
[![Coverage Status](https://coveralls.io/repos/github/mozilla/amo-milestones/badge.svg?branch=master)](https://coveralls.io/github/mozilla/amo-milestones?branch=master)

# amo-milestones

[![Greenkeeper badge](https://badges.greenkeeper.io/mozilla/amo-milestones.svg)](https://greenkeeper.io/)

A simple app to support looking up issues by milestone for the focus of AMO
team stand-ups.

This app is available to view here: https://amo-milestones.herokuapp.com/

## Running the app

### `npm start` or `yarn start`

Runs the app in development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will see the build errors and lint warnings in the console.

<img src='https://camo.githubusercontent.com/41678b3254cf583d3186c365528553c7ada53c6e/687474703a2f2f692e696d6775722e636f6d2f466e4c566677362e706e67' width='600' alt='Build errors'>

### `npm test` or `yarn test`

Runs the test watcher in an interactive mode.<br>
By default, runs tests related to files changes since the last commit.

[Read more about testing.](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#running-tests)

### `npm run build` or `yarn build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!


## Deployment

This app is deployed to heroku via the heroku branch e.g:

```
git push heroku master
```

## Built with create-react-app

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).
