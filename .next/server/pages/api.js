module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = require('../ssr-module-cache.js');
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./pages/api/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./lib/prisma.ts":
/*!***********************!*\
  !*** ./lib/prisma.ts ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ "@prisma/client");
/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);

const prisma = new _prisma_client__WEBPACK_IMPORTED_MODULE_0__["PrismaClient"]();
/* harmony default export */ __webpack_exports__["default"] = (prisma);

/***/ }),

/***/ "./pages/api/index.ts":
/*!****************************!*\
  !*** ./pages/api/index.ts ***!
  \****************************/
/*! exports provided: GQLDate, schema, config, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GQLDate", function() { return GQLDate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "schema", function() { return schema; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "config", function() { return config; });
/* harmony import */ var apollo_server_micro__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! apollo-server-micro */ "apollo-server-micro");
/* harmony import */ var apollo_server_micro__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(apollo_server_micro__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var graphql_iso_date__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! graphql-iso-date */ "graphql-iso-date");
/* harmony import */ var graphql_iso_date__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(graphql_iso_date__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var nexus__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! nexus */ "nexus");
/* harmony import */ var nexus__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(nexus__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../lib/prisma */ "./lib/prisma.ts");





const GQLDate = Object(nexus__WEBPACK_IMPORTED_MODULE_2__["asNexusMethod"])(graphql_iso_date__WEBPACK_IMPORTED_MODULE_1__["GraphQLDate"], 'date');
const User = Object(nexus__WEBPACK_IMPORTED_MODULE_2__["objectType"])({
  name: 'User',

  definition(t) {
    t.int('id');
    t.string('name');
    t.string('email');
    t.list.field('posts', {
      type: 'Post',
      resolve: parent => _lib_prisma__WEBPACK_IMPORTED_MODULE_4__["default"].user.findUnique({
        where: {
          id: Number(parent.id)
        }
      }).posts()
    });
  }

});
const Post = Object(nexus__WEBPACK_IMPORTED_MODULE_2__["objectType"])({
  name: 'Post',

  definition(t) {
    t.int('id');
    t.string('title');
    t.nullable.string('content');
    t.boolean('published');
    t.nullable.field('author', {
      type: 'User',
      resolve: parent => _lib_prisma__WEBPACK_IMPORTED_MODULE_4__["default"].post.findUnique({
        where: {
          id: Number(parent.id)
        }
      }).author()
    });
  }

});
const Query = Object(nexus__WEBPACK_IMPORTED_MODULE_2__["objectType"])({
  name: 'Query',

  definition(t) {
    t.field('post', {
      type: 'Post',
      args: {
        postId: Object(nexus__WEBPACK_IMPORTED_MODULE_2__["nonNull"])(Object(nexus__WEBPACK_IMPORTED_MODULE_2__["stringArg"])())
      },
      resolve: (_, args) => {
        return _lib_prisma__WEBPACK_IMPORTED_MODULE_4__["default"].post.findUnique({
          where: {
            id: Number(args.postId)
          }
        });
      }
    });
    t.list.field('feed', {
      type: 'Post',
      resolve: (_parent, _args) => {
        return _lib_prisma__WEBPACK_IMPORTED_MODULE_4__["default"].post.findMany({
          where: {
            published: true
          }
        });
      }
    });
    t.list.field('drafts', {
      type: 'Post',
      resolve: (_parent, _args, ctx) => {
        return _lib_prisma__WEBPACK_IMPORTED_MODULE_4__["default"].post.findMany({
          where: {
            published: false
          }
        });
      }
    });
    t.list.field('filterPosts', {
      type: 'Post',
      args: {
        searchString: Object(nexus__WEBPACK_IMPORTED_MODULE_2__["nullable"])(Object(nexus__WEBPACK_IMPORTED_MODULE_2__["stringArg"])())
      },
      resolve: (_, {
        searchString
      }, ctx) => {
        return _lib_prisma__WEBPACK_IMPORTED_MODULE_4__["default"].post.findMany({
          where: {
            OR: [{
              title: {
                contains: searchString
              }
            }, {
              content: {
                contains: searchString
              }
            }]
          }
        });
      }
    });
  }

});
const Mutation = Object(nexus__WEBPACK_IMPORTED_MODULE_2__["objectType"])({
  name: 'Mutation',

  definition(t) {
    t.field('signupUser', {
      type: 'User',
      args: {
        name: Object(nexus__WEBPACK_IMPORTED_MODULE_2__["stringArg"])(),
        email: Object(nexus__WEBPACK_IMPORTED_MODULE_2__["nonNull"])(Object(nexus__WEBPACK_IMPORTED_MODULE_2__["stringArg"])())
      },
      resolve: (_, {
        name,
        email
      }, ctx) => {
        return _lib_prisma__WEBPACK_IMPORTED_MODULE_4__["default"].user.create({
          data: {
            name,
            email
          }
        });
      }
    });
    t.nullable.field('deletePost', {
      type: 'Post',
      args: {
        postId: Object(nexus__WEBPACK_IMPORTED_MODULE_2__["stringArg"])()
      },
      resolve: (_, {
        postId
      }, ctx) => {
        return _lib_prisma__WEBPACK_IMPORTED_MODULE_4__["default"].post.delete({
          where: {
            id: Number(postId)
          }
        });
      }
    });
    t.field('createDraft', {
      type: 'Post',
      args: {
        title: Object(nexus__WEBPACK_IMPORTED_MODULE_2__["nonNull"])(Object(nexus__WEBPACK_IMPORTED_MODULE_2__["stringArg"])()),
        content: Object(nexus__WEBPACK_IMPORTED_MODULE_2__["stringArg"])(),
        authorEmail: Object(nexus__WEBPACK_IMPORTED_MODULE_2__["stringArg"])()
      },
      resolve: (_, {
        title,
        content,
        authorEmail
      }, ctx) => {
        return _lib_prisma__WEBPACK_IMPORTED_MODULE_4__["default"].post.create({
          data: {
            title,
            content,
            published: false,
            author: {
              connect: {
                email: authorEmail
              }
            }
          }
        });
      }
    });
    t.nullable.field('publish', {
      type: 'Post',
      args: {
        postId: Object(nexus__WEBPACK_IMPORTED_MODULE_2__["stringArg"])()
      },
      resolve: (_, {
        postId
      }, ctx) => {
        return _lib_prisma__WEBPACK_IMPORTED_MODULE_4__["default"].post.update({
          where: {
            id: Number(postId)
          },
          data: {
            published: true
          }
        });
      }
    });
  }

});
const schema = Object(nexus__WEBPACK_IMPORTED_MODULE_2__["makeSchema"])({
  types: [Query, Mutation, Post, User, GQLDate],
  outputs: {
    typegen: path__WEBPACK_IMPORTED_MODULE_3___default.a.join(process.cwd(), 'pages/api/nexus-typegen.ts'),
    schema: path__WEBPACK_IMPORTED_MODULE_3___default.a.join(process.cwd(), 'pages/api/schema.graphql')
  }
});
const config = {
  api: {
    bodyParser: false
  }
};
/* harmony default export */ __webpack_exports__["default"] = (new apollo_server_micro__WEBPACK_IMPORTED_MODULE_0__["ApolloServer"]({
  schema
}).createHandler({
  path: '/api'
}));

