export const GITHUB_API_ROOT = 'https://api.github.com'
export const GITHUB_ORG = 'mozilla'
export const REPOS = [
  'addons',
  'addons-frontend',
  'addons-linter',
  'addons-server',
];
const VALID_MILESTONE_RX = /^\d{4}[.-]\d{2}[.-]\d{2}$/

function getMilestones(repo) {
  if (REPOS.includes(repo)) {
    return fetch(`${GITHUB_API_ROOT}/repos/${GITHUB_ORG}/${encodeURIComponent(repo)}/milestones?sort=due_on&direction=desc`, {
        accept: 'application/json',
      })
      .then(checkStatus)
      .then(parseJSON);
  } else {
    alert('Invalid milestone source repo');
  }
}

function getIssuesByMilestone(milestone) {
  const repoString = encodeURIComponent(REPOS.map((repo, idx) => {
    return `repo:mozilla/${repo}`;
  }).join(' '));

  if (VALID_MILESTONE_RX.test(milestone)) {
    return fetch(`${GITHUB_API_ROOT}/search/issues?q=${repoString}%20is%3Aissue%20milestone%3A${milestone}`, {
        accept: 'application/json',
      })
      .then(checkStatus)
      .then(parseJSON);
  } else {
    alert('Invalid milestone');
  }
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
   return response.json()
    .then((json) => {
      json['ratelimitLimit'] = parseInt(response.headers.get('x-rateLimit-limit'), 10);
      json['ratelimitRemaining'] = parseInt(response.headers.get('x-ratelimit-remaining'), 10);
      return json;
    });
}

const Client = { getMilestones, getIssuesByMilestone };
export default Client;
