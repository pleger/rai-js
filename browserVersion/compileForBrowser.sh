#!/bin/zsh

#You need browserfy to get YOUR last version of RAI
browserify -r ../loader.js:raijs | uglifyjs > raijs.js