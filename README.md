#Overview

I set up a Docker environment with Django rest framework on the backend and React frontend, with Celery handling task management.

I have detailed the project in some screencasts:

[Project 1: Overview] (https://youtu.be/q5QqngqLn_4)
[Project 2: Backend] (https://youtu.be/rv6EZx2IJwQ)
[Project 3: Frontend] (https://youtu.be/sNMrAcYciM4)

The code has been committed here:

The project took 3-4 days (including time to document and record the videos).

Unfortunately I ran out of time before I could finish the React part of the project, please view this code as ‘work in progress’ (details in the videos). However, the Django / Celery backend is working very well.

#Spec

We are a community management company.
We have several users and several clients.
We need a webplatform to setup automatic tweeting.
Each user wants to:
- be able to save tweet templates
- plan new tweets to be tweeted with the account of a client at
  a specific time
- having recurring tweets
- see statistics of their previous tweets for each client

Technology required:
- React for the web interface
- a database (MySQL preferred)
- using the official Twitter API
- anything else up to your discretion
