#!/bin/bash

set -o errexit

# branch=$(git rev-parse --abbrev-ref HEAD)
commit=$(git rev-parse HEAD)
base="reg.real-ai.cn/rsc/rsc-fe-test"
# tag=$branch-$commit
tag=$commit

docker build \
    -t $base:$tag \
    -f ./Dockerfile \
    .

docker push $base:$tag 
