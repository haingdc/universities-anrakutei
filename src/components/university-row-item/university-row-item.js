import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export function UniversityRowItem(props) {
  const { index, name, domain, country, LikeButton } = props;
  return (
    <Row>
      <Col xs={4} className="text-start">{index}.{name}</Col>
      <Col xs={4}><a href={domain}>{domain}</a></Col>
      <Col xs={3}>{country}</Col>
      <Col xs={1}>
        {LikeButton}
      </Col>
    </Row>
  );
}
