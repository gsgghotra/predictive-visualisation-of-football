"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fixer = void 0;
//Axios will handle HTTP requests to web service
var axios_1 = require("axios");
//Reads keys from .env file
var dotenv = require("dotenv");
// list of libraries
//Copy variables in file into environment variables
dotenv.config({ path: __dirname + 'env_variables/.env' });
console.log(process.env.FOOTBALL_API_KEY);
// Seasons Details
var numSeasons = 1; // No of seasons can be increased here. Set to 0 because of limited request per minute. (Free Account)
var seasons = ["?dateFrom=2004-08-28&dateTo=2005-05-29",
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
var Fixer = /** @class */ (function () {
    function Fixer() {
        //Base URL of fixer.io API
        this.baseURL = "https://api.football-data.org/v2/";
    }
    // Setting header
    //Returns a Promise that will get the results according to seasons
    Fixer.prototype.getMatchResults = function (season) {
        //axios.defaults.headers.common['X-Auth-Token'] = process.env.FOOTBALL_API_KEY // for all requests
        return axios_1.default.get(this.baseURL + 'teams/86/matches/' + season + '&status=FINISHED&limit180', {
            headers: {
                'X-Auth-Token': process.env.FOOTBALL_API_KEY
            }
        });
    };
    return Fixer;
}());
exports.Fixer = Fixer;
//Call function to get historical data
//exports.handler = function(event, context, callback) {
//Gets the historical data for a range of dates.
function getHistoricalMatches() {
    return __awaiter(this, void 0, void 0, function () {
        var fixerIo, promiseArray, i, resultArray, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fixerIo = new Fixer();
                    promiseArray = [];
                    //Work forward from start date
                    for (i = 0; i < numSeasons; ++i) {
                        promiseArray.push(fixerIo.getMatchResults(seasons[i]));
                        //increase seasons numbers
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, Promise.all(promiseArray)];
                case 2:
                    resultArray = _a.sent();
                    //Output the data
                    resultArray.forEach(function (result) {
                        //console.log(result);
                        //data contains the body of the web service response
                        var data = result['data'];
                        var datalength = data.matches.length;
                        for (var i = 0; i < datalength; i++) {
                            var newI = i;
                            var homeTeamName = data.matches[i].homeTeam["name"];
                            var awayTeamName = data.matches[i].awayTeam["name"];
                            var matchDate = data.matches[i].utcDate.substring(0, 10);
                            // Allow only league games
                            if (data.matches[i].competition["name"] != "Primera Division") {
                            }
                            else {
                                //console.log(data.matches[i].matchday + " , " + data.matches[i].homeTeam["id"] +" , "+ " = " + data.matches[i].competition["name"] + "    > " + matchDate + " *** " + homeTeamName + " -- " + awayTeamName);
                                //Table name and data for table
                                var params = {
                                    TableName: "teams",
                                    Item: {
                                        id: data.matches[i].homeTeam["id"],
                                        name: data.matches[i].homeTeam["name"]
                                    }
                                };
                                var params_match = {
                                    TableName: "Match",
                                    Item: {
                                        match_id: data.matches[i].id,
                                        hometeam_id: data.matches[i].homeTeam["id"],
                                        hometeam_score: data.matches[i].score.fullTime["homeTeam"],
                                        awayteam_id: data.matches[i].awayTeam["id"],
                                        awayteam_score: data.matches[i].score.fullTime["awayTeam"],
                                        match_date: matchDate,
                                        matchday: data.matches[i].matchday
                                    }
                                };
                                //Insert into Database teams
                                //Store data in DynamoDB and handle errors
                            }
                            console.log(homeTeamName);
                        }
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.log("Error: " + JSON.stringify(error_1));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
//Call function to get historical data
getHistoricalMatches();
//}
