import http from 'k6/http'
import { check, sleep } from 'k6'

export function setup() {
  // setup function to provide a data to the default function
  let url = 'http://livecomments-service/v4/livecomments/00000000-0000-4000-8000-000000000bc1'
  let bodyRequest = { container_id: "test whathever", title: "section test" }
  let headersRequest =  { 'Content-Type': 'application/json',
                          'authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwMDAwMDAwMC0wMDAwLTQwMDAtODAwMC1lZjQwNGE0MmMzNmUiLCJ2Zjp1dSI6IjAwMDAwMDAwLTAwMDAtNDAwMC04MDAwLWVmNDA0YTQyYzM2ZSIsInBlcm1pc3Npb25zIjpbIjU2Njk2MTY2LTZmNzUtNzI2MS0wMDAwLTAwMDAwMDAwMDAwMDpjbGllbnQiXSwiaXNzIjoidmlhZm91cmEiLCJ2ZjpjcmVkdHlwZSI6ImNsaWVudF9jcmVkZW50aWFscyIsInZmOmNsaWVudCI6IjY1NjgwOGY0LTNkYmItNDQ0MC05ODczLWVmNDA0YTQyYzM2ZSIsImV4cCI6MjUzMzY3ODgxOX0.AJ956fHUkcWU2uVHoA5k3NncybCwz1Lzc6x7Y2wwklw'
                        }

  let res = http.post(url, JSON.stringify(bodyRequest), {
      headers: headersRequest,
  });

  console.log("live results can be seen here: http://localhost:3000/d/k6/k6-load-testing-results")

  return res.json();
}

export const options = {
    stages: [
        { duration: '5s', target: 50 },

        { duration: '10s', target: 100 },

        { duration: '30s', target: 300},

        { duration: '10s', target: 100 },

        { duration: '5s', target: 0 }
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
    let baseUrl = 'http://livecomments-service/v4/livecomments/00000000-0000-4000-8000-000000000bc1/'
    const response = http.get(baseUrl+data.content_container_uuid+'/comments?limit=20')
    check(response, { "status is 200": (r) => r.status === 200 })
    sleep(.100)

    // post a comment
    const bodyRequest = {
                          content: "comment test",
                          metadata: {
                              origin_title: "Your Guide to Building and Engaging an Online Community",
                              origin_summary: "Your Guide to Building and Engaging an Online Community",
                              origin_url: "http://livecomments-service/livecomments/livecomments.html",
                              origin_image_url: "https://viafoura.com/wp-content/uploads/viafoura-value-of-a-registered-user.jpg",
                              origin_image_alt: "A group of people holding up speech bubbles with no text in them",
                              author_host_section_uuid: "00000000-0000-4000-8000-9a2165ae093e"
                          }
                      }
    const headersRequest =  { 'Content-Type': 'application/json',
                            'authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwMDAwMDAwMC0wMDAwLTQwMDAtODAwMC1lZjQwNGE0MmMzNmUiLCJ2Zjp1dSI6IjAwMDAwMDAwLTAwMDAtNDAwMC04MDAwLWVmNDA0YTQyYzM2ZSIsInBlcm1pc3Npb25zIjpbIjU2Njk2MTY2LTZmNzUtNzI2MS0wMDAwLTAwMDAwMDAwMDAwMDpjbGllbnQiXSwiaXNzIjoidmlhZm91cmEiLCJ2ZjpjcmVkdHlwZSI6ImNsaWVudF9jcmVkZW50aWFscyIsInZmOmNsaWVudCI6IjY1NjgwOGY0LTNkYmItNDQ0MC05ODczLWVmNDA0YTQyYzM2ZSIsImV4cCI6MjUzMzY3ODgxOX0.AJ956fHUkcWU2uVHoA5k3NncybCwz1Lzc6x7Y2wwklw'
                          }

    const postResponse = http.post(baseUrl+data.content_container_uuid+'/comments', JSON.stringify(bodyRequest), {
        headers: headersRequest,
    });
    check(postResponse, { "status is 201": (r) => r.status === 201 })
    sleep(.100)
}

export function teardown(data) {
  // teardown function to provide a feedback or turn off the scenario
  console.log('Load tests finished on http://livecomments-service/v4/livecomments/00000000-0000-4000-8000-000000000bc1/'+data.content_container_uuid+'/comments?limit=20');
}