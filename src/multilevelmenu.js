//
// http://www.codrops.com
//
// Licensed under the MIT license.
// http://www.opensource.org/licenses/mit-license.php
//
// Copyright 2015, Codrops
// http://www.codrops.com
//
(function (window) {

  'use strict';

  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
      thisArg = thisArg || window;
      for (var i = 0; i < this.length; i++) {
        callback.call(thisArg, this[i], i, this);
      }
    };
  }

  var onEndAnimation = function (el, callback) {
    var onEndCallbackFn = function (ev) {
      if (ev.target !== this) return;
      this.removeEventListener('animationend', onEndCallbackFn);
      if (callback && typeof callback === 'function') {
        callback.call();
      }
    };
    el.addEventListener('animationend', onEndCallbackFn);
  };

  function extend(a, b) {
    for (var key in b) {
      if (b.hasOwnProperty(key)) {
        a[key] = b[key];
      }
    }
    return a;
  }

  function MLMenu(el, options) {
    this.el = el;
    this.options = extend({}, this.options);
    extend(this.options, options);

    // the menus (<ul>´s)
    this.menus = [].slice.call(this.el.querySelectorAll('.menu__level'));
    this.wrapper = this.el.querySelector('.menu__wrap');

    // index of current menu
    // Each level is actually a different menu so 0 is root, 1 is sub-1, 2 sub-2, etc.
    this.current_menu = 0;

    /* Determine what current menu actually is */
    var current_menu;
    this.menus.forEach(function (menuEl, pos) {
      var items = menuEl.querySelectorAll('.menu__item');
      items.forEach(function (itemEl) {
        var currentLink = itemEl.querySelector('.menu__link--current');
        if (currentLink) {
          // This is the actual menu__level that should have current
          current_menu = pos;
        }
      });
    });

    if (current_menu) {
      this.current_menu = current_menu;
    }

    this._init();
  }

  MLMenu.prototype.options = {
    // show breadcrumbs
    breadcrumbsCtrl: true,
    // breadcrumbs label
    breadcrumbsLabel: 'You are here',
    // initial breadcrumb text
    initialBreadcrumb: 'all',
    // CSS class for the initial breadcrumb element
    initialBreadcrumbClass: '',
    // show back button
    backCtrl: true,
    // back button label
    backCtrlLabel: 'Go back',
    // back button contents
    backCtrlContent: '<span class="icon icon--arrow-left"></span>',
    // delay between each menu item sliding animation
    itemsDelayInterval: 60,
    // direction
    direction: 'r2l',
    // callback: item that doesn't have a submenu gets clicked
    // onItemClick([event], [inner HTML of the clicked item])
    onItemClick: function () {
      return false;
    }
  };

  MLMenu.prototype._init = function () {
    // iterate the existing menus and create an array of menus,
    // more specifically an array of objects where each one holds the info of each menu element and its menu items
    this.menusArr = [];
    this.breadCrumbs = false;
    var self = this;
    var submenus = [];

    /* Loops over root level menu items */
    this.menus.forEach(function (menuEl, pos) {
      var menu = {menuEl: menuEl, menuItems: [].slice.call(menuEl.querySelectorAll('.menu__item'))};

      self.menusArr.push(menu);

      // set current menu class
      if (pos === self.current_menu) {
        menuEl.classList.add('menu__level--current');
      }

      var links = menuEl.querySelectorAll('.menu__link');
      links.forEach(function (linkEl) {
        var submenu = linkEl.getAttribute('data-submenu');
        if (submenu) {
          var pushMe = {'menu': submenu, 'name': linkEl.innerHTML};
          if (submenus[pos]) {
            submenus[pos].push(pushMe);
          } else {
            submenus[pos] = [];
            submenus[pos].push(pushMe);
          }
        }
      });
    });

    /* For each MENU, find their parent MENU */
    this.menus.forEach(function (menuEl, pos) {
      var menu_x = menuEl.getAttribute('data-menu');
      submenus.forEach(function (subMenuEl, menu_root) {
        subMenuEl.forEach(function (subMenuItem) {
          if (subMenuItem.menu === menu_x) {
            self.menusArr[pos].backIdx = menu_root;
            self.menusArr[pos].name = subMenuItem.name;
          }
        });
      });
    });

    // create breadcrumbs
    if (self.options.breadcrumbsCtrl) {
      this.breadcrumbsCtrl = document.createElement('nav');
      this.breadcrumbsCtrl.className = 'menu__breadcrumbs';
      this.breadcrumbsCtrl.setAttribute('aria-label', self.options.breadcrumbsLabel);
      this.el.insertBefore(this.breadcrumbsCtrl, this.el.firstChild);
      // add initial breadcrumb
      this._addBreadcrumb(0);

      // Need to add breadcrumbs for all parents of current submenu
      if (self.current_menu && self.menusArr[self.current_menu].backIdx !== 0 && self.current_menu !== 0) {
        this._crawlCrumbs(self.menusArr[self.current_menu].backIdx, self.menusArr);
        this.breadCrumbs = true;
      }

      // Create current submenu breadcrumb
      if (self.current_menu !== 0) {
        this._addBreadcrumb(self.current_menu);
        this.breadCrumbs = true;
      }
    }

    /* Resize wrapper to current menu's height */
    this.menus.forEach(function (menuEl) {
      if (menuEl.classList.contains('menu__level--current')) {
        self._resizeFor(menuEl);
      }
    });

    // create back button
    if (this.options.backCtrl) {
      this.backCtrl = document.createElement('button');
      if (this.breadCrumbs) {
        this.backCtrl.className = 'menu__back';
      } else {
        this.backCtrl.className = 'menu__back menu__back--hidden';
      }
      this.backCtrl.setAttribute('aria-label', this.options.backCtrlLabel);
      this.backCtrl.innerHTML = this.options.backCtrlContent;
      this.el.insertBefore(this.backCtrl, this.wrapper);
    }

    // event binding
    this._initEvents();
  };

  MLMenu.prototype._initEvents = function () {
    var self = this;

    for (var i = 0, len = this.menusArr.length; i < len; ++i) {
      this.menusArr[i].menuItems.forEach(function (item, pos) {
        var link = item.querySelector('a');
        if (!link) {
          // eslint-disable-next-line no-console
          console.error('no link found in item', item);
          return;
        }
        link.addEventListener('click', function (ev) {
          var link = ev.target.closest('a'),
            submenu = link.getAttribute('data-submenu'),
            itemName = link.innerHTML,
            subMenuEl = self.el.querySelector('ul[data-menu="' + submenu + '"]');

          // check if there's a sub menu for this item
          if (submenu && subMenuEl) {
            ev.preventDefault();
            // open it
            self._openSubMenu(subMenuEl, pos, itemName);
          } else {
            // add class current
            self.el.querySelector('.menu__link--current').classList.remove('menu__link--current');
            link.classList.add('menu__link--current');

            // callback
            self.options.onItemClick(ev, itemName);
          }
        });
      });
    }

    // back navigation
    if (this.options.backCtrl) {
      this.backCtrl.addEventListener('click', function () {
        self._back();
      });
    }
  };

  MLMenu.prototype._openSubMenu = function (subMenuEl, clickPosition, subMenuName) {
    if (this.isAnimating) {
      return false;
    }
    this.isAnimating = true;

    // save "parent" menu index for back navigation
    this.menusArr[this.menus.indexOf(subMenuEl)].backIdx = this.current_menu;
    // save "parent" menu´s name
    this.menusArr[this.menus.indexOf(subMenuEl)].name = subMenuName;
    // current menu slides out
    this._menuOut(clickPosition);
    // next menu (submenu) slides in
    this._menuIn(subMenuEl, clickPosition);
  };

  MLMenu.prototype._back = function () {
    if (this.isAnimating) {
      return false;
    }
    this.isAnimating = true;

    // current menu slides out
    this._menuOut();
    // next menu (previous menu) slides in
    var backMenu = this.menusArr[this.menusArr[this.current_menu].backIdx].menuEl;
    this._menuIn(backMenu);

    // remove last breadcrumb
    if (this.options.breadcrumbsCtrl) {
      this.breadcrumbsCtrl.removeChild(this.breadcrumbsCtrl.lastElementChild);
      if (this.breadcrumbsCtrl.childElementCount === 1) {
        this.breadcrumbsCtrl.firstElementChild.classList.add('invisible');
      }
    }
  };

  MLMenu.prototype._menuOut = function (clickPosition) {
    // the current menu
    var self = this,
      currentMenu = this.menusArr[this.current_menu].menuEl,
      isBackNavigation = typeof clickPosition === 'undefined';

    // slide out current menu items - first, set the delays for the items
    this.menusArr[this.current_menu].menuItems.forEach(function (item, pos) {
      item.style.WebkitAnimationDelay = item.style.animationDelay = isBackNavigation ? parseInt(pos * self.options.itemsDelayInterval) + 'ms' : parseInt(Math.abs(clickPosition - pos) * self.options.itemsDelayInterval) + 'ms';
    });
    // animation class
    if (this.options.direction === 'r2l') {
      currentMenu.classList.add(!isBackNavigation ? 'animate-outToLeft' : 'animate-outToRight');
    } else {
      currentMenu.classList.add(isBackNavigation ? 'animate-outToLeft' : 'animate-outToRight');
    }
  };

  MLMenu.prototype._resizeFor = function (menuEl) {
    var menuHeight = menuEl.offsetHeight;

    // Apply new height to wrapper element
    this.wrapper.style.minHeight = menuHeight + 'px';
  };

  MLMenu.prototype._menuIn = function (nextMenuEl, clickPosition) {
    var self = this,
      // the current menu
      currentMenu = this.menusArr[this.current_menu].menuEl,
      isBackNavigation = typeof clickPosition === 'undefined',
      // index of the nextMenuEl
      nextMenuIdx = this.menus.indexOf(nextMenuEl),

      nextMenu = this.menusArr[nextMenuIdx],
      nextMenuItems = nextMenu.menuItems,
      nextMenuItemsTotal = nextMenuItems.length;

    self._resizeFor(nextMenuEl);

    // slide in next menu items - first, set the delays for the items
    nextMenuItems.forEach(function (item, pos) {
      item.style.WebkitAnimationDelay = item.style.animationDelay = isBackNavigation ? parseInt(pos * self.options.itemsDelayInterval) + 'ms' : parseInt(Math.abs(clickPosition - pos) * self.options.itemsDelayInterval) + 'ms';

      // we need to reset the classes once the last item animates in
      // the "last item" is the farthest from the clicked item
      // let's calculate the index of the farthest item
      var farthestIdx = clickPosition <= nextMenuItemsTotal / 2 || isBackNavigation ? nextMenuItemsTotal - 1 : 0;

      if (pos === farthestIdx) {
        onEndAnimation(item, function () {
          // reset classes
          if (self.options.direction === 'r2l') {
            currentMenu.classList.remove(!isBackNavigation ? 'animate-outToLeft' : 'animate-outToRight');
            nextMenuEl.classList.remove(!isBackNavigation ? 'animate-inFromRight' : 'animate-inFromLeft');
          } else {
            currentMenu.classList.remove(isBackNavigation ? 'animate-outToLeft' : 'animate-outToRight');
            nextMenuEl.classList.remove(isBackNavigation ? 'animate-inFromRight' : 'animate-inFromLeft');
          }
          currentMenu.classList.remove('menu__level--current');
          nextMenuEl.classList.add('menu__level--current');

          //reset current
          self.current_menu = nextMenuIdx;

          // control back button and breadcrumbs navigation elements
          if (!isBackNavigation) {
            // show back button
            if (self.options.backCtrl) {
              self.backCtrl.classList.remove('menu__back--hidden');
            }

            // add breadcrumb
            self._addBreadcrumb(nextMenuIdx);
          } else if (self.current_menu === 0 && self.options.backCtrl) {
            // hide back button
            self.backCtrl.classList.add('menu__back--hidden');
          }

          // we can navigate again..
          self.isAnimating = false;

          // focus retention
          nextMenuEl.focus();
        });
      }
    });

    // animation class
    if (this.options.direction === 'r2l') {
      nextMenuEl.classList.add(!isBackNavigation ? 'animate-inFromRight' : 'animate-inFromLeft');
    } else {
      nextMenuEl.classList.add(isBackNavigation ? 'animate-inFromRight' : 'animate-inFromLeft');
    }
  };

  MLMenu.prototype._addBreadcrumb = function (idx) {
    if (!this.options.breadcrumbsCtrl) {
      return false;
    }

    var bc = document.createElement('a');
    bc.href = '#'; // make it focusable
    bc.innerHTML = idx ? this.menusArr[idx].name : this.options.initialBreadcrumb;
    if (0 === idx) {
      bc.classList.add(this.options.initialBreadcrumbClass, 'invisible');
    } else {
      this.breadcrumbsCtrl.firstElementChild.classList.remove('invisible');
    }
    this.breadcrumbsCtrl.appendChild(bc);

    var self = this;
    bc.addEventListener('click', function (ev) {
      ev.preventDefault();

      // do nothing if this breadcrumb is the last one in the list of breadcrumbs
      if (!bc.nextSibling || self.isAnimating) {
        return false;
      }
      self.isAnimating = true;

      // current menu slides out
      self._menuOut();
      // next menu slides in
      var nextMenu = self.menusArr[idx].menuEl;
      self._menuIn(nextMenu);

      // remove breadcrumbs that are ahead
      var siblingNode;
      while ((siblingNode = bc.nextSibling)) {
        self.breadcrumbsCtrl.removeChild(siblingNode);
      }
      if (!bc.previousSibling) {
        bc.classList.add('invisible');
      }
    });
  };

  MLMenu.prototype._crawlCrumbs = function (currentMenu, menuArray) {
    if (menuArray[currentMenu].backIdx !== 0) {
      this._crawlCrumbs(menuArray[currentMenu].backIdx, menuArray);
    }
    // create breadcrumb
    this._addBreadcrumb(currentMenu);
  };

  window.MLMenu = MLMenu;

})(window);