/***/ }),

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@prisma/client");

/***/ }),

/***/ "apollo-server-micro":
/*!**************************************!*\
  !*** external "apollo-server-micro" ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("apollo-server-micro");

/***/ }),

/***/ "graphql-iso-date":
/*!***********************************!*\
  !*** external "graphql-iso-date" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("graphql-iso-date");

/***/ }),

/***/ "nexus":
/*!************************!*\
  !*** external "nexus" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("nexus");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbGliL3ByaXNtYS50cyIsIndlYnBhY2s6Ly8vLi9wYWdlcy9hcGkvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiQHByaXNtYS9jbGllbnRcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJhcG9sbG8tc2VydmVyLW1pY3JvXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZ3JhcGhxbC1pc28tZGF0ZVwiIiwid2VicGFjazovLy9leHRlcm5hbCBcIm5leHVzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicGF0aFwiIl0sIm5hbWVzIjpbInByaXNtYSIsIlByaXNtYUNsaWVudCIsIkdRTERhdGUiLCJhc05leHVzTWV0aG9kIiwiR3JhcGhRTERhdGUiLCJVc2VyIiwib2JqZWN0VHlwZSIsIm5hbWUiLCJkZWZpbml0aW9uIiwidCIsImludCIsInN0cmluZyIsImxpc3QiLCJmaWVsZCIsInR5cGUiLCJyZXNvbHZlIiwicGFyZW50IiwidXNlciIsImZpbmRVbmlxdWUiLCJ3aGVyZSIsImlkIiwiTnVtYmVyIiwicG9zdHMiLCJQb3N0IiwibnVsbGFibGUiLCJib29sZWFuIiwicG9zdCIsImF1dGhvciIsIlF1ZXJ5IiwiYXJncyIsInBvc3RJZCIsIm5vbk51bGwiLCJzdHJpbmdBcmciLCJfIiwiX3BhcmVudCIsIl9hcmdzIiwiZmluZE1hbnkiLCJwdWJsaXNoZWQiLCJjdHgiLCJzZWFyY2hTdHJpbmciLCJPUiIsInRpdGxlIiwiY29udGFpbnMiLCJjb250ZW50IiwiTXV0YXRpb24iLCJlbWFpbCIsImNyZWF0ZSIsImRhdGEiLCJkZWxldGUiLCJhdXRob3JFbWFpbCIsImNvbm5lY3QiLCJ1cGRhdGUiLCJzY2hlbWEiLCJtYWtlU2NoZW1hIiwidHlwZXMiLCJvdXRwdXRzIiwidHlwZWdlbiIsInBhdGgiLCJqb2luIiwicHJvY2VzcyIsImN3ZCIsImNvbmZpZyIsImFwaSIsImJv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b250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0gcmVxdWlyZSgnLi4vc3NyLW1vZHVsZS1jYWNoZS5qcycpO1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHR2YXIgdGhyZXcgPSB0cnVlO1xuIFx0XHR0cnkge1xuIFx0XHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuIFx0XHRcdHRocmV3ID0gZmFsc2U7XG4gXHRcdH0gZmluYWxseSB7XG4gXHRcdFx0aWYodGhyZXcpIGRlbGV0ZSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0fVxuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vcGFnZXMvYXBpL2luZGV4LnRzXCIpO1xuIiwiaW1wb3J0IHsgUHJpc21hQ2xpZW50IH0gZnJvbSBcIkBwcmlzbWEvY2xpZW50XCI7XG5cbmNvbnN0IHByaXNtYSA9IG5ldyBQcmlzbWFDbGllbnQoKTtcbmV4cG9ydCBkZWZhdWx0IHByaXNtYTtcbiIsImltcG9ydCB7IEFwb2xsb1NlcnZlciB9IGZyb20gJ2Fwb2xsby1zZXJ2ZXItbWljcm8nXG5pbXBvcnQgeyBHcmFwaFFMRGF0ZSB9IGZyb20gJ2dyYXBocWwtaXNvLWRhdGUnXG5pbXBvcnQge1xuICBhc05leHVzTWV0aG9kLFxuICBtYWtlU2NoZW1hLFxuICBub25OdWxsLFxuICBudWxsYWJsZSxcbiAgb2JqZWN0VHlwZSxcbiAgc3RyaW5nQXJnLFxufSBmcm9tICduZXh1cydcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgcHJpc21hIGZyb20gJy4uLy4uL2xpYi9wcmlzbWEnXG5cbmV4cG9ydCBjb25zdCBHUUxEYXRlID0gYXNOZXh1c01ldGhvZChHcmFwaFFMRGF0ZSwgJ2RhdGUnKVxuXG5jb25zdCBVc2VyID0gb2JqZWN0VHlwZSh7XG4gIG5hbWU6ICdVc2VyJyxcbiAgZGVmaW5pdGlvbih0KSB7XG4gICAgdC5pbnQoJ2lkJylcbiAgICB0LnN0cmluZygnbmFtZScpXG4gICAgdC5zdHJpbmcoJ2VtYWlsJylcbiAgICB0Lmxpc3QuZmllbGQoJ3Bvc3RzJywge1xuICAgICAgdHlwZTogJ1Bvc3QnLFxuICAgICAgcmVzb2x2ZTogKHBhcmVudCkgPT5cbiAgICAgICAgcHJpc21hLnVzZXJcbiAgICAgICAgICAuZmluZFVuaXF1ZSh7XG4gICAgICAgICAgICB3aGVyZTogeyBpZDogTnVtYmVyKHBhcmVudC5pZCkgfSxcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5wb3N0cygpLFxuICAgIH0pXG4gIH0sXG59KVxuXG5jb25zdCBQb3N0ID0gb2JqZWN0VHlwZSh7XG4gIG5hbWU6ICdQb3N0JyxcbiAgZGVmaW5pdGlvbih0KSB7XG4gICAgdC5pbnQoJ2lkJylcbiAgICB0LnN0cmluZygndGl0bGUnKVxuICAgIHQubnVsbGFibGUuc3RyaW5nKCdjb250ZW50JylcbiAgICB0LmJvb2xlYW4oJ3B1Ymxpc2hlZCcpXG4gICAgdC5udWxsYWJsZS5maWVsZCgnYXV0aG9yJywge1xuICAgICAgdHlwZTogJ1VzZXInLFxuICAgICAgcmVzb2x2ZTogKHBhcmVudCkgPT5cbiAgICAgICAgcHJpc21hLnBvc3RcbiAgICAgICAgICAuZmluZFVuaXF1ZSh7XG4gICAgICAgICAgICB3aGVyZTogeyBpZDogTnVtYmVyKHBhcmVudC5pZCkgfSxcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5hdXRob3IoKSxcbiAgICB9KVxuICB9LFxufSlcblxuY29uc3QgUXVlcnkgPSBvYmplY3RUeXBlKHtcbiAgbmFtZTogJ1F1ZXJ5JyxcbiAgZGVmaW5pdGlvbih0KSB7XG4gICAgdC5maWVsZCgncG9zdCcsIHtcbiAgICAgIHR5cGU6ICdQb3N0JyxcbiAgICAgIGFyZ3M6IHtcbiAgICAgICAgcG9zdElkOiBub25OdWxsKHN0cmluZ0FyZygpKSxcbiAgICAgIH0sXG4gICAgICByZXNvbHZlOiAoXywgYXJncykgPT4ge1xuICAgICAgICByZXR1cm4gcHJpc21hLnBvc3QuZmluZFVuaXF1ZSh7XG4gICAgICAgICAgd2hlcmU6IHsgaWQ6IE51bWJlcihhcmdzLnBvc3RJZCkgfSxcbiAgICAgICAgfSlcbiAgICAgIH0sXG4gICAgfSlcblxuICAgIHQubGlzdC5maWVsZCgnZmVlZCcsIHtcbiAgICAgIHR5cGU6ICdQb3N0JyxcbiAgICAgIHJlc29sdmU6IChfcGFyZW50LCBfYXJncykgPT4ge1xuICAgICAgICByZXR1cm4gcHJpc21hLnBvc3QuZmluZE1hbnkoe1xuICAgICAgICAgIHdoZXJlOiB7IHB1Ymxpc2hlZDogdHJ1ZSB9LFxuICAgICAgICB9KVxuICAgICAgfSxcbiAgICB9KVxuXG4gICAgdC5saXN0LmZpZWxkKCdkcmFmdHMnLCB7XG4gICAgICB0eXBlOiAnUG9zdCcsXG4gICAgICByZXNvbHZlOiAoX3BhcmVudCwgX2FyZ3MsIGN0eCkgPT4ge1xuICAgICAgICByZXR1cm4gcHJpc21hLnBvc3QuZmluZE1hbnkoe1xuICAgICAgICAgIHdoZXJlOiB7IHB1Ymxpc2hlZDogZmFsc2UgfSxcbiAgICAgICAgfSlcbiAgICAgIH0sXG4gICAgfSlcblxuICAgIHQubGlzdC5maWVsZCgnZmlsdGVyUG9zdHMnLCB7XG4gICAgICB0eXBlOiAnUG9zdCcsXG4gICAgICBhcmdzOiB7XG4gICAgICAgIHNlYXJjaFN0cmluZzogbnVsbGFibGUoc3RyaW5nQXJnKCkpLFxuICAgICAgfSxcbiAgICAgIHJlc29sdmU6IChfLCB7IHNlYXJjaFN0cmluZyB9LCBjdHgpID0+IHtcbiAgICAgICAgcmV0dXJuIHByaXNtYS5wb3N0LmZpbmRNYW55KHtcbiAgICAgICAgICB3aGVyZToge1xuICAgICAgICAgICAgT1I6IFtcbiAgICAgICAgICAgICAgeyB0aXRsZTogeyBjb250YWluczogc2VhcmNoU3RyaW5nIH0gfSxcbiAgICAgICAgICAgICAgeyBjb250ZW50OiB7IGNvbnRhaW5zOiBzZWFyY2hTdHJpbmcgfSB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KVxuICAgICAgfSxcbiAgICB9KVxuICB9LFxufSlcblxuY29uc3QgTXV0YXRpb24gPSBvYmplY3RUeXBlKHtcbiAgbmFtZTogJ011dGF0aW9uJyxcbiAgZGVmaW5pdGlvbih0KSB7XG4gICAgdC5maWVsZCgnc2lnbnVwVXNlcicsIHtcbiAgICAgIHR5cGU6ICdVc2VyJyxcbiAgICAgIGFyZ3M6IHtcbiAgICAgICAgbmFtZTogc3RyaW5nQXJnKCksXG4gICAgICAgIGVtYWlsOiBub25OdWxsKHN0cmluZ0FyZygpKSxcbiAgICAgIH0sXG4gICAgICByZXNvbHZlOiAoXywgeyBuYW1lLCBlbWFpbCB9LCBjdHgpID0+IHtcbiAgICAgICAgcmV0dXJuIHByaXNtYS51c2VyLmNyZWF0ZSh7XG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgIGVtYWlsLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pXG4gICAgICB9LFxuICAgIH0pXG5cbiAgICB0Lm51bGxhYmxlLmZpZWxkKCdkZWxldGVQb3N0Jywge1xuICAgICAgdHlwZTogJ1Bvc3QnLFxuICAgICAgYXJnczoge1xuICAgICAgICBwb3N0SWQ6IHN0cmluZ0FyZygpLFxuICAgICAgfSxcbiAgICAgIHJlc29sdmU6IChfLCB7IHBvc3RJZCB9LCBjdHgpID0+IHtcbiAgICAgICAgcmV0dXJuIHByaXNtYS5wb3N0LmRlbGV0ZSh7XG4gICAgICAgICAgd2hlcmU6IHsgaWQ6IE51bWJlcihwb3N0SWQpIH0sXG4gICAgICAgIH0pXG4gICAgICB9LFxuICAgIH0pXG5cbiAgICB0LmZpZWxkKCdjcmVhdGVEcmFmdCcsIHtcbiAgICAgIHR5cGU6ICdQb3N0JyxcbiAgICAgIGFyZ3M6IHtcbiAgICAgICAgdGl0bGU6IG5vbk51bGwoc3RyaW5nQXJnKCkpLFxuICAgICAgICBjb250ZW50OiBzdHJpbmdBcmcoKSxcbiAgICAgICAgYXV0aG9yRW1haWw6IHN0cmluZ0FyZygpLFxuICAgICAgfSxcbiAgICAgIHJlc29sdmU6IChfLCB7IHRpdGxlLCBjb250ZW50LCBhdXRob3JFbWFpbCB9LCBjdHgpID0+IHtcbiAgICAgICAgcmV0dXJuIHByaXNtYS5wb3N0LmNyZWF0ZSh7XG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgdGl0bGUsXG4gICAgICAgICAgICBjb250ZW50LFxuICAgICAgICAgICAgcHVibGlzaGVkOiBmYWxzZSxcbiAgICAgICAgICAgIGF1dGhvcjoge1xuICAgICAgICAgICAgICBjb25uZWN0OiB7IGVtYWlsOiBhdXRob3JFbWFpbCB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KVxuICAgICAgfSxcbiAgICB9KVxuXG4gICAgdC5udWxsYWJsZS5maWVsZCgncHVibGlzaCcsIHtcbiAgICAgIHR5cGU6ICdQb3N0JyxcbiAgICAgIGFyZ3M6IHtcbiAgICAgICAgcG9zdElkOiBzdHJpbmdBcmcoKSxcbiAgICAgIH0sXG4gICAgICByZXNvbHZlOiAoXywgeyBwb3N0SWQgfSwgY3R4KSA9PiB7XG4gICAgICAgIHJldHVybiBwcmlzbWEucG9zdC51cGRhdGUoe1xuICAgICAgICAgIHdoZXJlOiB7IGlkOiBOdW1iZXIocG9zdElkKSB9LFxuICAgICAgICAgIGRhdGE6IHsgcHVibGlzaGVkOiB0cnVlIH0sXG4gICAgICAgIH0pXG4gICAgICB9LFxuICAgIH0pXG4gIH0sXG59KVxuXG5leHBvcnQgY29uc3Qgc2NoZW1hID0gbWFrZVNjaGVtYSh7XG4gIHR5cGVzOiBbUXVlcnksIE11dGF0aW9uLCBQb3N0LCBVc2VyLCBHUUxEYXRlXSxcbiAgb3V0cHV0czoge1xuICAgIHR5cGVnZW46IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAncGFnZXMvYXBpL25leHVzLXR5cGVnZW4udHMnKSxcbiAgICBzY2hlbWE6IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAncGFnZXMvYXBpL3NjaGVtYS5ncmFwaHFsJyksXG4gIH0sXG59KVxuXG5leHBvcnQgY29uc3QgY29uZmlnID0ge1xuICBhcGk6IHtcbiAgICBib2R5UGFyc2VyOiBmYWxzZSxcbiAgfSxcbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEFwb2xsb1NlcnZlcih7IHNjaGVtYSB9KS5jcmVhdGVIYW5kbGVyKHtcbiAgcGF0aDogJy9hcGknLFxufSlcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIkBwcmlzbWEvY2xpZW50XCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImFwb2xsby1zZXJ2ZXItbWljcm9cIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZ3JhcGhxbC1pc28tZGF0ZVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJuZXh1c1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwYXRoXCIpOyJdLCJzb3VyY2VSb290IjoiIn0=