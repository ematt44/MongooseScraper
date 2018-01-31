var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs  = require('express-handlebars');
var cheerio  = require('cheerio');
var axios = require("axios");
var request = require("request");