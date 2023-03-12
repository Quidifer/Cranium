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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20230220054625 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20230220054625 extends migrations_1.Migration {
    up() {
        return __awaiter(this, void 0, void 0, function* () {
            this.addSql('create table "user_session" ("id" varchar(255) not null, "created_at" timestamptz(6) not null, "updated_at" timestamptz(6) not null, "username" varchar(255) not null, constraint "user_session_pkey" primary key ("id"));');
        });
    }
}
exports.Migration20230220054625 = Migration20230220054625;
//# sourceMappingURL=Migration20230220054625.js.map