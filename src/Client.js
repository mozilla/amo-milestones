const GITHUB_API_ROOT = 'https://api.github.com'
const GITHUB_ORG = 'mozilla'


function getMilestones(repo) {
  return fetch(`${GITHUB_API_ROOT}/repos/${GITHUB_ORG}/${repo}/milestones?sort=due_on&direction=desc`, {
      accept: 'application/json',
    })
    .then(checkStatus)
    .then(parseJSON);
}

function getAssignedIssuesByRepo(repo) {

}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(`HTTP Error ${response.statusText}`);
  error.status = response.statusText;
  error.response = response;
  console.log(error); // eslint-disable-line no-console
  throw error;
}

function parseJSON(response) {
  return response.json();
}

const Client = { getMilestones };
export default Client;
