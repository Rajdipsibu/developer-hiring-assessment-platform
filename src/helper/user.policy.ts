import { Op } from "sequelize";
import {
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
                attributes: ["code"],
            },
        ],
    });

    const policies: string[] = [];

    for (const permission of permissions) {
        const permData = (permission as any).dataValues || permission;
        const moduleAction =
            permData.moduleAction?.dataValues || permData.moduleAction;

        // moduleAction.code is already stored as "MODULE:ACTION" (e.g. "USER:READ")
        const codeString: string | undefined = moduleAction?.code;
        if (!codeString) continue;

        // const parts = codeString.split(/[:.]/);
        // if (parts.length !== 2) continue;

        // const policyString = `${parts[0]}.${parts[1]}`;

        // Ensure no duplicates
        if (!policies.includes(codeString)) {
            policies.push(codeString);
        }
    }

    return policies;
};