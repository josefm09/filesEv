'use strict';
module.exports = function(app) {
    var userHandlers = require('../controllers/userController.js');
    var fileHandlers = require('../controllers/fileController.js');
    
    app.route('/tasks')
        .post(userHandlers.loginRequired, userHandlers.profile);
    app.route('/auth/register')
        .post(userHandlers.register);
   app.route('/auth/sign_in')
        .post(userHandlers.sign_in);
    app.route('/upload')
        .post(userHandlers.loginRequired, fileHandlers.upload);
    app.route('/files')
        .get(userHandlers.loginRequired, fileHandlers.get);
};