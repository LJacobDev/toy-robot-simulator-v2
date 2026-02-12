# Toy Robot Simulator V2

# Contents
[Architecture](#architecture-choices)

[Project Flow](#project-flow)

[Testing](#testing)

[Assumptions and Decisions](#assumptions-and-decisions)

[How to Set up and Run this Project](#how-to-set-up-and-this-project)

# Architecture

This project uses NestJS as the backend framework, SQlite as the database, and VueJS as the frontend framework.

# Project Flow

The Nest backend makes available an API endpoint at  `/api/positions` that the frontend app uses to find all historical positions and recover its last known state, as well as to save new position history in the database.

An additional action is accessible to delete all positions and clear out the history.  The simulator doesn't activate it, but `curl` can be used to access it to clear data during testing of the app.

See the API specification [here](/docs/api.md).

The frontend runs as a single page application that is served as static assets by Nest out of `/backend/public`.

The app consists of a main `App.vue` that is responsible for templates and importing Vue composables that give it the state and logic needed to initialize and run the simulator.

The frontend app was not refactored into sub components because its scope was such that the App.vue file is able to be easily understood and maintained in one file over splitting it up.

The main app needs to know nothing about the backend, as it deals with the usePositions composable that handles API calls for it.

Files are set up to favour separating responsibilities of each file, such as having `usePositions.ts` for database and API interaction and `useGame.ts` for game setup and execution logic.  Styles are handled entirely in dedicated css files where the styles follow a flow similar to the visual layout of the UI to keep it easy to navigate and work with. Intention was put into setting up class hooks so that JS and CSS didn't have to have mixed and hard-to-maintain knowledge about each other. They rely on class list hooks to co-ordinate appearances for each state, which also allows easier swapping out and changing of appearances later.

# Testing

There are unit tests and an e2e test on the backend, and there are some unit tests on the front end.  See below, or click [here for frontend](#run-tests-optional) and [here for backend](#run-tests-optional-1) for the commands to run them

The unit tests on the backend use a SQlite instance in RAM instead of a database mock, so the positions service is able to test against a real database.  It currently has a basic set of tests to ensure that it is able to function normally when given optimal inputs.

There is an e2e test on the Nest application that runs a cycle of its API endpoints to verify that they're working.  Because the positions controller does nothing more than to pass on execution to the positions service, no unit tests were created and the e2e test serves as indication that they are functioning.

Comments have been added into some of the spec files across the back end and front end to indicate other tests that I'd like to add.

There is generally a minimum level of test coverage and monitoring availability neededed before a feature or deliverable would be considered ready to ship.

Whever not specified in these spec files, in general my testing preferences for a deliverable to be reliable is to have the happy path covered, and then to have deliberately thought of edge cases in input, potential malformed input, potential hostile inputs, error states and failure states, and protecting against regressions.  These can vary by situation, but these are the general patterns.

# Assumptions and Decisions

There were a few minor ambiguities that seemed to have sensible default choices, but which were noticeable did require choices to be made.

I wasn't able to do additional requirements gathering, so here is a series of places where I found uncertainties and what I decided to do with them:

1. One instruction said that clicking a new tile while the robot is already on one, would move the **original robot** to that position.  Another instruction later on says that clicking to place the robot on a new tile should **delete the old one from the UI**.

I took that to mean that clicking a tile should move the existing robot instance without leaving behind a duplicate UI visual of it that hasn't been cleaned up or deleted from view.  It will have the same UX with no apparent downsides.

But this note is being made to indicate that in case the designer preferred that the robot truly is deleted and reinstantiated on tile clicks.

2. It was unclear whether the `Report` section on the UI was meant to be a button that when clicked shows another view that reports the current position, or whether it was meant to always show the current position as its text contents.

I made the assumption that the UX would be better to have it always shown, so that the area says "Report" when the robot is not on the board and then shows their position as "0, 0, North" when they are on the board.






document my decisions about each point of uncertainty where I couldn't do further requirements gathering
	

- mention somewhere that the grid size is customizeable by setting CSS custom properties

- currently it has to be set BOTH in custom-properties.css and in the app.vue file for it to work


- include notes about things out of scope if helpful to show that they were thought about and not included, like how auth wasn't implemented on purpose
 


# How to Set up and this Project

## Step 1 - VueJS Frontend Setup

### Change to `frontend` directory

``` bash
# change to frontend folder
$ cd frontend          # (from project root)

# install dependencies
$ npm install
```

### Compile frontend as static assets

```bash
$ npm run build
```
Build artifacts will be placed automatically in `/backend/public`, where the NestJS server will serve them as static assets.

### Run tests (optional)

```bash
$ npm run test:unit
```

## Step 2 - NestJS Backend Setup

### Change to `backend` directory

``` bash
# change to backend folder
$ cd ../backend       # (from frontend)
-or-
$ cd backend          # (from project root)

# install dependencies
$ npm install
```

### Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Run tests (optional)

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Step 3 - Point Browser to NestJS Server

Open a browser to localhost:3000 to use the playable app

Clicking the buttons shown will **turn left**, **turn right**, and **move** the robot forward.

The keyboard arrow keys also work in this way:

Left arrow -> Turn left

Right arrow -> Turn right

Up/Down arrow -> Move forward

![alt text](image-1.png)

Please enjoy!
