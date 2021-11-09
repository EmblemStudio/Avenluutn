"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestType = exports.ResultType = exports.Success = exports.ObstacleType = void 0;
// They [verb] [adjectives] [type] [name] [additions]
// They [stumbled upon] a [man-eating] [puzzlebox] [, "The Most Stark Horcrux",] which was [instilled with a dragon's spirit]. 
// adjectives and additions are connected to relevant skills / traits?
var ObstacleType;
(function (ObstacleType) {
    ObstacleType["puzzle"] = "PUZZLE";
    ObstacleType["obstacle"] = "OBSTACLE";
    ObstacleType["entity"] = "ENTITY";
})(ObstacleType = exports.ObstacleType || (exports.ObstacleType = {}));
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
