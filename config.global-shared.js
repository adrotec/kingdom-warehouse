var CONFIG_SHARED_REQUIREJS = {
  paths: {
    'jquery': 'bower/jquery/jquery',
    'knockout': 'bower/knockout.js/knockout.debug'
  },
  map: {
    '*': {
      'ko': 'knockout',
      'text': 'bower/requirejs-text/text',
      'durandal': 'bower/durandal/js',
      'plugins': 'bower/durandal/js/plugins',
      'transitions': 'bower/durandal/js/transitions',
      'durandal-punches': 'bower/durandal-punches/build/output/durandal-punches',
      'di': 'npm/di/dist/amd/index',
      'kingdom': 'bower/kingdom/dist/amd/index',
      'rtts-assert': 'npm/rtts-assert/dist/amd/assert'
    }
  },
  shim: {
  }
};
