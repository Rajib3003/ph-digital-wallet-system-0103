"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isActived = exports.Role = void 0;
var Role;
(function (Role) {
    Role["SUPER_ADMIN"] = "SUPER_ADMIN";
    Role["ADMIN"] = "ADMIN";
    Role["USER"] = "USER";
    Role["AGENT"] = "AGENT";
})(Role || (exports.Role = Role = {}));
var isActived;
(function (isActived) {
    isActived["ACTIVE"] = "ACTIVE";
    isActived["INACTIVE"] = "INACTIVE";
    isActived["BLOCKED"] = "BLOCKED";
})(isActived || (exports.isActived = isActived = {}));
