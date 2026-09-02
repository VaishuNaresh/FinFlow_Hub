import AuditLog from "../models/auditLog.js";

export const logAction = (action) => {
    return async (req, res, next) => {
        await AuditLog.create({
            action,
            performedBy: req.user.id,
            targetId: req.params.id || null
        });
        next();
    };
};