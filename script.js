(function (R) {
   'use strict';
   
   var MineSweeper = function() {
      var self = this;
   
      self.nb_bombs = 10;
      self.nb_opened = 0;
      self.bombs = [];
      self.bombs_initialized = false;
      self.debug = false;
      self.w = 10;
      self.h = 10;
   
      self.grid = new Array(self.h);
   
      self.paper = new R(0, 0, 300, 300);
   
      self.init();
   };

   MineSweeper.prototype = {
   
      init: function() {
         var self = this;
   
         self.setBombs();
         self.setGrid();
      },
   
      setGrid: function() {
         var self = this;
         var bloc = null;
   
         for (var y = 0; y < self.h; y++) {
            self.grid[y] = new Array(self.w);
            for (var x = 0; x < self.w; x++) {
               self.grid[y][x] = self.createBloc(x, y);
            }
         }
      },
   
      loopGrid: function(cb) {
         var self = this;
   
      },
   
      createBloc: function(x, y) {
         var self = this;
   
         var bloc = self.paper.rect(30 * x, 30 * y, 30, 30);
   
         bloc.attr({
            'fill': 'grey',
            'stroke': 'white',
            'stroke-width': 1
         });
   
         bloc.data('coord', {
            x: x,
            y: y
         });
   
         bloc = self.defineBloc(bloc);
   
         bloc.click(function() {
            self.checkBloc(this);
         });
   
         return bloc;
      },
   
      defineBloc: function(bloc) {
         var self = this;
         var coord = bloc.data('coord');
   
         if (self.isBomb(coord.x, coord.y)) {
            self.debug && bloc.attr({
               'fill': 'red'
            });
            bloc.data('is_bomb', true);
         } else {
            bloc.data('nb', 0);
            bloc = self.setSiblings(bloc);
         }
   
         return bloc;
      },
   
      isBomb: function(x, y) {
         var self = this;
         return self.bombs.indexOf(x + ':' + y) > -1;
      },
   
      checkBloc: function(bloc) {
         var self = this;
         if (bloc.data('is_bomb') === true) {
            alert('boom');
         } else {
            self.manageBloc(bloc);
         }
      },
   
      openBloc: function(bloc) {
         var self = this;
         var sibling = null;
         var coord = bloc.data('coord');
   
         bloc.attr({
            'fill': '#ddd',
         });
   
         bloc.data('opened', true);
   
         for (var y = -1; y <= 1; y++) {
            for (var x = -1; x <= 1; x++) {
               if (self.grid[coord.y + y]) {
                  sibling = self.grid[coord.y + y][coord.x + x];
   
                  if (sibling && sibling.data('opened') !== true) {
                     self.manageBloc(sibling);
                  }
               }
            }
         }
      },
   
      manageBloc: function(bloc) {
         var self = this;
   
         if (bloc.data('nb') === 0) {
            self.openBloc(bloc);
            self.nb_opened++;
         } else if (bloc.data('show-nb') !== true) {
            self.showNb(bloc);
            self.nb_opened++;
         }
   
         self.checkGame();
      },
   
      checkGame: function() {
         var self = this;
   
         if (self.nb_opened == (100 - self.nb_bombs)) {
            alert('You win');
         }
      },
   
      showNb: function(bloc) {
         var self = this;
   
         var coord = bloc.attr({
            'fill': '#ddd'
         }).data('show-nb', true).data('coord');
   
         self.paper.text((coord.x * 30) + 13, (coord.y * 30) + 13, bloc.data('nb'));
      },
   
      setBombs: function() {
         var self = this;
         var x, y;
   
         while (self.bombs.length < self.nb_bombs) {
            x = Math.floor(Math.random() * 10);
            y = Math.floor(Math.random() * 10);
            self.bombs.push(x + ':' + y);
         }
   
      },
   
      setSiblings: function(bloc) {
         var self = this;
         var sibling = null;
         var coord = bloc.data('coord');
         for (var y = -1; y <= 1; y++) {
            for (var x = -1; x <= 1; x++) {
               if (self.isBomb(coord.x + x, coord.y + y)) {
                  self.debug && bloc.attr({
                     'fill': 'blue'
                  });
                  bloc.data('nb', bloc.data('nb') + 1);
               }
            }
         }
   
         return bloc;
      }
   };
   
   new MineSweeper();
   
})(Raphael);