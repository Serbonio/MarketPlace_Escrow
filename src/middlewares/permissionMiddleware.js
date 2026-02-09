// Permite passar quais tipos de usuário podem acessar
const checkPermission = (...allowedTipos) => {
  return (req, res, next) => {
    // req.userTipo vem do middleware de autenticação anterior
    if (!req.userTipo || !allowedTipos.includes(req.userTipo)) {
      return res.status(403).json({ error: 'Usuário sem permissão para esta ação' });
    }
    next();
  };
};

module.exports = checkPermission;