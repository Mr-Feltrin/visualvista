class MongoError extends Error {
    constructor(message, status = undefined) {
        super(message);
        this.name = this.constructor.name;
        this.status = status;
      }
}

module.exports = MongoError;