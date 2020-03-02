#!/usr/bin/env bash

adduser --disabled-password --gecos '' rw
cd /LNCHUB/
mod_wsgi-express setup-server wsgi.py --port=80 --user rw --group rw --server-root=/etc/LNCHUB --socket-timeout=600 --limit-request-body=524288000
chmod a+x /etc/LNCHUB/handler.wsgi
chown -R rw /LNCHUB
/etc/LNCHUB/apachectl start
tail -f /etc/LNCHUB/error_log