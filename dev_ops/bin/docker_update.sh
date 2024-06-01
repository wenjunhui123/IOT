if [! -f "docker-compose.override.yml"]; then
DockerComposeYml=`docker-compose -f docker-compose.override.yml -f dev_ops/web-docker-compose.yml config`
echo "$DockerComposeYml" > docker-compose.override.yml
else
cp -f dev_ops/web-docker-compose.yml docker-compose.override.yml
fi
rm -rf dev_ops
docker-compose up -d
