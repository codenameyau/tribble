/*-------JSHint Directives-------*/
/* exported calc                 */
/*-------------------------------*/
'use strict';

var calc = {

  // radToDeg(Number) -> Float
  radToDeg : function(degrees) {
    return degrees * (Math.PI / 180);
  },

  // getRotationSpeed -> Float
  getRotationSpeed : function() {
    return Date.now() * 0.002;
  },

};
