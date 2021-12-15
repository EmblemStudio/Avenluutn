"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestType = exports.ResultType = exports.Success = exports.Label = void 0;
var Label;
(function (Label) {
    Label["adventurerName"] = "adventurerName";
    Label["guildName"] = "guildName";
    Label["questType"] = "questType";
    Label["adjective"] = "adjective";
    Label["object"] = "object";
    Label["questObjective"] = "questObjective";
    Label["locationName"] = "locationName";
    Label["locationType"] = "locationType";
    Label["obstacleName"] = "obstacleName";
    Label["obstacleDiscovery"] = "obstacleDiscovery";
    Label["obstacleAddition"] = "obstacleAddition";
    Label["outcomeActivity"] = "outcomeActivity";
    Label["outcomeResolver"] = "outcomeResolver";
    Label["resultAdverb"] = "resultAdverb";
    Label["injuryName"] = "injuryName";
    Label["knockoutName"] = "knockoutName";
    Label["deathName"] = "deathName";
    Label["lootName"] = "lootName";
    Label["skillName"] = "skillName";
    Label["traitName"] = "traitName";
    Label["conjunctive"] = "conjunctive";
})(Label = exports.Label || (exports.Label = {}));
var Success;
(function (Success) {
    Success[Success["failure"] = 0] = "failure";
    Success[Success["mixed"] = 1] = "mixed";
    Success[Success["success"] = 2] = "success";
})(Success = exports.Success || (exports.Success = {}));
// TODO add a "TREASURE" type?
var ResultType;
(function (ResultType) {
    ResultType["Injury"] = "INJURY";
    ResultType["Knockout"] = "KNOCKOUT";
    ResultType["Death"] = "DEATH";
    ResultType["Loot"] = "LOOT";
    ResultType["Skill"] = "SKILL";
    ResultType["Trait"] = "TRAIT";
})(ResultType = exports.ResultType || (exports.ResultType = {}));
var QuestType;
(function (QuestType) {
    QuestType["defeat"] = "DEFEAT";
    QuestType["explore"] = "EXPLORE";
    QuestType["retrieve"] = "RETRIEVE";
    QuestType["defend"] = "DEFEND";
    QuestType["befriend"] = "BEFRIEND";
})(QuestType = exports.QuestType || (exports.QuestType = {}));
