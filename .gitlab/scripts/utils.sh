#!/bin/bash

function msg_info() {
    #printf "${underline}${bold}${green}: %s${reset}\n" "$@"
    echo -e "\033[1;4;32m: $@\033[0m"
}

function msg_warn() {
    #printf "${underline}${bold}${tan}: %s${reset}\n" "$@"
    echo -e "\033[1;4;35m: $@\033[0m"
}

function code_check(){

    if [ -z "$SONAR_PROJECT" ];then
        SONAR_PROJECT="default-${CI_PROJECT_NAME}-${CI_COMMIT_BRANCH}"
    else
        SONAR_PROJECT="${SONAR_PROJECT}-${CI_PROJECT_NAME}-${CI_COMMIT_BRANCH}"
    fi

    msg_info "开始静态代码检查"
    sonar-scanner \
    -Dsonar.projectKey=${SONAR_PROJECT} \
    -Dsonar.sources=. \
    -Dsonar.host.url=${SONAR_SERVER} \
    -Dsonar.login=${SONAR_LOGIN_TOKEN}
    msg_info "静态代码检查完毕，请登录 http://sonar.realai-inc.cn 查看结果"
}

function npm_build() {

    if [ ! -d node_modules ];then
      if [ -z "$NPM_REG" ];then
        NPM_REG="https://registry.npm.taobao.org"
      else
        NPM_REG="$NPM_REG"
      fi
      msg_info "更换仓库源: $NPM_REG"
      yarn config set registry $NPM_REG
      msg_info "npm install dependency"
      yarn install --cache-folder .yarn
    fi
    msg_info "npm build dist"
    yarn run build
}

function add_ssh_key() {
    echo
    msg_info "add ssh private key"
    which ssh-agent || ( apt-get update -y && apt-get install openssh-client -y )
    eval $(ssh-agent -s)
    echo -e "$SSH_PRIVATE_KEY" | ssh-add -
    mkdir -p ~/.ssh && chmod 700 ~/.ssh
    [ -f /.dockerenv ]; echo -e "Host *\n\tStrictHostKeyChecking no\n\n" > ~/.ssh/config
}


function code_deploy() {
    add_ssh_key
    msg_info "开始部署，目标目录：$DST_DIR"
    for DST_HOST in ${DST_HOSTS};do
        rsync -aP -e "ssh -p${DST_HOST_PORT}" dist/ ${DST_HOST}:${DST_DIR}/
    done
}
