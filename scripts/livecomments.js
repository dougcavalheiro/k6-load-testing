import http from 'k6/http'
import encoding from 'k6/encoding';
import { check, sleep } from 'k6'

// setup variables - add the values below
const username = __ENV.USERNAME || '3d2694b4-400a-433b-ad2d-9b5bc69c918b';
const password = __ENV.PASS || 'X7K5JJKVOjo@dcqccwpYV#6#g6TApL';
const scope = __ENV.SCOPE || '56696166-6f75-7261-0000-000000000000';
const section_uuid = __ENV.SECTION_UUID || '00000000-0000-4000-8000-000000000bc6';
const env = __ENV.ENVIRONMENT || 'vf-dev3';
const env_url = env+'.org';
// setup variables

export function setup() {

  console.log("Starting setup for env "+env);

  // get access token
  const authUrl = `https://auth.${env_url}/authorize_client`;
  const authData = {
    grant_type: 'client_credentials',
    scope: `${scope}`
  };
  const credentials = encoding.b64encode(`${username}:${password}`);
  const authHeader = {
    authorization: `Basic ${credentials}`,
  };
  const authResponse = http.post(authUrl, authData, { headers: authHeader });
  let bearerToken = authResponse.json().access_token;
  console.log("Authentication done");

  console.log("Creating content container...");
  const url = `https://livecomments.${env_url}/v4/livecomments/${section_uuid}`
  const bodyRequest = { container_id: "test whatever", title: "section test" }
  const headersRequest = {
    'Content-Type': 'application/json',
    'authorization': 'Bearer '+bearerToken
  }

  const res = http.post(url, JSON.stringify(bodyRequest), {
      headers: headersRequest,
  });
  console.log("All created, the live results can be seen here: http://localhost:3000/d/k6/k6-load-testing-results")

  let data = {};
  return Object.assign(data, res.json(), authResponse.json());
}

export const options = {
    stages: [
        { duration: '10s', target: 10 }
    ],
    thresholds: {
        // throws error if more than 90% of the requests takes more than 2 seconds to be completed
        http_req_duration: [
            {
                threshold: 'p(90) < 15000',
                abortOnFail: false,
                delayAbortEval: 100
            }
        ]
    }
}

export default function(data) {
    // get comment list
    let baseUrl = `https://livecomments.${env_url}/v4/livecomments/${section_uuid}/`
    const response = http.get(baseUrl+data.content_container_uuid+'/comments?limit=20')
    check(response, { "status is 200": (r) => r.status === 200 })
    sleep(.100)

    // post a comment
    const bodyRequest = {
                          content: "comment test",
                          metadata: {
                              origin_title: "Your Guide to Building and Engaging an Online Community",
                              origin_summary: "Your Guide to Building and Engaging an Online Community",
                              origin_url: `http://kube.${env}.click/livecomments/livecomments.html`,
                              origin_image_url: `http://kube.${env}.click//wp-content/uploads/viafoura-value-of-a-registered-user.jpg`,
                              origin_image_alt: "A group of people holding up speech bubbles with no text in them",
                              author_host_section_uuid: `${section_uuid}`
                          }
                      }
    const headersRequest =  {
      'Content-Type': 'application/json',
      'authorization': 'Bearer '+data.access_token
    }

    const postResponse = http.post(baseUrl+data.content_container_uuid+'/comments', JSON.stringify(bodyRequest), {
        headers: headersRequest,
    });
    check(postResponse, { "status is 201": (r) => r.status === 201 })

    // breath
    sleep(.100)
}

export function teardown(data) {
  // teardown function to provide a feedback or turn off the scenario
  const url = `https://livecomments.${env_url}/v4/livecomments/${section_uuid}/${data.content_container_uuid}/comments?limit=100`
  console.log(`check the contents by running: curl --location --request GET ${url} --header 'Authorization: Bearer ${data.access_token}'`)
}