/**
 * Grunt Uploader for Lambda scripts
 * @author: Chris Moyer <cmoyer@aci.info>
 */
'use strict';
module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);
	if(grunt.option('account-id') === undefined){
		return grunt.fail.fatal('--acount-id is required', 1);
	}

	var path = require('path');
	grunt.initConfig({
		lambda_invoke: {
			default: {
				package: 'jwtAuthorize',
				options: {
					file_name: 'index.js',
					handler: 'handler',
					event: 'event.json',
				},
			}
		},
		lambda_deploy: {
			default: {
				package: 'jwtAuthorize',
				options: {
					file_name: 'index.js',
					handler: 'handler',
				},
				arn: 'arn:aws:lambda:us-east-1:' + grunt.option('account-id') + ':function:jwtAuthorize',
			},
		},
		lambda_package: {
			default: {
				package: 'jwtAuthorize',
			},
		},
		env: {
			prod: {
				NODE_ENV: 'production',
			},
		},

	});

	grunt.registerTask('deploy', ['env:prod', 'lambda_package', 'lambda_deploy']);
	grunt.registerTask('test', ['lambda_invoke']);
};
