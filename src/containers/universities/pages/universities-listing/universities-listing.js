import React, { useContext, useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ReactPaginate from 'react-paginate';
import { useMediaQuery } from 'react-responsive';
import { LikeButton } from '../../../../components/like-button/like-button';
import { UniversityContext } from '../../../../contexts/university-context';
import { getTotalPageCount } from "../../../../utils";
import { UniversityApi } from "../../../../app-api";
import { useAuthState } from "../../../../contexts/auth-context";
import './universities-listing.scss';

export function ListingPage(props) {
  const isXS = useMediaQuery({ query: '(max-width: 575px)' });
  const authContext = useAuthState();
  const { listUni, limit, offset, updateListUni, updateLimitSelection } = useContext(UniversityContext);
  const [listUniByPage, setListUniByPage] = useState([]);
  const [listLikedUniByUser, setListLikedUniByUser] = useState(new Map());
  const [keywords, setKeywords] = useState('');
  const [submitValues, setSubmitValues] = useState({ uniName: '' });

  function handlePageClick(data) {
    updateLimitSelection({ limit: 10, offset: 10 * data.selected });
  }

  function handleSearchClick() {
    setSubmitValues({ uniName: keywords });
  }

  async function handleLikeClick({ name: uniId, value: liked }) {
    if (authContext.user) {
      const uni = { ...listUniByPage.find(u => u.id === uniId) };
      delete uni.liked;
      if (liked) {
        listLikedUniByUser.set(uniId, uni);
      } else {
        listLikedUniByUser.delete(uniId);
      }
      const nextListLikedUni = new Map(listLikedUniByUser);
      setListLikedUniByUser(nextListLikedUni);
      await UniversityApi.updateLikedUniversitiesByUser({ mail: authContext.user.mail, likedUniversities: nextListLikedUni });
    } else {
      props.history.push('/sign-in');
    }
  }

  useEffect(() => {
    const subscription = UniversityApi.search(submitValues)
      .subscribe(data => {
        data.forEach((n, index) => {
          n.id = [n.name, n.domains, n.country].join('');
          n.index = index;
        });
        updateListUni(data);
        updateLimitSelection({ limit: 10, offset: 0 });
      });

    return () => subscription.unsubscribe();
  }, [submitValues]);

  useEffect(() => {
    let nextListUniByPage = listUni.slice(offset, offset + limit);
    nextListUniByPage = nextListUniByPage.map(uni => {
      if (listLikedUniByUser.has(uni.id)) {
        uni.liked = true;
      } else {
        uni.liked = false;
      }
      return { ...uni };
    });
    setListUniByPage(nextListUniByPage);
    return () => { };
  }, [listUni, limit, offset, listLikedUniByUser]);

  useEffect(() => {
    async function fetchData() {
      const data = await UniversityApi.loadLikedUnivesitiesByUser({ mail: authContext.user.mail });
      if (data?.likedUniversities) {
        setListLikedUniByUser(data.likedUniversities);
      }
    }
    if (authContext.user) {
      fetchData();
    }
  }, [authContext.user]);

  return (
    <Container className="universities-listing">
      <Container className="universities-listing__searchbar">
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <Form.Group className="input-group mt-3 mb-3">
              <Form.Control
                type="text"
                placeholder="Enter a name of university"
                value={keywords}
                onChange={evt => setKeywords(evt.target.value)} />
              <div className="input-group-append">
                <Button variant="outline-primary" onClick={handleSearchClick}>Search</Button>
              </div>
            </Form.Group>
          </Col>
        </Row>
      </Container>
      <Container className="universities-listing__list">
        <Row>
          <Col xs={4}>School Name</Col>
          <Col xs={4}>Domain</Col>
          <Col xs={3}>Country</Col>
          <Col xs={1}></Col>
        </Row>
        {listUniByPage.map((n, index) => {
          const { id, name, country, liked = false } = n;
          const domain = n.domains?.length ? n.domains[0] : undefined;
          return (
            <Row key={id}>
              <Col xs={4} className="text-start">{n.index}.{name}</Col>
              <Col xs={4}><a href={domain}>{domain}</a></Col>
              <Col xs={3}>{country}</Col>
              <Col xs={1}>
                <LikeButton name={id} value={liked} onClick={handleLikeClick} />
              </Col>
            </Row>
          );
        })}
      </Container>
      {listUniByPage.length ? (
        <Container className="universities-listing__pagination">
          <ReactPaginate
            previousLabel={isXS ? '<' : 'previous'}
            nextLabel={isXS ? '>' : 'next'}
            breakLabel={'...'}
            breakClassName={'page-link'}
            pageCount={getTotalPageCount(listUni.length, 10)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={isXS ? 1 : 5}
            onPageChange={handlePageClick}
            containerClassName={'pagination justify-content-center'}
            activeClassName={'active'}
            pageClassName={'page-item'}
            pageLinkClassName={'page-link'}
            previousClassName={'page-link'}
            nextClassName={'page-link'} />
        </Container>
      ) : null}
    </Container>
  );
}
