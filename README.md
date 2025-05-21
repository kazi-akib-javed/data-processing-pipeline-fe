## Description
This is a self developed project to visualize the stream and batch processing by building a website's page view analytics. It actually streams the pageview counts in redis and delivers it to UI instantly. Then it also perform a cronjob at midnight for stroing the whole batch of the day in the database.

## Motivation
After my big data course in MSc in Germany I found data processing pipeline very interesting so I build a small project to visualize the stream and batch processing.

## Technology
#Backend
 - Nestjs
 - Redis
 - Websocket
 - Postgresql

#Frontend
 - React
 - Socket
 - HTML
 - CSS
## Installation
Please follow the two folder's readme.md.
## Contact
Please contact akib6074@gmail.com for any issue and feedback.