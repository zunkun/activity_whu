module.exports = {
	apps: [ {
		name: 'activity_whu',
		script: 'bin/www.js',
		instances: 1,
		autorestart: true,
		watch: false,
		max_memory_restart: '2G',
		env_production: {
			PORT: 4000,
			name: 'activity_whu',
			NODE_ENV: 'production'
		}
	} ]
};
