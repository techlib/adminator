
#!/usr/bin/python -tt

__all__ = ['make_website_app']

from functools import wraps

from werkzeug.exceptions import Unauthorized, NotFound

from sqlalchemy.orm.exc import NoResultFound

from simplejson import dumps
import flask
import os
from jinja2 import Undefined


from flask.ext.cors import CORS 

class SilentUndefined(Undefined):
    '''
    Dont break pageloads because vars arent there!
    '''
    def _fail_with_undefined_error(self, *args, **kwargs):
        return ''

def make_website_app(manager, debug):
    """Construct website WSGI application."""

    app = flask.Flask(__name__)
    app.secret_key = os.urandom(16)
    app.debug = debug
    app.jinja_env.undefined = SilentUndefined
    # TODO - can be removed in production
    cors = CORS(app)

    def protected(fn):
      @wraps(fn)
      def wrapper(*args, **kwargs):
        kwargs['uid'] = int(flask.request.headers.get('X-User-Id', '0'))

        users = manager.db.user \
                .filter(manager.db.user.uid == kwargs['uid']).all()

        if len(users) < 1 or users[0].role == 'none':
            raise Unauthorized()

        return fn(*args, **kwargs)

        return wrapper


    @app.errorhandler(Unauthorized.code)
    def unauthorized(e):
        return flask.render_template('unauthorized.html')

    @protected
    @app.route('/')
    def index():
        return flask.render_template('index.html', **locals())

    # Devices
    @app.route('/device/', methods=['GET', 'POST'])
    def device_handler():
        if 'GET' == flask.request.method:
            return flask.jsonify(result=manager.device.list())
        if 'POST' == flask.request.method:
            return flask.jsonify(manager.device.insert(flask.request.get_json(force=True)))

    @app.route('/device/<uuid>', methods=['GET', 'PUT', 'DELETE'])
    def device_item_handler(uuid):
        if 'GET' == flask.request.method:
            return flask.jsonify(manager.device.get_item(uuid))
        if 'DELETE' == flask.request.method:
            return flask.jsonify(manager.device.delete(uuid))
        if 'PUT' == flask.request.method:
            device = flask.request.get_json(force=True)
            device['uuid'] = uuid
            return flask.jsonify(manager.device.update(device))

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
    @app.route('/dhcp-option-values/', methods=['GET'])
    def list_dhpc_option_values():
        return flask.jsonify(result=manager.dhcp_option_value.list())

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

    @app.route('/network/<uuid>', methods=['GET', 'PUT', 'DELETE'])
    def network_item_handler(uuid):
        if 'GET' == flask.request.method:
            return flask.jsonify(manager.network.get_item(uuid))
        if 'DELETE' == flask.request.method:
            return flask.jsonify(manager.network.delete(uuid))
        if 'PUT' == flask.request.method:
            network = flask.request.get_json(force=True)
            network['uuid'] = uuid
            return flask.jsonify(manager.network.update(network))


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
            print flask.request.get_json(force=True)
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

    return app

# vim:set sw=4 ts=4 et:
# -*- coding: utf-8 -*-
