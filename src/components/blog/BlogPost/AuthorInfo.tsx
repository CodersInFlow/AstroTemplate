import React from 'react';
import { Author } from '../../types';

interface AuthorInfoProps {
  author: Author;
}

export const AuthorInfo: React.FC<AuthorInfoProps> = ({ author }) => {
  return (
    <div className="author-info">
      {author.avatar && (
        <img 
          src={author.avatar} 
          alt={author.name}
          className="author-avatar"
        />
      )}
      <div className="author-details">
        <h4 className="author-name">{author.name}</h4>
        {author.role && (
          <span className="author-role">{author.role}</span>
        )}
        {author.bio && (
          <p className="author-bio">{author.bio}</p>
        )}
      </div>
    </div>
  );
};