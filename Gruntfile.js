module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    nodewebkit: {
      options: {
        build_dir: './build',
        mac: false,
        win: false,
        linux32: false,
        linux64: true,
        credits: 'credits.html',
        mac_icns: 'icon.icns'
      },
      src: ['./**/*']
    },

    clean: {
      build: ['build/releases']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-node-webkit-builder');

  grunt.registerTask('build', ['clean', 'nodewebkit']);
}
