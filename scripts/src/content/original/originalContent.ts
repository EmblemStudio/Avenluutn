import * as activityAdjectivesJson from "../../../csv-to-json/json/activityAdjectives.json"
import * as genericFirstAdjectivesJson from "../../../csv-to-json/json/genericFirstAdjectives.json"
import * as genericFirstNameJson from "../../../csv-to-json/json/genericFirstName.json"
import * as genericLastNameJson from "../../../csv-to-json/json/genericLastName.json"
import * as genericSecondAdjectivesJson from "../../../csv-to-json/json/genericSecondAdjectives.json"
import * as guildLocationsJson from "../../../csv-to-json/json/guildLocations.json"
import * as guildMottosJson from "../../../csv-to-json/json/guildMottos.json"
import * as guildNamesJson from "../../../csv-to-json/json/guildNames.json"
import * as injuriesJson from "../../../csv-to-json/json/injuries.json"
import * as numberOfResultsOddsJson from "../../../csv-to-json/json/numberOfResultsOdds.json"
import * as obstacleActivitiesJson from "../../../csv-to-json/json/obstacleActivities.json"
import * as obstacleArrivalsJson from "../../../csv-to-json/json/obstacleArrivals.json"
import * as obstacleDiscoveriesJson from "../../../csv-to-json/json/obstacleDiscoveries.json"
import * as obstacleNegativeResolversJson from "../../../csv-to-json/json/obstacleNegativeResolvers.json"
import * as obstaclePositiveResolversJson from "../../../csv-to-json/json/obstaclePositiveResolvers.json"
import * as obstacleObjectsJson from "../../../csv-to-json/json/obstacleObjects.json"
import * as ObstacleTypeJson from "../../../csv-to-json/json/ObstacleType.json"
import * as pronounsSourceJson from "../../../csv-to-json/json/pronounsSource.json"
import * as questActivitiesJson from "../../../csv-to-json/json/questActivities.json"
import * as questDifficultyJson from "../../../csv-to-json/json/questDifficulty.json"
import * as questLocationNameJson from "../../../csv-to-json/json/questLocationName.json"
import * as questLocationTypeJson from "../../../csv-to-json/json/questLocationType.json"
import * as questPositiveResolversJson from "../../../csv-to-json/json/questPositiveResolvers.json"
import * as questNegativeResolversJson from "../../../csv-to-json/json/questNegativeResolvers.json"
import * as questObjectivesJson from "../../../csv-to-json/json/questObjectives.json"
import * as questObstacleMapJson from "../../../csv-to-json/json/questObstacleMap.json"
import * as QuestTypeJson from "../../../csv-to-json/json/QuestType.json"
import * as ResultTypeJson from "../../../csv-to-json/json/ResultType.json"
import * as skillsJson from "../../../csv-to-json/json/skills.json"
import * as successOddsJson from "../../../csv-to-json/json/successOdds.json"
import * as SuccessTypeJson from "../../../csv-to-json/json/SuccessType.json"
import * as traitsJson from "../../../csv-to-json/json/traits.json"
import * as triggerMapJson from "../../../csv-to-json/json/triggerMap.json"
import * as typeOfResultOddsJson from "../../../csv-to-json/json/typeOfResultOdds.json"

import { TriggerInfo, Pronouns } from '../../utils'

export const activityAdjectives: { [successType: string]: { text: string }[] } = activityAdjectivesJson
export const genericFirstAdjectives = genericFirstAdjectivesJson
export const genericFirstName = genericFirstNameJson
export const genericLastName = genericLastNameJson
export const genericSecondAdjectives = genericSecondAdjectivesJson
export const guildLocations = guildLocationsJson
export const guildMottos = guildMottosJson
export const guildNames = guildNamesJson
export const injuries: { [text: string]: { trait: string }[] } = injuriesJson
export const numberOfResultsOdds: { [difficulty: number]: { [count: number]: number }[] } =
  // cast "0" (string) into 0 (number)
  JSON.parse(JSON.stringify(numberOfResultsOddsJson))
export const obstacleActivities: { [obsType: string]: { activity: string }[] } = obstacleActivitiesJson
export const obstacleArrivals = obstacleArrivalsJson
export const obstacleDiscoveries: { [obsType: string]: { discovery: string }[] } = obstacleDiscoveriesJson
export const obstacleNegativeResolvers: { [obsType: string]: { negativeResolver: string }[] } = obstacleNegativeResolversJson
export const obstaclePositiveResolvers: { [obsType: string]: { positiveResolver: string }[] } = obstaclePositiveResolversJson
export const obstacleObjects: { [obsType: string]: { object: string }[] } = obstacleObjectsJson
export const ObstacleType = ObstacleTypeJson
export const pronounsSource: { [key: number]: Pronouns[] } =
  JSON.parse(JSON.stringify(pronounsSourceJson))
export const questActivities: { [questType: string]: { activity: string }[] } = questActivitiesJson
export const questDifficulty: number[] =
  JSON.parse(JSON.stringify(questDifficultyJson))
export const questLocationName = questLocationNameJson
export const questLocationType = Object.keys(questLocationTypeJson)
export const questPositiveResolvers: { [questType: string]: { positiveResolver: string }[] } = questPositiveResolversJson
export const questNegativeResolvers: { [questType: string]: { negativeResolver: string }[] } = questNegativeResolversJson
export const questObjectives: { [questType: string]: { objective: string }[] } = questObjectivesJson
export const questObstacleMap: { [questType: string]: { obstacleType: string }[] } = questObstacleMapJson
export const QuestType = QuestTypeJson
export const ResultType = ResultTypeJson
export const skills = skillsJson
export const successOdds: {
  [difficulty: number]: {
    Failure: string;
    Mixed: string;
    Success: string;
  }[]
} = JSON.parse(JSON.stringify(successOddsJson))
export const SuccessType = SuccessTypeJson
export const traits: { [text: string]: { positiveTrigger: string, negativeTrigger: string }[] } = traitsJson
export const triggerMap: { [keystring: string]: TriggerInfo[] } =
  JSON.parse(JSON.stringify(triggerMapJson))
export const typeOfResultOdds: { [successType: string]: { [resultType: string]: number }[] } =
  JSON.parse(JSON.stringify(typeOfResultOddsJson))