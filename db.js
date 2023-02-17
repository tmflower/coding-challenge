const { Client } = require("pg");

function getDatabaseUri() {
    return (process.env.NODE_ENV === "test")
    ? "coding_challenge_test"
    : process.env.DATABASE_URL || "coding_challenge";
}

let db = new Client({
    connectionString: getDatabaseUri()
});

db.connect();

module.exports = db;