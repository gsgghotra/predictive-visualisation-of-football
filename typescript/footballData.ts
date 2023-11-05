//Axios will handle HTTP requests to web service
import axios from 'axios';

//Reads keys from .env file
import * as dotenv from 'dotenv'

// list of libraries
//Copy variables in file into environment variables
dotenv.config();
console.log("Until you get this: " + process.env.HELLO);

// Seasons Details
let numSeasons = 1; // No of seasons can be increased here. Set to 0 because of limited request per minute. (Free Account)
let seasons = ["?dateFrom=2004-08-28&dateTo=2005-05-29",
    "?dateFrom=2005-08-27&dateTo=2006-05-20",
    "?dateFrom=2006-08-27&dateTo=2007-06-17",
    "?dateFrom=2007-08-25&dateTo=2008-05-18",
    "?dateFrom=2008-08-30&dateTo=2009-05-31",
    "?dateFrom=2009-08-29&dateTo=2010-05-16",
    "?dateFrom=2010-08-28&dateTo=2011-05-21",
    "?dateFrom=2011-08-27&dateTo=2012-05-13",
    "?dateFrom=2012-08-18&dateTo=2013-06-01",
    "?dateFrom=2013-08-17&dateTo=2014-05-18",
    "?dateFrom=2014-08-24&dateTo=2015-05-24",
    "?dateFrom=2015-08-21&dateTo=2016-05-15",
    "?dateFrom=2016-08-21&dateTo=2017-05-21",
    "?dateFrom=2017-08-18&dateTo=2018-05-20",
    "?dateFrom=2018-07-01&dateTo=2019-05-31",
    "?dateFrom=2019-07-15&dateTo=2020-07-19",
    "?dateFrom=2020-09-12&dateTo=2021-04-01"];





//Class that wraps fixer.io web service
export class Fixer {
    //Base URL of fixer.io API
    baseURL: string = "https://api.football-data.org/v2/";

    // Setting header
    //Returns a Promise that will get the results according to seasons
    getMatchResults(season): Promise<object> {
        //axios.defaults.headers.common['X-Auth-Token'] = process.env.FOOTBALL_API_KEY // for all requests
        return axios.get(this.baseURL + 'teams/86/matches/' + season + '&status=FINISHED&limit180', {
            headers: {
                'X-Auth-Token': process.env.FOOTBALL_API_KEY
            }
        })

    }
}
//Call function to get historical data

//exports.handler = function(event, context, callback) {
//Gets the historical data for a range of dates.
    async function getHistoricalMatches() {
        /* You should check that the start date plus the number of days is
        less than the current date*/

        //Create instance of Fixer.io class
        let fixerIo: Fixer = new Fixer();

        //Array to hold promises
        let promiseArray: Array<Promise<object>> = [];

        //Work forward from start date
        for (let i: number = 0; i < numSeasons; ++i) {
            promiseArray.push(fixerIo.getMatchResults(seasons[i]));
            //increase seasons numbers
        }

        try {
            let resultArray: Array<object> = await Promise.all(promiseArray);

            //Output the data
            resultArray.forEach((result) => {


                //console.log(result);
                //data contains the body of the web service response

                let data = result['data'];

                let datalength = data.matches.length;
                for (let i = 0; i < datalength; i++) {

                    let newI = i;
                    let homeTeamName = data.matches[i].homeTeam["name"];
                    let awayTeamName = data.matches[i].awayTeam["name"];
                    let matchDate = data.matches[i].utcDate.substring(0, 10);

                    // Allow only league games
                    if (data.matches[i].competition["name"] != "Primera Division"){

                    } else {
                        //console.log(data.matches[i].matchday + " , " + data.matches[i].homeTeam["id"] +" , "+ " = " + data.matches[i].competition["name"] + "    > " + matchDate + " *** " + homeTeamName + " -- " + awayTeamName);
                        //Table name and data for table
                        let params = {
                            TableName: "teams",
                            Item: {
                                id: data.matches[i].homeTeam["id"],
                                name: data.matches[i].homeTeam["name"]
                            }
                        };

                        let params_match = {
                            TableName: "Match",
                            Item: {
                                match_id: data.matches[i].id,
                                hometeam_id:data.matches[i].homeTeam["id"],
                                hometeam_score:data.matches[i].score.fullTime["homeTeam"],
                                awayteam_id:data.matches[i].awayTeam["id"],
                                awayteam_score:data.matches[i].score.fullTime["awayTeam"],
                                match_date:matchDate,
                                matchday:data.matches[i].matchday
                            }
                        }
                        //Insert into Database teams
                        //Store data in DynamoDB and handle errors
                    }
                        //console.log(homeTeamName);

                }
            });

        } catch (error) {
            console.log("Error: " + JSON.stringify(error));
        }
    }


//Call function to get historical data
    getHistoricalMatches();
//}