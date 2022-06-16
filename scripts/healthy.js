import http from 'k6/http';
import { sleep, check } from 'k6';

//setup
export function setup() {
  console.log('setup being done...');
  return 'hello world';
}

// options
export const options = {
  vus: 50,
  duration: '3s',
};

export default function (data) {
  interactions = interactions + 1;

  const res = http.get('https://livecomments.vf-test3.org/healthy');
  check(res, { 'status was 200': (r) => r.status == 200 });

  sleep(0.5);
}