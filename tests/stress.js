import { check, sleep } from 'k6';
import http from 'k6/http';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export const options = {
  stages: [
    { duration: '2m', target: 200 },
    { duration: '2m', target: 500 },
    { duration: '2m', target: 1000 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.20'],
  },
};

export default function () {
  const payload = JSON.stringify({
    cartId: 'stress-test-cart',
    userId: 'user-stress',
    items: [
      { productId: 'cpu-heavy-1', quantity: 1 },
      { productId: 'cpu-heavy-2', quantity: 1 },
    ],
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(`${BASE_URL}/checkout/crypto`, payload, params);

  check(res, {
    'status é 200 ou 5xx esperado': (r) => r.status === 200 || r.status >= 500,
  });

  sleep(1);
}
