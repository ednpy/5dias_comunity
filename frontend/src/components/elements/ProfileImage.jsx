import React from 'react';
import { getRankImage } from './RankImages';

const ProfileImage = ({ profilePicture, rank, username, scale, scale_rank }) => {
  const rankImage = getRankImage(rank);

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