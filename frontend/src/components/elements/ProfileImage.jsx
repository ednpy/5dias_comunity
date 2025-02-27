import React from 'react';
import { getRankImage, getRankName } from './RankImages';

const ProfileImage = ({ profilePicture, rank, username, scale, scale_rank, userPerfilPersonalizado }) => {
  const rankImage = getRankImage(rank, userPerfilPersonalizado);
  const rankName = getRankName(rank, userPerfilPersonalizado);

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
        title={rankName}
        className={`absolute bottom-0 right-0 w-${scale_rank} h-${scale_rank} rounded-full z-2`}
      />
    </div>
  );
};

export default ProfileImage;