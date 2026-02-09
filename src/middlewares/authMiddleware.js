const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não informado' });
  }

  // --- O AJUSTE ESTÁ AQUI ---
  // Separa 'Bearer' do token real
  const parts = authHeader.split(' ');
  
  if (parts.length !== 2) {
    return res.status(401).json({ error: 'Erro no formato do token' });
  }

  const [scheme, token] = parts;

  // Verifica se a palavra 'Bearer' está lá
  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: 'Token malformatado' });
  }
  // -------------------------

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Boa prática: usar req.userId em vez de req.user para evitar conflitos
    req.userId = decoded.id; 
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
};