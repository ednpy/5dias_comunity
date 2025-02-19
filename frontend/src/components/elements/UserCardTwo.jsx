import React from 'react';
import { Link } from 'react-router-dom';
import './UserCardTwo.css';

const UserCardTwo = ({ user }) => {
  return (
    <div className="user-card-two__card">
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