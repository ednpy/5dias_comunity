import React, { useEffect, useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import './Noticecard.css';

const NoticeCard = () => {
  const { data: notices, error, isLoading } = useQuery({
    queryKey: ["notices"],
    queryFn: async () => {
      const res = await axiosInstance.get('/settings/5delDia', {
        withCredentials: true // Asegúrate de que las credenciales se envían con la solicitud
      });
      return res.data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching notices: {error.message}</div>;
  }

  return (
    <div className="notice-card">
      {notices.map((notice, index) => (
        <div className="card mt-6" key={index}>
          <div className="image">
            <img src={notice.img} alt={notice.titulo} className='image'/>
          </div>
          <div className="content">
            <a href={notice.url} target="_blank">
              <span className="title">{notice.titulo}</span>
            </a> 
            <br></br>
            <a className="action" href={notice.url} target="_blank">
              Leer Noticia
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NoticeCard;