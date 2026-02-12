# Toy Robot Simulator V2

# Contents
[Architecture Choices](#architecture-choices)

[Project Flow](#project-flow)

[Testing](#testing)

[Assumptions and Decisions](#assumptions-made-at-points-of-uncertainty-where-i-couldnt-do-further-requirements-gathering)

[How to Set up and Run this Project](#how-to-set-up-and-this-project)

# Architecture Choices
  
  link to the API.md file

# Project Flow

  decsribe the system components so it's easy to prepare to see what it's doing

# Testing

- MENTION THAT THE UNIT TESTS ARE JUST HAPPY PATH
- YOU WOULD NORMALLY THINK ABOUT (AND DO SEARCHES TO CHECK) 
  WHAT A GOOD SET OF EDGE CASES WOULD BE FOR IT, 
  IN ORDER TO BE SURE THAT HAPPY PATH, 
  ERROR AND FAILURE STATES, MALFORMED INPUTS 
  AND ANY OTHER LIKELY PROBLEM IS COVERED WITH A TEST
  BEFORE IT CAN BE CONSIDERED A READY-TO-SHIP DELIVERABLE


# Assumptions made at points of uncertainty where I couldn't do further requirements gathering
 
   document my decisions about each
	

### mention somewhere that the grid size is customizeable by setting CSS custom properties

  - currently it has to be set BOTH in custom-properties.css and in the app.vue file for it to work


### include notes about things out of scope if helpful to show that they were thought about and not included, like how auth wasn't implemented on purpose
 


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


