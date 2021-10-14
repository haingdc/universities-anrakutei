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
import { UniversityItem } from '../../../../components/university-item/university-item';
import { UniversityRowItem } from '../../../../components/university-row-item/university-row-item';
import useDidUpdateEffect from '../../../../hooks/useDidUpdateEffect';

export function ListingPage(props) {
  const isXS = useMediaQuery({ query: '(max-width: 575px)' });
  const authContext = useAuthState();
  const {
    listUni, limit, offset, totalRecordCount,
    updateListUni, updateLimitSelection, updateTotalRecordCount
  } = useContext(UniversityContext);
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

  useEffect(function searchEffect() {
    const subscription = UniversityApi.search({ ...submitValues, offset, limit })
      .subscribe(data => {
        const { list, pageResponseInformation: { totalRecordCount } } = data;
        let index = offset;
        list.forEach((n) => {
          n.id = [n.name, n.domains, n.country].join('');
          n.index = ++index;
        });

        updateListUni(list);
        updateLimitSelection({ limit: 10, offset: 0 });
        updateTotalRecordCount(totalRecordCount);
      });
    return () => subscription.unsubscribe();
  }, [submitValues]);

  useDidUpdateEffect(function paginateEffect() {
    const subscription = UniversityApi.search({ ...submitValues, offset, limit })
      .subscribe(data => {
        const { list } = data;
        let index = offset;
        list.forEach((n) => {
          n.id = [n.name, n.domains, n.country].join('');
          n.index = ++index;
        });
        updateListUni(list);
      });
    return () => subscription.unsubscribe();
  }, [offset, limit]);

  useEffect(function likeEffect() {
    let nextListUniByPage = listUni;
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
  }, [listUni, listLikedUniByUser]);

  useEffect(() => {
    async function fetchData() {
      const data = await UniversityApi.loadLikedUnivesitiesByUser({ mail: authContext.user.mail });
      if (data?.likedUniversities) {
        setListLikedUniByUser(data.likedUniversities);
      }
    }
    if (authContext.user) {
      fetchData();
    } else {
      setListLikedUniByUser(new Map());
    }
  }, [authContext.user]);

  return (
    <Container className="universities-listing">
      <Container className="universities-listing__searchbar">
        <Row className="justify-content-center">
          <Col xs={11} md={8} lg={6}>
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
        {isXS ? listUniByPage.map(n => {
          const { id, index, name, country, liked = false } = n;
          const domain = n.domains?.length ? n.domains[0] : undefined;
          return (
            <UniversityItem
              country={country}
              domain={domain}
              index={index}
              key={id}
              name={name}
              LikeButton={<LikeButton name={id} value={liked} onClick={handleLikeClick} />}
            />
          );
        }) : null}
        {!isXS ? (
          <>
            <Row>
              <Col xs={4}>School Name</Col>
              <Col xs={4}>Domain</Col>
              <Col xs={3}>Country</Col>
              <Col xs={1}></Col>
            </Row>
            {listUniByPage.map((n) => {
              const { id, index, name, country, liked = false } = n;
              const domain = n.domains?.length ? n.domains[0] : undefined;
              return (
                <UniversityRowItem
                  country={country}
                  domain={domain}
                  index={index}
                  key={id}
                  name={name}
                  LikeButton={<LikeButton name={id} value={liked} onClick={handleLikeClick} />}
                />
              );
            })}
          </>
        ) : null}
      </Container>
      {listUniByPage.length ? (
        <Container className="universities-listing__pagination">
          <ReactPaginate
            previousLabel={isXS ? '<' : 'previous'}
            nextLabel={isXS ? '>' : 'next'}
            breakLabel={'...'}
            breakClassName={'page-link'}
            pageCount={getTotalPageCount(totalRecordCount, limit)}
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
