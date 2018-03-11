/*
* Gruntfile for members-redesign
*/
module.exports = function(grunt) {

// Project config
grunt.initConfig({
  pkg: grunt.file.readJSON('package.json'),
  // Run a local server
  connect: {
    default: {
      options: {
        port: 9001,
        keepalive: true,
        base: './',
        hostname: '*',
        open: {
          target: 'http://localhost:9001/'
        }
      }
    }
  }
});

// Load plugins
grunt.loadNpmTasks('grunt-contrib-connect');
// grunt.loadNpmTasks('grunt-contrib-watch');

// Register tasks
grunt.registerTask('serve', ['connect:default']);
grunt.registerTask('default', ['serve']);

};