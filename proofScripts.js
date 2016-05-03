require('shelljs/global');

const arg = process.argv[2];
if (!arg) {
  echo('Please specify a proofing instruction argument.');
  exit(1);
}

const filePattern = process.argv[3];
if (!filePattern) {
  echo('Please specify the file pattern as the last argument.');
  exit(1);
}

if (arg === 'latest') {
  const orderedPosts = ls('-l', filePattern)
    .filter(x => x.name)
    .map(x => x.name)
    .sort((a, b) => b.localeCompare(a));

  if (orderedPosts.length > 0) {
    const latestPost = orderedPosts[0];
    proof(latestPost);
  }
}
else if (arg === 'git-index') {
  gitProof(`git diff --name-only --cached ${filePattern}`);
}
else if (arg === 'git-uncommitted') {
  gitProof(`git diff --name-only --diff-filter=ACMRT ${filePattern}`);
}
else if (arg === 'git-index-and-uncommitted') {
  gitProof([
    `git diff --name-only --diff-filter=ACMRT ${filePattern}`,
    `git diff --name-only --cached' ${filePattern}`
  ]);
}

function gitProof(gitDiffPatterns) {
  if (!which('git')) {
    echo('This script requires git.');
    exit(1);
  }

  if (!Array.isArray(gitDiffPatterns)) {
    gitDiffPatterns = [ gitDiffPatterns ];
  }

  const files = [];
  gitDiffPatterns.forEach(x => {
    const gitDiffOutput = exec(x, { silent: true });

    if (gitDiffOutput.stderr) {
      throw new Error(gitDiffOutput.stderr);
    }

    if (gitDiffOutput.stdout) {
      files.push(gitDiffOutput.stdout);
    }
  });

  if (files.length === 0) {
    echo('No files to proof.');
    exit(0);
  }

  proof(files);
}

function proof(files) {
  if (!Array.isArray(files)) {
    files = [ files ];
  }

  const cmd = `npm run proof ${files.join(' ')}`;
  if (exec(cmd).code !== 0) {
    echo(`Error while running: ${cmd}`);
    exit(1);
  }
}
