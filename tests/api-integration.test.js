const test = require("node:test");
const assert = require("node:assert/strict");
const BASE =
    "http://smartretailx-alb-478417426.ap-south-1.elb.amazonaws.com";
test("AWS API health endpoint returns 200", async () => {
    const response = await fetch(
        `${BASE}/api/v1/health`
    );
    assert.equal(response.status, 200);
});
test("AWS public products endpoint returns 200", async () => {
    const response = await fetch(
        `${BASE}/api/v1/products`
    );
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.ok(body);
});
