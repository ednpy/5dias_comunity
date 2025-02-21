//Array para los criterios de clasificacion
const RankImages = {
  basico: '/img_rank/rank_1.png',
  bronce: '/img_rank/rank_2.png',
  plata: '/img_rank/rank_3.png',
  oro: '/img_rank/rank_4.png',
  platino: '/img_rank/rank_5.png',
  black: '/img_rank/rank_6.png',
};

const RankNames = {
  basico: 'Básico',
  bronce: 'Bronce',
  plata: 'Plata',
  oro: 'Oro',
  platino: 'Platino',
  black: 'Black',
};

export const getRankImage = (points, perfilPersonalizado) => {
  if (!perfilPersonalizado) return RankImages.basico;

  const fields = Object.keys(perfilPersonalizado);
  const completedFields = fields.filter((key) => perfilPersonalizado[key] && key !== 'ubicacion');

  if (completedFields.length >= 7) {
    if (points >= 100000) return RankImages.black;
    if (points >= 50000) return RankImages.platino;
    if (points >= 30000) return RankImages.oro;
    if (points >= 20000) return RankImages.plata;
    if (points >= 6000) return RankImages.bronce;
  }

  return RankImages.basico;
};

export const getRankName = (points, perfilPersonalizado) => {
  if (!perfilPersonalizado) return RankNames.basico;

  const fields = Object.keys(perfilPersonalizado);
  const completedFields = fields.filter((key) => perfilPersonalizado[key] && key !== 'ubicacion');

  if (completedFields.length >= 7) {
    if (points >= 100000) return RankNames.black;
    if (points >= 50000) return RankNames.platino;
    if (points >= 30000) return RankNames.oro;
    if (points >= 20000) return RankNames.plata;
    if (points >= 6000) return RankNames.bronce;
  }

  return RankNames.basico;
};

export default RankImages;