FROM docker.io/centos:7.4.1708
MAINTAINER KOSYAS <jjw1001@kosyas.com>
EXPOSE 25 5432 8080

# set user
USER root

# install node.js & npm
RUN yum install -y epel-release \
&& yum install -y nodejs --enablerepo=epel\
&& yum install -y npm --enablerepo=epel\
&& yum install -y make gcc*

# install pm2 for node.js
RUN npm install -g pm2

# install postgreSQL
RUN yum install -y postgresql-server\
&& yum install -y postgresql-contrib

# set postgreSQL
# RUN systemctl enable postgresql.service
# RUN cd /usr/bin
# RUN initdb -D /var/lib/pgsql/data
RUN echo 'kosyas2018' | passwd --stdin postgres
ENV POSTGRES_PASSWORD=kosyas2018
ENV POSTGRES_USER=postgres

USER postgres
ENV PGDATA=/var/lib/pgsql/data
RUN initdb -D /var/lib/pgsql/data
RUN sed -i "86s/127.0.0.1/0.0.0.0/" /var/lib/pgsql/data/pg_hba.conf\
&& sed -i "86s/32/0/" /var/lib/pgsql/data/pg_hba.conf\
&& sed -i "86s/trust/password/" /var/lib/pgsql/data/pg_hba.conf\
&& sed -i "59s/#listen_addresses = 'localhost'/listen_addresses = '*'/" /var/lib/pgsql/data/postgresql.conf
#RUN chmod 777 /var/lib/pgsql/data
RUN pg_ctl start

# set sendmail
USER root
RUN yum remove -y postfix
RUN yum install -y sendmail sendmail-cf
RUN cp /etc/mail/sendmail.mc /usr/local/src/backup_sendmail.mc
RUN cp /etc/mail/sendmail.cf /usr/local/src/backup_sendmail.cf
RUN sed -i "52s/dnl //" /etc/mail/sendmail.mc\
&& sed -i "53s/dnl //" /etc/mail/sendmail.mc\
&& sed -i "118s/127.0.0.1/0.0.0.0/" /etc/mail/sendmail.mc
RUN m4 /etc/mail/sendmail.mc > /etc/mail/sendmail.cf
RUN systemctl enable  sendmail

# copy or download server File
# 

ADD ./app/ /var/www/app/
ADD ./html/ /var/www/html/
ADD ./mail/ /var/www/mail/
ADD ./server/ /var/www/server/

# install dependency
RUN cd /var/www/server \
&& npm install

# run node.js
# RUN cd /var/www/server

# workdir
WORKDIR /var/www/server

#
#CMD ["npm start var/www/server/index.js"] 
CMD ["/bin/bash"]
CMD ["pm2", "start", "/var/www/server/index.js"]
# CMD ["/bin/bash"]

# port number [sendmail / postgreSQL / server]
