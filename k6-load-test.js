import http from "k6/http";
import { check, sleep } from "k6";
export const options = {
  stages: [
    { duration: "20s", target: 5 },
    { duration: "30s", target: 10 },
    { duration: "20s", target: 20 },
    { duration: "20s", target: 0 }
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<1000"]
  }
};
const BASE_URL =
  "http://smartretailx-alb-478417426.ap-south-1.elb.amazonaws.com";
export default function () {
  const health = http.get(`${BASE_URL}/api/v1/health`);
  check(health, {
    "health returned 200": (r) => r.status === 200
  });
  const products = http.get(`${BASE_URL}/api/v1/products`);
  check(products, {
    "products request successful": (r) =>
      r.status === 200 || r.status === 401
  });
  sleep(1);
}
