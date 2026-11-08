// site.json 내용을 관리자 페이지(public/admin.html)용 config.js로 복사합니다. 자동 실행되니 건드리지 마세요.
const s = require("../site.json");
require("fs").writeFileSync("public/config.js", "window.SITE = " + JSON.stringify(s, null, 2) + ";\n");
