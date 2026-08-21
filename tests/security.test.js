const test = require("node:test");
const assert = require("node:assert/strict");
const BASE =
    "http://smartretailx-alb-478417426.ap-south-1.elb.amazonaws.com";
test("Protected inventory POST rejects unauthenticated request", async () => {
    const response = await fetch(
        `${BASE}/api/v1/inventory`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                productId: "000000000000000000000000",
                quantityAvailable: 10
            })
        }
    );
    assert.equal(response.status, 401);
});
