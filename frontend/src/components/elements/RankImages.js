//Array para los criterios de clasificacion
const RankImages = {
  basico: '/img_rank/rank_1.png',
  bronce: '/img_rank/rank_2.png',
  plata: '/img_rank/rank_3.png',
  oro: '/img_rank/rank_4.png',
  diamante: '/img_rank/rank_5.png',
  platino: '/img_rank/rank_6.png',
};

export const getRankImage = (points) => {
  if (points >= 100000) return RankImages.platino;
  if (points >= 50000) return RankImages.diamante;
  if (points >= 30000) return RankImages.oro;
  if (points >= 20000) return RankImages.plata;
  if (points >= 6000) return RankImages.bronce;
  return RankImages.basico;
};

export default RankImages;