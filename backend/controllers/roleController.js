const Role = require("../models/RoleModel");
const User = require("../models/UserModel");


const ALL_PERMISSIONS = ['create', 'read', 'update', 'delete'];

const createRole = async (req, res) => {
    const { name, permissions } = req.body;

    try {
        const rolePermissions = permissions || ALL_PERMISSIONS;
        const role = new Role({ name, permissions: rolePermissions });
        await role.save();
        res.status(201).json({ message: 'Role created', role });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const assignRole = async (req, res) => {
    const { userId, roleAction, role } = req.body;

    try {
        const user = await User.findById(userId);
        const roleObj = await Role.findOne({ name: role });

        if (!user || !roleObj) return res.status(404).json({ message: 'User or Role not found' });

        if (roleAction === 'assign') {
            if (!user.roles.includes(roleObj._id)) user.roles.push(roleObj._id);
        } else if (roleAction === 'remove') {
            user.roles = user.roles.filter(r => r.toString() !== roleObj._id.toString());
        }

        await user.save();
        res.json({ message: `${role} role ${roleAction}ed` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = { createRole, assignRole };