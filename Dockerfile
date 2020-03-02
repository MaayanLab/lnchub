FROM ubuntu:18.04

MAINTAINER Alexander Lachmann <alexander.lachmann@mssm.edu>

# Python installs
RUN apt-get update && apt-get install -y \
    python3 \
    python3-dev \
    python3-pip \
    python3-setuptools \
    apache2 \
    apache2-dev \
    gfortran \
    libopenblas-dev \
    liblapack-dev
    

RUN apt-get clean

# pip installs
RUN pip3 install --upgrade pip
RUN pip3 install flask
RUN pip3 install requests
RUN pip3 install flask-cors
RUN pip3 install tornado
RUN pip3 install pandas
RUN pip3 install waitress
RUN pip3 install mod_wsgi

ENV BASE_URL = "lnchub"

RUN mkdir -p /LNCHUB
WORKDIR /LNCHUB
COPY . /LNCHUB
CMD /LNCHUB/boot.sh
