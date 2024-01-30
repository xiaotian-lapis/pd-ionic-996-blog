#!/bin/bash
GIT_REPOSITORY="git@git.ionicjs.com:spatial-vision/snowylive.git"

git checkout -b temp
git branch -D "${CI_COMMIT_BRANCH}"
git fetch --unshallow
git checkout --track origin/"${CI_COMMIT_BRANCH}"
git branch -D temp

cmd="git push ${GIT_REPOSITORY} ${CI_COMMIT_BRANCH} -f"
echo "eval $cmd"

eval "$cmd" || {
  echo "${cmd} failed"
  exit 1
}
