import React from 'react';

const rankImages = {
  platino: '/img_rank/rank_3.png',
  diamante: '/img_rank/rank_5.png',
  oro: '/img_rank/rank_4.png',
  plata: '/img_rank/rank_3.png',
  bronce: '/img_rank/rank_2.png',
  basico: '/img_rank/rank_1.png',
};

const ProfileImage = ({ profilePicture, rank, username, scale, scale_rank }) => {
  const rankImage = rank ? rankImages[rank.toLowerCase()] : rankImages.basico;

  return (
    <div className={`relative w-${scale} h-${scale}`}>
      <img
        src={profilePicture || '/avatar.png'}
        alt={username}
        className={`w-${scale} h-${scale} rounded-full object-cover`}
      />
      <img
        src={rankImage}
        alt='Rank'
        className={`absolute bottom-0 right-0 w-${scale_rank} h-${scale_rank} rounded-full z-2`}
      />
    </div>
  );
};

export default ProfileImage;