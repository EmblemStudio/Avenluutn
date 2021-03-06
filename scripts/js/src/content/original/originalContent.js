"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOfResultOdds = exports.triggerMap = exports.traits = exports.SuccessType = exports.successOdds = exports.skills = exports.ResultType = exports.QuestType = exports.questObstacleMap = exports.questObjectives = exports.questNegativeResolvers = exports.questPositiveResolvers = exports.questLocationType = exports.questLocationName = exports.questDifficulty = exports.questActivities = exports.pronounsSource = exports.ObstacleType = exports.obstacleObjects = exports.obstaclePositiveResolvers = exports.obstacleNegativeResolvers = exports.obstacleDiscoveries = exports.obstacleArrivals = exports.obstacleActivities = exports.numberOfResultsOdds = exports.injuries = exports.guildNames = exports.guildMottos = exports.guildLocations = exports.genericSecondAdjectives = exports.genericLastName = exports.genericFirstName = exports.genericFirstAdjectives = exports.activityAdjectives = void 0;
const activityAdjectivesJson = require("../../../csv-to-json/json/activityAdjectives.json");
const genericFirstAdjectivesJson = require("../../../csv-to-json/json/genericFirstAdjectives.json");
const genericFirstNameJson = require("../../../csv-to-json/json/genericFirstName.json");
const genericLastNameJson = require("../../../csv-to-json/json/genericLastName.json");
const genericSecondAdjectivesJson = require("../../../csv-to-json/json/genericSecondAdjectives.json");
const guildLocationsJson = require("../../../csv-to-json/json/guildLocations.json");
const guildMottosJson = require("../../../csv-to-json/json/guildMottos.json");
const guildNamesJson = require("../../../csv-to-json/json/guildNames.json");
const injuriesJson = require("../../../csv-to-json/json/injuries.json");
const numberOfResultsOddsJson = require("../../../csv-to-json/json/numberOfResultsOdds.json");
const obstacleActivitiesJson = require("../../../csv-to-json/json/obstacleActivities.json");
const obstacleArrivalsJson = require("../../../csv-to-json/json/obstacleArrivals.json");
const obstacleDiscoveriesJson = require("../../../csv-to-json/json/obstacleDiscoveries.json");
const obstacleNegativeResolversJson = require("../../../csv-to-json/json/obstacleNegativeResolvers.json");
const obstaclePositiveResolversJson = require("../../../csv-to-json/json/obstaclePositiveResolvers.json");
const obstacleObjectsJson = require("../../../csv-to-json/json/obstacleObjects.json");
const ObstacleTypeJson = require("../../../csv-to-json/json/ObstacleType.json");
const pronounsSourceJson = require("../../../csv-to-json/json/pronounsSource.json");
const questActivitiesJson = require("../../../csv-to-json/json/questActivities.json");
const questDifficultyJson = require("../../../csv-to-json/json/questDifficulty.json");
const questLocationNameJson = require("../../../csv-to-json/json/questLocationName.json");
const questLocationTypeJson = require("../../../csv-to-json/json/questLocationType.json");
const questPositiveResolversJson = require("../../../csv-to-json/json/questPositiveResolvers.json");
const questNegativeResolversJson = require("../../../csv-to-json/json/questNegativeResolvers.json");
const questObjectivesJson = require("../../../csv-to-json/json/questObjectives.json");
const questObstacleMapJson = require("../../../csv-to-json/json/questObstacleMap.json");
const QuestTypeJson = require("../../../csv-to-json/json/QuestType.json");
const ResultTypeJson = require("../../../csv-to-json/json/ResultType.json");
const skillsJson = require("../../../csv-to-json/json/skills.json");
const successOddsJson = require("../../../csv-to-json/json/successOdds.json");
const SuccessTypeJson = require("../../../csv-to-json/json/SuccessType.json");
const traitsJson = require("../../../csv-to-json/json/traits.json");
const triggerMapJson = require("../../../csv-to-json/json/triggerMap.json");
const typeOfResultOddsJson = require("../../../csv-to-json/json/typeOfResultOdds.json");
exports.activityAdjectives = activityAdjectivesJson;
exports.genericFirstAdjectives = genericFirstAdjectivesJson;
exports.genericFirstName = genericFirstNameJson;
exports.genericLastName = genericLastNameJson;
exports.genericSecondAdjectives = genericSecondAdjectivesJson;
exports.guildLocations = guildLocationsJson;
exports.guildMottos = guildMottosJson;
exports.guildNames = guildNamesJson;
exports.injuries = injuriesJson;
exports.numberOfResultsOdds = 
// cast "0" (string) into 0 (number)
JSON.parse(JSON.stringify(numberOfResultsOddsJson));
exports.obstacleActivities = obstacleActivitiesJson;
exports.obstacleArrivals = obstacleArrivalsJson;
exports.obstacleDiscoveries = obstacleDiscoveriesJson;
exports.obstacleNegativeResolvers = obstacleNegativeResolversJson;
exports.obstaclePositiveResolvers = obstaclePositiveResolversJson;
exports.obstacleObjects = obstacleObjectsJson;
exports.ObstacleType = ObstacleTypeJson;
exports.pronounsSource = JSON.parse(JSON.stringify(pronounsSourceJson));
exports.questActivities = questActivitiesJson;
exports.questDifficulty = JSON.parse(JSON.stringify(questDifficultyJson));
exports.questLocationName = questLocationNameJson;
exports.questLocationType = Object.keys(questLocationTypeJson);
exports.questPositiveResolvers = questPositiveResolversJson;
exports.questNegativeResolvers = questNegativeResolversJson;
exports.questObjectives = questObjectivesJson;
exports.questObstacleMap = questObstacleMapJson;
exports.QuestType = QuestTypeJson;
exports.ResultType = ResultTypeJson;
exports.skills = skillsJson;
exports.successOdds = JSON.parse(JSON.stringify(successOddsJson));
exports.SuccessType = SuccessTypeJson;
exports.traits = traitsJson;
exports.triggerMap = JSON.parse(JSON.stringify(triggerMapJson));
exports.typeOfResultOdds = JSON.parse(JSON.stringify(typeOfResultOddsJson));
