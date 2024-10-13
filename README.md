# Awesome Weather App
![License](https://img.shields.io/badge/License-MIT-blue.svg)

## Description
This project builds the server side code to call the OpenWeather APIs, to display current weather and forecast weather on a web page. To complete this we leveraged teh GeoCoder API along with weather and forecast APIs. 

## Table of Contents
  * [Installation](#installation)
  * [Usage](#usage)
  * [License](#license)
  * [Contributing](#contributing)
  * [Tests](#tests)
  * [Questions](#questions)

## Installation
Pull down the project from the repository, and run the the following command: 

```bash
npm install
```
The server has been deployed using Render. Instructions to deploy can be found here:
[Render Deployment](https://coding-boot-camp.github.io/full-stack/render/render-deployment-guide)

## Usage
Run the following command to execute the application:

```bash
npm start
``` 
The user is presented with a web page where they can serach for a city's weather by using the text input box. Upon finding a valid city, the user will see the current weather of the city along with a 5-day forecast. Prior searches are saved to the history panel on the webpage. A user can delete the history, by clikcing on the trash can button aside the city's name.

[Demo Video](https://drive.google.com/file/d/1TGrcPeS_7qUHakzECjjc6JdDeJq1weqo/view)

## License
This project is licensed under the [MIT](https://choosealicense.com/licenses/mit) License.

## Contributing
You can contrbute to the poject by creating issues in the project's repository in GitHub for any bugs. You may make pull requests for any new features that will enhance the project's functionality.

## Tests
1. Search for a city
    * The weather for the city should return
    * You should see a 5-day forecast
    * The city is saved in the historical panel
2. Delete a city from the Historical City data
    * Clicking on the red trashcan button should delete the city from the history panel

## Questions
If you have any questions, please reach out to me a me@email.com. You can also visit my GitHub profile at https://github.com/wchutchinson.