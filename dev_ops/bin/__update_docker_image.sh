# 脚本代码留存
docker_compose_filepath="/home/matterhorn/dcim/docker-compose.yml"
docker_image_name_tag=${DEVOPS_IMAGE_FULL}
docker_image_name=${DEVOPS_IMAGE_NAME}

var=`cat $docker_compose_filepath|grep $docker_image_name`
echo $var
dest="    image: $docker_image_name_tag"
echo $dest
sed  -i "s|$var|$dest|g" $docker_compose_filepath