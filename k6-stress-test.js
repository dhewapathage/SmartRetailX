import http from "k6/http";
import { check, sleep } from "k6";
export const options = {
  stages: [
    { duration: "15s", target: 20 },
    { duration: "20s", target: 40 },
    { duration: "20s", target: 60 },
    { duration: "20s", target: 80 },
    { duration: "15s", target: 0 }
  ],
  thresholds: {
    http_req_failed: ["rate<0.02"],
    http_req_duration: ["p(95)<1500"]
  }
};
const BASE =
  "http://smartretailx-alb-478417426.ap-south-1.elb.amazonaws.com";
export default function () {
  const health = http.get(
    `${BASE}/api/v1/health`
  );
  check(health, {
    "health API = 200":
      (r) => r.status === 200
  });
  const products = http.get(
    `${BASE}/api/v1/products`
  );
  check(products, {
    "products API = 200":
      (r) => r.status === 200
  });
  sleep(1);
}
