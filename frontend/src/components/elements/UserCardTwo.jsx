import React from 'react';
import { Link } from 'react-router-dom';
import './UserCardTwo.css';

const rankImages = {
  platino: '/img_rank/rank_3.png',
  diamante: '/img_rank/rank_5.png',
  oro: '/img_rank/rank_4.png',
  plata: '/img_rank/rank_3.png',
  bronce: '/img_rank/rank_2.png',
  basico: '/img_rank/rank_1.png',
};

const UserCardTwo = ({ user }) => {
  const rankImage = user.rank ? rankImages[user.rank.toLowerCase()] : rankImages.basico;

  return (
    
    <div className="user-card-two__card">
       <div className="user-card-two__icon">
        <img
          src={rankImage}
          alt='Rank'
          className='w-8 h-8 rounded-full object-cover'
        />
      </div>
      <div className="user-card-two__profile-pic">
        <img src={user.profilePicture || "/avatar.png"} alt={user.name} />
      </div>
      <div className="user-card-two__bottom">
        <div className="user-card-two__content">
          <span className="user-card-two__name">{user.name}</span>
          <span className="user-card-two__headline">{user.headline}</span>
          <span className="user-card-two__about-me">{user.about}</span>
        </div>
        <div className="user-card-two__bottom-bottom">
          <div className="user-card-two__username-container">
            <span className="user-card-two__name">{user.username}</span>
          </div>
          <Link to={`/profile/${user.username}`} className="user-card-two__button">Ver Perfil</Link>
        </div>
      </div>
    </div>
  );
};

export default UserCardTwo;