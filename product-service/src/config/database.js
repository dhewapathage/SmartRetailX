const getMongoConnection = (defaultDbName) => {
    // Local Docker / development
    if (process.env.MONGODB_URI) {
        return [
            process.env.MONGODB_URI,
            {}
        ];
    }
    // AWS DocumentDB
    const {
        DB_HOST,
        DB_USERNAME,
        DB_PASSWORD
    } = process.env;
    if (!DB_HOST || !DB_USERNAME || !DB_PASSWORD) {
        throw new Error(
            "Database configuration is incomplete"
        );
    }
    const dbName =
        process.env.DB_NAME || defaultDbName;
    const username =
        encodeURIComponent(DB_USERNAME);
    const password =
        encodeURIComponent(DB_PASSWORD);
    const uri =
    `mongodb://${username}:${password}@${DB_HOST}:27017/${dbName}` +
    `?authSource=admin` +
    `&authMechanism=SCRAM-SHA-1` +
    `&replicaSet=rs0` +
    `&readPreference=secondaryPreferred` +
    `&retryWrites=false`;
    return [
        uri,
        {
            tls: true,
            tlsCAFile:
                "/app/certs/global-bundle.pem"
        }
    ];
};
module.exports = {
    getMongoConnection
};
