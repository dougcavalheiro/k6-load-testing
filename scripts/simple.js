import http from 'k6/http';
import { sleep, check } from 'k6';

export default function (data) {
  const res = http.get('https://livecomments.vf-test3.org/healthy');
  check(res, { 'status was 200': (r) => r.status == 200 });
  // breath
  sleep(1);
}