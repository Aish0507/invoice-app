function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: true
    });
}
define("HOSTNAME", 'localhost');
define("PORT", '3000');
define("PAGE_LIMIT", '50');
define("PAGE_NO", '1');