FROM centos:centos6
MAINTAINER czheo

############
# set up env
############

# Enable EPEL
RUN rpm -Uvh http://download.fedoraproject.org/pub/epel/6/x86_64/epel-release-6-8.noarch.rpm

# Install Node.js and npm
RUN yum install -y npm

# Install ruby and compass
RUN yum install -y ruby-devel rubygems
RUN gem install compass

############
# start app
############

# Copy app src
COPY . /src

WORKDIR /src
# Install app dependencies
RUN npm install && node_modules/gulp/bin/gulp.js compile 

# EXPOSE 3000
CMD node_modules/forever/bin/forever app.js
