#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

__all__ = ['make_site']

from sqlalchemy import *
from sqlalchemy.exc import *
from werkzeug.exceptions import *
from adminator.site.util import *
from functools import wraps


from sqlalchemy import desc
from sqlalchemy.exc import SQLAlchemyError
from datetime import date, datetime, timedelta
from xml.sax.saxutils import escape

import flask
import os
import re

def make_site(db, manager, access_model, debug=False):
    app = flask.Flask('.'.join(__name__.split('.')[:-1]))
    app.secret_key = os.urandom(16)
    app.debug = debug

    @app.template_filter('to_alert')
    def category_to_alert(category):
        return {
            'warning': 'alert-warning',
            'error': 'alert-danger',
        }[category]

    @app.template_filter('to_icon')
    def category_to_icon(category):
        return {
            'warning': 'pficon-warning-triangle-o',
            'error': 'pficon-error-circle-o',
        }[category]


    def has_privilege(privilege):
        roles = flask.request.headers.get('X-Roles', '')

        if not roles or '(null)' == roles:
            roles = ['impotent']
        else:
            roles = re.findall(r'\w+', roles)

        return access_model.have_privilege(privilege, roles)

    def pass_user_info(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            uid = flask.request.headers.get('X-User-Id', '0')
            username = flask.request.headers.get('X-Full-Name', 'Someone')

            kwargs.update({
                'uid': int(uid),
                'username': username.encode('latin1').decode('utf8'),
            })

            return fn(*args, **kwargs)
        return wrapper


    def authorized_only(privilege='user'):
        def make_wrapper(fn):
            @wraps(fn)
            def wrapper(*args, **kwargs):
                if not has_privilege(privilege):
                    raise Forbidden('RBAC Forbidden')

                return fn(*args, **kwargs)

            return wrapper
        return make_wrapper


    @app.errorhandler(Forbidden.code)
    def unauthorized(e):
        return flask.render_template('forbidden.html')

    @app.errorhandler(SQLAlchemyError)
    def handle_sqlalchemy_error(error):
        response = flask.jsonify({'message': str(error)})
        response.status_code = 500
        return response

#    @authorized_only(privilege='user')
    @app.route('/')
    def index():
        nonlocal has_privilege

        return flask.render_template('index.html', **locals())


    # Devices
    @app.route('/device/', methods=['GET', 'POST'])
    def device_handler():
        if 'GET' == flask.request.method:
            return flask.jsonify(result=manager.device.list())
        if 'POST' == flask.request.method:
            return flask.jsonify(manager.device.insert(flask.request.get_json(force=True)))


    @app.route('/device/<uuid>', methods=['GET', 'PUT', 'DELETE', 'PATCH'])
    def device_item_handler(uuid):
        if 'GET' == flask.request.method:
            return flask.jsonify(manager.device.get_item(uuid))
        if 'DELETE' == flask.request.method:
            return flask.jsonify(manager.device.delete(uuid))
        if 'PUT' == flask.request.method:
            device = flask.request.get_json(force=True)
            device['uuid'] = uuid
            return flask.jsonify(manager.device.update(device))
        if 'PATCH' == flask.request.method:
            device = flask.request.get_json(force=True)
            device['uuid'] = uuid
            return flask.jsonify(manager.device.patch(device))

    # Interfaces
    @app.route('/interface/', methods=['GET', 'POST'])
    def interface_handler():
        if 'GET' == flask.request.method:
            return flask.jsonify(result=manager.interface.list())
        if 'POST' == flask.request.method:
            return flask.jsonify(manager.interface.insert(flask.request.get_json(force=True)))

    @app.route('/interface/<uuid>', methods=['GET', 'PUT', 'DELETE'])
    def interface_item_handler(uuid):
        if 'GET' == flask.request.method:
            return flask.jsonify(manager.interface.get_item(uuid))
        if 'DELETE' == flask.request.method:
            return flask.jsonify(manager.interface.delete(uuid))
        if 'PUT' == flask.request.method:
            interface = flask.request.get_json(force=True)
            interface['uuid'] = uuid
            return flask.jsonify(manager.interface.update(interface))



    # DHCP option values
    @app.route('/dhcp-global/', methods=['GET', 'POST'])
    def global_dhcp():
        if 'GET' == flask.request.method:
            return flask.jsonify(result=manager.dhcp_option_value.list_global())
        if 'POST' == flask.request.method:
            d = flask.request.get_json(force=True)
            return flask.jsonify(result=manager.dhcp_option_value.set_global(d))

    # Available DHCP options
    @app.route('/dhcp-options/', methods=['GET'])
    def list_dhpc_options():
        return flask.jsonify(result=manager.dhcp_option.list())


    # Users
    @app.route('/user/', methods=['GET', 'POST'])
    def user_handler():
        if 'GET' == flask.request.method:
            return flask.jsonify(result=manager.user.list())
        if 'POST' == flask.request.method:
            return flask.jsonify(manager.user.insert(flask.request.get_json(force=True)))

    @app.route('/user/<cn>', methods=['GET', 'PUT', 'DELETE'])
    def user_item_handler(cn):
        if 'GET' == flask.request.method:
            return flask.jsonify(manager.user.get_item(cn))
        if 'DELETE' == flask.request.method:
            return flask.jsonify(manager.user.delete(cn))
        if 'PUT' == flask.request.method:
            user = flask.request.get_json(force=True)
            user['cn'] = cn
            return flask.jsonify(manager.user.update(user))


    # Networks
    @app.route('/network/', methods=['GET', 'POST'])
    def network_handler():
        if 'GET' == flask.request.method:
            return flask.jsonify(result=manager.network.list())
        if 'POST' == flask.request.method:
            return flask.jsonify(manager.network.insert(flask.request.get_json(force=True)))

    @app.route('/network/<uuid>', methods=['GET', 'PUT', 'DELETE', 'PATCH'])
    def network_item_handler(uuid):
        if 'GET' == flask.request.method:
            print(manager.network.get_item(uuid))
            return flask.jsonify(manager.network.get_item(uuid))
        if 'DELETE' == flask.request.method:
            return flask.jsonify(manager.network.delete(uuid))
        if 'PUT' == flask.request.method:
            network = flask.request.get_json(force=True)
            network['uuid'] = uuid
            return flask.jsonify(manager.network.update(network))
        if 'PATCH' == flask.request.method:
            network = flask.request.get_json(force=True)
            network['uuid'] = uuid
            return flask.jsonify(manager.network.patch(network))


    # DNS
    @app.route('/domain/', methods=['GET', 'POST'])
    def domain_handler():
        if 'GET' == flask.request.method:
            return flask.jsonify(result=manager.domain.list())
        if 'POST' == flask.request.method:
            return flask.jsonify(manager.domain.insert(flask.request.get_json(force=True)))

    @app.route('/domain/<id>', methods=['GET', 'PUT', 'DELETE'])
    def domain_item_handler(id):
        if 'GET' == flask.request.method:
            return flask.jsonify(manager.domain.get_item(id))
        if 'DELETE' == flask.request.method:
            return flask.jsonify(manager.domain.delete(id))
        if 'PUT' == flask.request.method:
            domain = flask.request.get_json(force=True)
            domain['id'] = id
            return flask.jsonify(manager.domain.update(domain))
 

    @app.route('/record/', methods=['GET', 'POST'])
    def record_handler():
        if 'GET' == flask.request.method:
            return flask.jsonify(result=manager.record.list())
        if 'POST' == flask.request.method:
            return flask.jsonify(manager.record.insert(flask.request.get_json(force=True)))

    @app.route('/record/<id>', methods=['GET', 'PUT', 'DELETE'])
    def record_item_handler(id):
        if 'GET' == flask.request.method:
            return flask.jsonify(manager.record.get_item(id))
        if 'DELETE' == flask.request.method:
            return flask.jsonify(manager.record.delete(id))
        if 'PUT' == flask.request.method:
            record = flask.request.get_json(force=True)
            record['id'] = id
            return flask.jsonify(manager.record.update(record))


    # Leases
    @app.route('/lease4/', methods=['GET'])
    def lease4_handler():
        if 'GET' == flask.request.method:
            return flask.jsonify(result=manager.lease4.list())

    @app.route('/lease4/<cn>', methods=['DELETE'])
    def lease4_item_handler(cn):
        if 'DELETE' == flask.request.method:
            return flask.jsonify(manager.lease4.delete(cn))

    @app.route('/lease6/', methods=['GET'])
    def lease6_handler():
        if 'GET' == flask.request.method:
            return flask.jsonify(result=manager.lease6.list())

    @app.route('/lease6/<cn>', methods=['DELETE'])
    def lease6_item_handler(cn):
        if 'DELETE' == flask.request.method:
            return flask.jsonify(manager.lease6.delete(cn))

    @app.teardown_appcontext
    def shutdown_session(exception=None):
        manager.db.rollback()


    return app


# vim:set sw=4 ts=4 et:
