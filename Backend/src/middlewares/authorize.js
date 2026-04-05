
// const authorize = (req, res, next) => {
//     const userRole = req.user.role;
//     const userStatus = req.user.status;
//     if (userStatus !== "active") {
//         return res.status(403).json({ message: "Account is inactive. Please contact support." });
//     }
//     // if (userRole === "admin") {
//         console.log("Authorized user:", req.user.id, "Role:", userRole);
//         return next();
//     // }
//     // return res.status(403).json({ message: "Access denied. Insufficient privileges." });

// }
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        try{

            const { role, status } = req.user;
            
            if (status !== "active") {
                return res.status(403).json({
                    message: "Account is inactive. Please contact support."
                });
            }
            
            if (!allowedRoles.includes(role)) {
                return res.status(403).json({
                    message: "Access denied. Insufficient privileges."
                });
            }
            
            console.log("Authorized:", req.user.id, "Role:", role);
            
            next();
        }catch(err){
            console.error('Error in authorization middleware:', err);
            return res.status(500).json({message: "Internal server error"});
        }
        };
};

module.exports = authorize;


