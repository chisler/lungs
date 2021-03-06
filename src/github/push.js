import { GitHubAPI } from "./github-api"

//pr_options = {title: ..., body:..., commit_msg:...}
export function forkAndCommit(credentials, new_content, pr_options) {
  //TODO: make async
  const api = new GitHubAPI(credentials);
  const {title, body, commit_msg} = pr_options;

  const base_repo = api.gh.getRepo('languagesWiki', 'languageWiki');
  base_repo.fork(() => {});

  api.setRepo(credentials.username, 'languageWiki');

  //TODO: split into two async functions
  let commited = false;
  api.setBranch('master')
    .then(() => api.pushFiles(
      commit_msg,
      [
        {content: new_content, path: 'languages.yml'}
      ])
    )
    .then(function () {
      console.log('Files committed!');
      commited = true;
    });

  const options = {
    title: title,
    head: credentials.username + ":master",
    base: "master",
    body: body
  };

  return {commited, prPromise: base_repo.createPullRequest(options) };
}
