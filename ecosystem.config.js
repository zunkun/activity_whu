module.exports = {
	apps: [ {
		script: 'bin/www.js',
		instances: 1,
		autorestart: true,
		watch: false,
		time: true,
		max_memory_restart: '2G',
		env: {
			PORT: 3020,
			name: 'activity_dev',
			NODE_ENV: 'development'
		},
		env_production: {
			PORT: 3020,
			name: 'activity_pro',
			NODE_ENV: 'production'
		}
	}, {
		script: 'bin/role.js',
		instances: 1,
		autorestart: true,
		watch: false,
		time: true,
		max_memory_restart: '2G',
		env: {
			name: 'role_dev',
			NODE_ENV: 'development'
		},
		env_production: {
			name: 'role_pro',
			NODE_ENV: 'production'
		}
	} ]
};
