"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentStatesEnum = exports.ADMIN_PASSWORD = exports.PROBLEM_END_TIME = void 0;
exports.PROBLEM_END_TIME = 15;
exports.ADMIN_PASSWORD = "adminhu";
var currentStatesEnum;
(function (currentStatesEnum) {
    currentStatesEnum["Invalid"] = "Invalid_RoomId";
    currentStatesEnum["Leaderboard"] = "leaderboard";
    currentStatesEnum["Question"] = "question";
    currentStatesEnum["Not_Started"] = "not_started";
    currentStatesEnum["Ended"] = "ended";
})(currentStatesEnum || (exports.currentStatesEnum = currentStatesEnum = {}));
