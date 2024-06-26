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
from pythonping import ping

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

    def get_roles():
        roles = flask.request.headers.get('X-Roles', '')

        if not roles or '(null)' == roles:
            roles = ['impotent']
        else:
            roles = re.findall(r'\w+', roles)

        return roles

    def has_privilege(privilege):
        return access_model.have_privilege(privilege, get_roles())

    def pass_user_info(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            uid = flask.request.headers.get('X-User-Id', '0')
            username = flask.request.headers.get('X-Full-Name', 'Someone')
            roles = get_roles()
            privs = []

            for role in roles:
                privs.extend(access_model.privileges(role))

            kwargs.update({
                'uid': int(uid),
                'username': username.encode('latin1').decode('utf8'),
                'privileges': privs
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

    @app.route('/')
    @authorized_only(privilege='user')
    def index():
        nonlocal has_privilege

        return flask.render_template('index.html', **locals())


    # Devices
    @app.route('/device/', methods=['GET', 'POST'])
    @authorized_only(privilege='user')
    @pass_user_info
    def device_handler(**kwargs):
        if 'GET' == flask.request.method:
            return flask.jsonify(result=manager.device.list(kwargs.get('privileges')))
        if 'POST' == flask.request.method:
            return flask.jsonify(manager.device.insert(flask.request.get_json(force=True), kwargs.get('privileges'), uid=kwargs.get('uid')))


    @app.route('/device/<uuid>', methods=['GET', 'DELETE', 'PATCH'])
    @authorized_only(privilege='user')
    @pass_user_info
    def device_item_handler(uuid, **kwargs):
        if 'GET' == flask.request.method:
            return flask.jsonify(manager.device.get_item(uuid, kwargs.get('privileges')))
        if 'DELETE' == flask.request.method:
            return flask.jsonify(manager.device.delete(uuid, kwargs.get('privileges'), uid=kwargs.get('uid')))
        if 'PATCH' == flask.request.method:
            device = flask.request.get_json(force=True)
            device['uuid'] = uuid
            return flask.jsonify(manager.device.patch(device, kwargs.get('privileges'), uid=kwargs.get('uid')))

    # Interfaces
    @app.route('/interface/', methods=['GET', 'POST'])
    @authorized_only(privilege='admin')
    def interface_handler():
        if 'GET' == flask.request.method:
            return flask.jsonify(result=manager.interface.list())
        if 'POST' == flask.request.method:
            return flask.jsonify(manager.interface.insert(flask.request.get_json(force=True)))

    @app.route('/interface/<uuid>', methods=['GET', 'PUT', 'DELETE'])
    @authorized_only(privilege='admin')
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
    @authorized_only(privilege='admin')
    def global_dhcp():
        if 'GET' == flask.request.method:
            return flask.jsonify(result=manager.dhcp_option_value.list_global())
        if 'POST' == flask.request.method:
            d = flask.request.get_json(force=True)
            return flask.jsonify(result=manager.dhcp_option_value.set_global(d))

    # Available DHCP options
    @app.route('/dhcp-options/', methods=['GET'])
    @authorized_only(privilege='admin')
    def list_dhpc_options():
        return flask.jsonify(result=manager.dhcp_option.list())


    # Users
    @app.route('/user/', methods=['GET'])
    @authorized_only(privilege='user')
    def user_get_handler():
        return flask.jsonify(result=manager.user.list())

    @app.route('/user/', methods=['POST'])
    @authorized_only(privilege='admin')
    def user_handler():
        return flask.jsonify(manager.user.insert(flask.request.get_json(force=True)))

    @app.route('/user/<cn>', methods=['GET', 'PUT', 'DELETE'])
    @authorized_only(privilege='admin')
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
    @app.route('/network/', methods=['GET'])
    @authorized_only(privilege='user')
    @pass_user_info
    def network_get_handler(**kwargs):
        return flask.jsonify(result=manager.network.list(kwargs.get('privileges')))

    @app.route('/network/', methods=['POST'])
    @authorized_only(privilege='admin')
    def network_handler():
        return flask.jsonify(manager.network.insert(flask.request.get_json(force=True)))

    @app.route('/network/<uuid>', methods=['GET'])
    @authorized_only(privilege='user')
    def network_get_item_handler(uuid):
        return flask.jsonify(manager.network.get_item(uuid))

    @app.route('/network/<uuid>', methods=['PUT', 'DELETE', 'PATCH'])
    @authorized_only(privilege='admin')
    def network_item_handler(uuid):
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

    # Network ACL
    @app.route('/network-acl/', methods=['GET'])
    @authorized_only(privilege='admin')
    def network_acl_handler():
        return flask.jsonify({'result': access_model.list_roles()})

    @app.route('/network-acl/<role>', methods=['GET', 'PATCH'])
    @authorized_only(privilege='admin')
    def network_acl_role_handler(role):
        if 'GET' == flask.request.method:
            return flask.jsonify(result=manager.network_acl.get_role(role))
        if 'PATCH' == flask.request.method:
            return flask.jsonify(manager.network_acl.patch(
                        role,
                        flask.request.get_json(force=True)))

    # DNS
    @app.route('/domain/', methods=['GET', 'POST'])
    @authorized_only(privilege='admin')
    def domain_handler():
        if 'GET' == flask.request.method:
            return flask.jsonify(result=manager.domain.list())
        if 'POST' == flask.request.method:
            return flask.jsonify(manager.domain.insert(flask.request.get_json(force=True)))

    @app.route('/domain/<id>', methods=['GET', 'PUT', 'DELETE'])
    @authorized_only(privilege='admin')
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
    @authorized_only(privilege='admin')
    def record_handler():
        if 'GET' == flask.request.method:
            return flask.jsonify(result=manager.record.list())
        if 'POST' == flask.request.method:
            return flask.jsonify(manager.record.insert(flask.request.get_json(force=True)))

    @app.route('/record/<id>', methods=['GET', 'PATCH', 'DELETE'])
    @authorized_only(privilege='admin')
    def record_item_handler(id):
        if 'GET' == flask.request.method:
            return flask.jsonify(manager.record.get_item(id))
        if 'DELETE' == flask.request.method:
            return flask.jsonify(manager.record.delete(id))
        if 'PATCH' == flask.request.method:
            record = flask.request.get_json(force=True)
            record['id'] = id
            return flask.jsonify(manager.record.patch(record))


    # Leases
    @app.route('/lease4/', methods=['GET'])
    @authorized_only(privilege='admin')
    def lease4_handler():
        if 'GET' == flask.request.method:
            return flask.jsonify(result=manager.lease4.list())

    @app.route('/lease4/<addr>', methods=['DELETE'])
    @authorized_only(privilege='admin')
    def lease4_item_handler(addr):
        if 'DELETE' == flask.request.method:
            return flask.jsonify(manager.lease4.delete(addr))

    @app.route('/lease6/', methods=['GET'])
    @authorized_only(privilege='admin')
    def lease6_handler():
        if 'GET' == flask.request.method:
            return flask.jsonify(result=manager.lease6.list())

    @app.route('/lease6/<addr>', methods=['DELETE'])
    @authorized_only(privilege='admin')
    def lease6_item_handler(addr):
        if 'DELETE' == flask.request.method:
            return flask.jsonify(manager.lease6.delete(addr))

    @app.teardown_appcontext
    def shutdown_session(exception=None):
        manager.db().rollback()

    # Logged user info
    @app.route('/user-info/', methods=['GET'])
    @pass_user_info
    def userinfo_handler(**kwargs):
        info = kwargs
        info['networks'] = manager.network.network_acls(kwargs['privileges'])
        return flask.jsonify(**info)


    # @app.route('/port/', methods=['GET', 'POST'])
    # @authorized_only(privilege='user')
    # def port_handler():
    #     if 'GET' == flask.request.method:
    #         return flask.jsonify(result=manager.port.list())
    #     if 'POST' == flask.request.method:
    #         return flask.jsonify(manager.port.insert(flask.request.get_json(force=True)))
    #
    # @app.route('/port/<uuid>', methods=['GET', 'PUT', 'DELETE'])
    # @authorized_only(privilege='user')
    # def port_item_handler(uuid):
    #     if 'GET' == flask.request.method:
    #         return flask.jsonify(manager.port.get_item(uuid))
    #     if 'DELETE' == flask.request.method:
    #         return flask.jsonify(manager.port.delete(uuid))
    #     if 'PUT' == flask.request.method:
    #         port = flask.request.get_json(force=True)
    #         port['uuid'] = uuid
    #         return flask.jsonify(manager.port.update(port))

    @app.route('/connection/', methods=['GET'])
    @authorized_only(privilege='user')
    def connection_handler():
        if 'GET' == flask.request.method:
            return flask.jsonify(result=manager.connection.list())

    # @app.route('/connection/<uuid>', methods=['GET'])
    # @authorized_only(privilege='user')
    # def connection_item_handler(uuid):
    #     if 'GET' == flask.request.method:
    #         return flask.jsonify(manager.connection.get_item(uuid))

    @app.route('/switch/', methods=['GET', 'POST'])
    @authorized_only(privilege='user')
    def switch_handler():
        if 'GET' == flask.request.method:
            return flask.jsonify(result=manager.switch.list())
        if 'POST' == flask.request.method:
            print(flask.request.get_json(force=True))
            return flask.jsonify(manager.switch.insert(flask.request.get_json(force=True)))

    @app.route('/switch/<uuid>', methods=['GET', 'PUT', 'DELETE'])
    @authorized_only(privilege='user')
    def switch_item_handler(uuid):
        if 'GET' == flask.request.method:
            return flask.jsonify(manager.switch.get_item(uuid))
        if 'DELETE' == flask.request.method:
            return flask.jsonify(manager.switch.delete(uuid))
        if 'PUT' == flask.request.method:
            switch = flask.request.get_json(force=True)
            switch['uuid'] = uuid
            return flask.jsonify(manager.switch.update(switch))

    @app.route('/mac_history/', methods=['GET'])
    @authorized_only(privilege='user')
    def mac_history_handler():
        if 'GET' == flask.request.method:
            return flask.jsonify(result=manager.mac_history.list())

    # @app.route('/mac_history/<mac>', methods=['GET'])
    # @authorized_only(privilege='user')
    # def mac_history_item_handler(mac):
    #     if 'GET' == flask.request.method:
    #         return flask.jsonify(manager.mac_history.get_item(mac))

    @app.route('/switch_interface/', methods=['GET'])
    @authorized_only(privilege='user')
    def switch_interface_handler():
        if 'GET' == flask.request.method:
            return flask.jsonify(result=manager.switch_interface.list())

    @app.route('/switch_interface/<uuid>', methods=['GET', 'PUT'])
    @authorized_only(privilege='user')
    def switch_interface_item_handler(uuid):
        if 'GET' == flask.request.method:
            return flask.jsonify(result=manager.switch_interface.get_item(uuid))
        if 'PUT' == flask.request.method:
            interface = flask.request.get_json(force=True)
            interface['uuid'] = uuid
            return flask.jsonify(manager.switch_interface.update(interface))

    @app.route('/config_pattern/', methods=['GET', 'POST'])
    @authorized_only(privilege='user')
    def config_pattern_handler():
        if 'GET' == flask.request.method:
            return flask.jsonify(result=manager.config_pattern.list())
        if 'POST' == flask.request.method:
            return flask.jsonify(manager.config_pattern.insert(flask.request.get_json(force=True)))

    @app.route('/config_pattern/recalculate', methods=['GET'])
    @authorized_only(privilege='user')
    def config_pattern_recalc_handler():
        if 'GET' == flask.request.method:
            return flask.jsonify(result=manager.config_pattern.recalculate_all())

    @app.route('/config_pattern/<uuid>', methods=['GET', 'PUT', 'DELETE'])
    @authorized_only(privilege='user')
    def config_pattern_item_handler(uuid):
        if 'GET' == flask.request.method:
            return flask.jsonify(manager.config_pattern.get_item(uuid))
        if 'DELETE' == flask.request.method:
            return flask.jsonify(manager.config_pattern.delete(uuid))
        if 'PUT' == flask.request.method:
            pattern = flask.request.get_json(force=True)
            pattern['uuid'] = uuid
            return flask.jsonify(manager.config_pattern.update(pattern))

    @app.route('/config_pattern/<uuid>/recalculate', methods=['GET'])
    @authorized_only(privilege='user')
    def config_pattern_item_recalc_handler(uuid):
        if 'GET' == flask.request.method:
            return flask.jsonify(manager.config_pattern.recalculate(uuid))

    @app.route('/ping', methods=['GET'])
    @authorized_only(privilege='user')
    def flask_ping():
        return flask.jsonify(pong=True)


    @app.route('/device/ping/<uuid>', methods=['GET'])
    @authorized_only(privilege='user')
    @pass_user_info
    def device_ping(uuid, **kwargs):
        device = manager.device.get_item(uuid, kwargs.get('privileges'))
        result = False
        for interface in device.get('interfaces', []):
            lease4 = interface.get('lease4')
            addr = interface.get('ip4addr') if lease4 is None else lease4
            if addr:
                result = ping(addr, timeout=1, count=2).success()
                if result:
                    return flask.jsonify({'result': result, 'uuid': uuid})
        return flask.jsonify({'result': result, 'uuid': uuid})

    return app

# vim:set sw=4 ts=4 et:
