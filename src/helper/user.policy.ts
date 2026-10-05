import { Op } from "sequelize";
import {
    Action,
    Module,
    ModuleAction,
    RolePermission,
    UserRole,
} from "../models/index.js";

export const getUserPolicies = async (userId: number): Promise<string[]> => {
    const userRoles = await UserRole.findAll({
        where: { user_id: userId },
    });

    const roleIds = userRoles.map((userRole) => {
        return userRole.dataValues?.role_id ?? userRole.role_id;
    });

    if (roleIds.length === 0) {
        return [];
    }

    const permissions = await RolePermission.findAll({
        where: {
            role_id: { [Op.in]: roleIds },
        },
        include: [
            {
                model: ModuleAction,
                as: "moduleAction",
                include: [
                    {
                        model: Module,
                        as: "module",
                        attributes: ["code"],
                    },
                    {
                        model: Action,
                        as: "action",
                        attributes: ["code"],
                    },
                ],
            },
        ],
    });

    const policies: string[] = [];

    for (const permission of permissions) {
        const permData = (permission as any).dataValues || permission;
        const moduleAction =
            permData.moduleAction?.dataValues || permData.moduleAction;

        const module = moduleAction?.module?.dataValues || moduleAction?.module;
        const action = moduleAction?.action?.dataValues || moduleAction?.action;

        let module_code = module?.code;
        let action_code = action?.code;

        // Fallback if module/action code is embedded in moduleAction.code (e.g. "USER:READ")
        if (!module_code || !action_code) {
            const codeString = moduleAction?.code;
            if (codeString && typeof codeString === "string") {
                const parts = codeString.split(/[:.]/);
                if (parts.length === 2) {
                    module_code = module_code || parts[0];
                    action_code = action_code || parts[1];
                }
            }
        }

        if (module_code && action_code) {
            const policyString = `${module_code}.${action_code}`;

            // Ensure no duplicates
            if (!policies.includes(policyString)) {
                policies.push(policyString);
            }
        }
    }

    return policies;
};