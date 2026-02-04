"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../common/middleware/auth.middleware");
const rbac_middleware_1 = require("../../common/middleware/rbac.middleware");
const users_controller_1 = require("./users.controller");
const user_entity_1 = require("./user.entity");
const router = (0, express_1.Router)();
// Protected: All logged in users
router.get('/me', auth_middleware_1.authenticate, users_controller_1.userController.getMe);
// Protected: Admin only
router.get('/', auth_middleware_1.authenticate, (0, rbac_middleware_1.authorize)(user_entity_1.UserRole.ADMIN), users_controller_1.userController.getAll);
exports.default = router;
