const test = require("node:test");
const assert = require("node:assert/strict");
const {
    authorizeRoles
} = require("../product-service/src/middleware/roleMiddleware");
function createResponse() {
    return {
        statusCode: null,
        body: null,
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(data) {
            this.body = data;
            return this;
        }
    };
}
test("RBAC allows ADMIN user", () => {
    const req = {
        user: {
            role: "ADMIN"
        }
    };
    const res = createResponse();
    let nextCalled = false;
    authorizeRoles("ADMIN")(
        req,
        res,
        () => {
            nextCalled = true;
        }
    );
    assert.equal(nextCalled, true);
    assert.equal(res.statusCode, null);
});
test("RBAC denies CUSTOMER from ADMIN route", () => {
    const req = {
        user: {
            role: "CUSTOMER"
        }
    };
    const res = createResponse();
    let nextCalled = false;
    authorizeRoles("ADMIN")(
        req,
        res,
        () => {
            nextCalled = true;
        }
    );
    assert.equal(nextCalled, false);
    assert.equal(res.statusCode, 403);
    assert.equal(res.body.message, "Access denied");
});
test("RBAC denies request without authenticated user", () => {
    const req = {};
    const res = createResponse();
    let nextCalled = false;
    authorizeRoles("ADMIN")(
        req,
        res,
        () => {
            nextCalled = true;
        }
    );
    assert.equal(nextCalled, false);
    assert.equal(res.statusCode, 403);
});
