#!/bin/sh
full_image_name={{host}}/{{repo_name}}:{{nextTag}}
docker build -t $full_image_name dev_ops/docker
# docker login -u {{user}} -p {{password}} {{host}}
# https://stackoverflow.com/questions/51489359/docker-using-password-via-the-cli-is-insecure-use-password-stdin
echo "{{password}}" | docker login --username {{user}} --password-stdin {{host}}
docker push $full_image_name
docker rmi -f $full_image_name
echo "***********************************"
echo "* web 版本号 ->    {{nextTag}}"
echo "***********************************"
