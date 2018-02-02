# MongooseScraper

Overview
In this assignment, you'll create a web app that lets users view and leave comments on the latest news. But you're not going to actually write any articles; instead, you'll flex your Mongoose and Cheerio muscles to scrape news from another site.

Create a GitHub repo for this assignment and clone it to your computer. Any name will do -- just make sure it's related to this project in some fashion.

Run npm init. When that's finished, install and save these npm packages:

express

express-handlebars

mongoose

body-parser

cheerio

request

NOTE: If you want to earn complete credit for your work, you must use all six of these packages in your assignment.

In order to deploy your project to Heroku, you must set up an mLab provision. mLab is remote MongoDB database that Heroku supports natively. Follow these steps to get it running:

Create a Heroku app in your project directory.

Run this command in your Terminal/Bash window:


Instructions
Create an app that accomplishes the following:
Whenever a user visits your site, the app should scrape stories from a news outlet of your choice and display them for the user. Each scraped article should be saved to your application database. At a minimum, the app should scrape and display the following information for each article:
 * Headline - the title of the article

 * Summary - a short summary of the article

 * URL - the url to the original article

 * Feel free to add more content to your database (photos, bylines, and so on).
Users should also be able to leave comments on the articles displayed and revisit them later. The comments should be saved to the database as well and associated with their articles. Users should also be able to delete comments left on articles. All stored comments should be visible to every user.
Beyond these requirements, be creative and have fun with this!
