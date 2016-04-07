/*
 * mixins.js
 * Copyright (C) 2016 ztf <ztf@phanes.zerusnet.com>
 *
 * Distributed under terms of the MIT license.
 */
'use strict';

var ErrorMixin = {
  handleError: function handleError(method, status, message) {
    this.data.errors = [{ 'method': method, 'status': status, 'message': message }];
    this.trigger(this.data);
  }
};