# node-chat

This is a toy chatroom node.js app.
 
### setup with docker
Install docker on your machine. https://docs.docker.com/installation/ubuntulinux/
``` bash
# run redis server
sudo docker run -d --name redis redis
# run node-chat app
sudo docker run -d --name node-chat --link redis:redis -p 80:3000 czheo/node-chat
```

### setup with docker-compose
Install docker

Install docker-compose on your machine. https://docs.docker.com/compose/install/

The fastest way is to use pip
``` bash
sudo pip install docker-compose
```

``` bash
# download docker-compose.yml to your local dir
wget https://raw.githubusercontent.com/czheo/node-chat/master/docker-compose.yml
# start containers
docker-compose up -d
```

### setup manually
Start redis on localhost with default port(6379)

```
# add hosts
sudo echo "localhost redis" >> /etc/hosts
```

Install node.js, npm, ruby, compass

```
# clone source code
git clone https://github.com/czheo/node-chat.git

# install dependancy and compile source code
cd node-chat
npm install && node_modules/gulp/bin/gulp.js compile 

# start node-chat app
node_modules/forever/bin/forever start app.js
```

Then you can visit http://yourhostname:3000

Check `Dockerfile` as a reference. https://github.com/czheo/node-chat/blob/master/Dockerfile
