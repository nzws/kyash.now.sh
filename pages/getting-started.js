import React, { Fragment, useState, createRef } from 'react';
import styled from 'styled-components';
import { FormattedMessage, useIntl } from 'react-intl';
import { GitHub } from 'react-feather';
import jsQR from 'jsqr';
import Router from 'next/router';

import ExternalLink from '../components/external-link';
import Settings from '../components/settings';
import { Container, Button } from '../components/layouts';

const Head = styled.div`
  font-size: 1.2rem;
  letter-spacing: 2px;
  margin-bottom: 15px;

  p {
    color: ${({ theme: { text, lighten } }) => lighten(0.5, text)};
  }

  a {
    display: inline-block;
    padding-top: 10px;
    font-size: 1rem;
    letter-spacing: 0;
  }
`;

const Form = styled.div`
  margin: 5px 0;

  b {
    font-size: 0.9rem;
    display: block;
  }

  input:not([type='file']) {
    margin: 5px 0;
    padding: 2px;
    background: #eee;
    color: #030303;
    width: 200px;
    max-width: 100%;
  }

  input[type='file'] {
    color: #030303;
  }
`;

const Note = styled.p`
  margin-top: 5px;
  font-size: 0.7rem;
`;

const Home = () => {
  const { formatMessage } = useIntl();

  const [id, setId] = useState('');
  const [link, setLink] = useState('');
  const file = createRef();

  const selectFile = async () => {
    const data = file.current.files.item(0);
    if (!data) {
      return;
    }

    const image = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    image.src = URL.createObjectURL(data);
    image.onload = () => {
      const width = image.naturalWidth;
      const height = image.naturalHeight;
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(image, 0, 0);
      const data = ctx.getImageData(0, 0, width, height);
      const code = jsQR(data.data, width, height);
      if (!code) {
        return alert(formatMessage({ id: 'home.import-error' }));
      }
      setLink(code.data);
    };
  };

  const create = () => {
    const qrId = link.replace('kyash://qr/u/', '');
    if (link === qrId || !id) {
      return alert(formatMessage({ id: 'home.create-error' }));
    }

    Router.push(`/?id=${id}&link=${qrId}`);
  };

  return (
    <Fragment>
      <Container>
        <Head>
          <h1>Kyash.now.sh</h1>
          <p>
            <FormattedMessage id="home.description" />
          </p>
          <Note>
            <FormattedMessage id="home.note" />
          </Note>

          <ExternalLink href="https://github.com/nzws/kyash.now.sh">
            <GitHub className="icon" size={14} /> nzws/kyash.now.sh
          </ExternalLink>
        </Head>

        <Form>
          <b>
            <FormattedMessage id="home.id" />
          </b>
          <input type="text" value={id} onChange={e => setId(e.target.value)} />
        </Form>

        <Form>
          <b>
            <FormattedMessage id="home.link" />
          </b>
          <input
            type="text"
            value={link}
            onChange={e => setLink(e.target.value)}
            placeholder="kyash://qr/u/~~~"
          />
        </Form>

        <Form>
          <b>
            <FormattedMessage id="home.import" />
          </b>
          <input
            type="file"
            accept="image/png,.png"
            ref={file}
            onChange={selectFile}
          />
        </Form>

        <Button onClick={create}>
          <FormattedMessage id="home.create" />
        </Button>
      </Container>

      <Settings />
    </Fragment>
  );
};

export default Home;
