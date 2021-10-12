import React from 'react';
import './university-item.scss';

export function UniversityItem(props) {
  const { index, name, domain, country, LikeButton } = props;
  return (
    <div className="ua-university-item">
      <div>{index}. {name}</div>
      <div><a href={domain}>{domain}</a> - {country}</div>
      <div>{LikeButton}</div>
    </div>
  );
}
