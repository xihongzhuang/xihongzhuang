# Setup database for test

#Prepare postgres docker to run as backend DB engine

<!-- Install docker on Ubuntu: -->

https://docs.docker.com/engine/install/ubuntu/
then

```
sudo apt-get install docker-compose

$ docker pull postgres
$ mkdir ~/workspace/tradeweb
$ cd ~/workspace/tradeweb/db
$ mkdir -p postgres-data
$ docker-compose up -d
```

To shutdown database

```
$ docker-compose down
```

Prepare database and user for this demo

```
$ docker exec -it `docker ps -f name=postgresql_docker_db_1 -q` psql -U postgres -d postgres
postgres=# create database tradeweb;
postgres=# \c tradeweb;
postgres=# create user xihongzhuang with encrypted password 'xh123456';
postgres=# grant all privileges on database tradeweb to xihongzhuang;
postgres=# exit
```

to login from OS into postgres database inside docker

```
psql -h localhost -p 5432 -U xihongzhuang -d tradeweb
```

Currently, the command `docker-compose run -d` should have started 2 docker instances. run

```
$ docker ps -a
CONTAINER ID   IMAGE      COMMAND                  CREATED        STATUS        PORTS                                       NAMES
65d188764542   adminer    "entrypoint.sh docke…"   12 hours ago   Up 12 hours   0.0.0.0:8080->8080/tcp, :::8080->8080/tcp   postgresql_docker_adminer_1
184af8bf0dad   postgres   "docker-entrypoint.s…"   12 hours ago   Up 12 hours   0.0.0.0:5432->5432/tcp, :::5432->5432/tcp   postgresql_docker_db_1
```

Then you can also access database from database web UI, open a browser, then type in url: http://localhost:8080/
in the login page, type in

```
System => PostgreSQL
Server => postgresql_docker_db_1
Username => xihongzhuang
Password => xh123456
Database => tradeweb
```

start browser UI to test placing order
for the first time

```
$ cd ui
$ yarn install
$ yarn build

```

launch the browser UI

```
$ yarn start
```
