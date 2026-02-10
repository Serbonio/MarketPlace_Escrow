// Permite passar quais tipos de usuário podem acessar
const checkPermission = (...allowedTipos) => {
  return (req, res, next) => {

    console.log('Tipo do usuário:', req.tipo);
    console.log('Permissões permitidas:', allowedTipos);

    // req.userTipo vem do middleware de autenticação anterior
    if (!req.tipo || !allowedTipos.includes(req.tipo)) {
      return res.status(403).json({ error: 'Usuário sem permissão para esta ação' });
    }
    next();
  };
};

module.exports = checkPermission;