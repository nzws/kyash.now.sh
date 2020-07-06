import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import { useRouter, Router } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

import Settings from '../components/settings';
import { Container, Button } from '../components/layouts';

const Id = styled.p`
  font-size: 1.3rem;
`;

const Image = styled.div`
  img {
    margin: 10px 0;
    max-width: 100%;
    width: 200px;
  }
`;

const Note = styled.p`
  margin: 10px 0;
  font-size: 0.6rem;
`;

const mobileUA = /Android|webOS|iPhone|iPad|iPod/im;

const Index = ({ hasParam, isMobile }) => {
  if (!hasParam) {
    Router.push('/getting-started');
  }

  const [mobile, setMobile] = useState(isMobile);
  const { query } = useRouter();
  const link = `kyash://qr/u/${query.link}`;

  useEffect(() => {
    setMobile(window.navigator.userAgent.search(mobileUA) !== -1);
  }, []);

  return (
    <Fragment>
      <Head>
        <title>{query.id} - Kyash.now.sh</title>
      </Head>

      <Container>
        <h2>
          <FormattedMessage
            id="qr.title"
            values={{
              id: query.id
            }}
          />
        </h2>

        <Id>
          Kyash ID: <b>{query.id}</b>
        </Id>

        <Image>
          <img
            src={`https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${encodeURIComponent(
              link
            )}`}
          />
        </Image>

        {mobile && (
          <Button href={link}>
            <FormattedMessage id="qr.link" />
          </Button>
        )}

        <Note>
          <FormattedMessage id="qr.note1" />
          <br />
          <FormattedMessage id="qr.note2" />
        </Note>

        <Link href="/getting-started">
          <a>
            <FormattedMessage id="qr.create" />
          </a>
        </Link>
      </Container>

      <Settings />
    </Fragment>
  );
};

Index.getInitialProps = ({ query, res, req }) => {
  const hasParam = !!query.id && !!query.link;
  if (!hasParam && res) {
    res.writeHead(302, { Location: '/getting-started' });
    res.end();
  }

  const isMobile = req && req.headers['user-agent'].search(mobileUA) !== -1;

  return {
    hasParam,
    isMobile
  };
};

Index.propTypes = {
  hasParam: PropTypes.bool,
  isMobile: PropTypes.bool
};

export default Index;
