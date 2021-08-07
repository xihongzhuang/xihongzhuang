# Setup database for test

#Prepare postgres docker to run as backend DB engine

<!-- Install docker on Ubuntu: -->

https://docs.docker.com/engine/install/ubuntu/
then
sudo apt-get install docker-compose

$ docker pull postgres
$ mkdir ~/workspace/tradeweb
$ cd ~/workspace/tradeweb/db
$ mkdir -p postgres-data
$ docker-compose up -d

#to shutdown database
$ docker-compose down

# prepare database and user for this demo

$ docker exec -it `docker ps -f name=postgresql_docker_db_1 -q` psql -U postgres -d postgres
postgres=# create database tradeweb;
postgres=# \c tradeweb;
postgres=# create user xihongzhuang with encrypted password 'xh123456';
postgres=# grant all privileges on database tradeweb to xihongzhuang;
postgres=# exit

psql -h localhost -p 5432 -U xihongzhuang -d tradeweb
