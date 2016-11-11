# tastigator

## Synopsis

This is an application that helps users choose where to eat. The application is built based on the following requirements - 

As a staff/(guide in this case), I can create restaurants, with their information such as address. The application gecodes the address into a set a Lat/Log for map apperance

As an user, I can browse through restaurants. I can mark newly added restaurants as visited. I can thumb down on restaurants. I can post reviews only for visisted restaurants. And I can write feedback/comments on reviews.

As an user, I can edit/add information for my account. I can add a profile picture.

As an user, I can access a dashboard where I can ingest summary level information.

## Motivation

The project was built deadline of 7 days from the starting date. The main focus of the application is backend driven. Therefore, I adopted a rest API framework to handle the backend. The technology stack I chose is python (3.5.2)/Django (1.10) as the backend.

A list of third party python libraries I used are listed in the requirements.txt file. The most intesively used libraries are django rest frameworks and django swagger. Django rest frameworks was used as the basis for the backend development. And django swagger is used for documentation. For front end, I used reactjs along with webpack as the automation tool. 

## Installation

To install this project, please follow these steps - 

Prequisite - Please use Python version 3.5.2 and have a google api key for geocoding

1. Clone this repo - git clone https://github.com/wtchang92/tastigator.git
2. Navgiate to the cloned repo - setup and activate a virtualenv (https://virtualenv.pypa.io/en/stable/)
3. Run: pip install -r requirements.txt
4. Create a file named, "api_keys.py", in restaurant app folder at restaurants/. Placed the following snippet in this file and save
	google_api_key = "Your google api key" #please make sure it's enabled
5. (Optional) Delete the existing db.sqlite3 file.
6. Run: python manage.py createsuperuser and follow the prompt
7. Run: python manage.py runserver
8. From here on, you may access the following (please note 127.0.0.1:8000 may be different for you):<br />
	App (The client application) - 127.0.0.1:8000/app<br />
	API docs (stylized API guide: please login to view all the routes and note that it is permission driven)- 127.0.0.1:8000/docs<br />
	DRF Browseable API (default DRF api browseable API)- 127.0.0.1:8000/api<br />
	Admin page (Use this for administrative tasks, such as granting "guide" permission) - 127.0.0.1:8000/admin (access it with the super user account)<br />

Use cases - 
	Since only a user who is a "guide" can create restaurant, this user status can be granted by a staff/superuser. To do so, please login as a staff or a super user using the admin page. And under the foodies section, choose the user you want to grant "guide" status and check in the checkbox for "Is guide" then hit save. Once the user has been granted as a "guide", the user can create restaurants, as you can see in 127.0.0.1:8000/app/restaurants.

## API Reference

The API is very "permission" driven. Permissions can be viewed in each app's permission.py file. All delete requests have been disabled. Deletions can only be carried out from the admin page or from a python shell. 

## Tests

Tests can be run using the command, python manage.py test. Tests have been written for the restaurants and foodies apps. Due to time contrainst, tests will be written for the poll test in the future.

## Next Steps

Make error messages look prettier and more modern
Write more tests for each of the use cases
Enable API throttles - to prevent against abuse
