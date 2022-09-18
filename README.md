# Reddit Content Ingestor

Deploy a docker container that will run a headless browser to help scrape Reddit content from 
customizable subreddits and download media to your local desktop.

## Getting Started

### Prerequisites

Make sure you have these installed:

* [Docker](https://www.docker.com)
* [Docker-Compose](https://docs.docker.com/compose)

NOTE: Docker Desktop for all major platforms will install Compose with your Docker install.

### Customize your experience

This app has a few subreddits to get you started. However, interests vary and there are thousands of subreddits to choose from so pick out your interests and download here.

Check this file for a list of subreddits this app will scan to pull content from:

    reddit-content-ingestor/assets/subreddits.txt

Add or remove subreddits. One subreddit per line.

### Run web service

```
docker-compose up --build
```

NOTE: Add `-d` to the command above to have the scrape and download process running in the background.

### Check the content

Check the following directory for content:

    reddit-content-ingestor/downloads