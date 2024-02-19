async function setupSoftDelete(schema) {
    schema.pre("find", function () {
        this.where({ isDeleted: false });
    });
    schema.pre("findOne", function () {
        this.where({ isDeleted: false });
    });
    schema.pre("findById", function () {
        this.where({ isDeleted: false });
    });
}

export {setupSoftDelete}