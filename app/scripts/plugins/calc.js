/*-------JSHint Directives-------*/
/* exported calc                 */
/*-------------------------------*/
'use strict';

var calc = {

  // radToDeg(Number) -> Float
  radToDeg : function(degrees) {
    return degrees * (Math.PI / 180);
  },

  // getRandomNum(Int, Int) -> Int
  getRandomNumber : function(min, max) {
    return Math.random() * (max - min) + min;
  },

};
