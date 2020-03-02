# get rid of old stuff
docker rmi -f $(docker images | grep "^<none>" | awk "{print $3}")
docker rm $(docker ps -q -f status=exited)

docker kill lnchub
docker rm lnchub

docker build -f Dockerfile -t maayanlab/lnchub .
docker push maayanlab/lnchub
