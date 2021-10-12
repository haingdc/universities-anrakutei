import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';

export function LikeButton(props) {
  const { value, name, onClick = (_uniId) => { } } = props;
  return (
    <FontAwesomeIcon
      icon={value === true ? fasHeart : farHeart}
      onClick={() => onClick({ name, value: !value })} />
  );
}
