// /src/pages/extracurricular/index.js

import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { meta, extracurricular } from "../../content_option";

export const Extracurricular = () => {
  return (
    <HelmetProvider>
      <Container className="Extracurricular-header">
        <Helmet>
          <title>Extracurriculars | {meta.title}</title>
          <meta name="description" content={meta.description} />
        </Helmet>
        <Row className="mb-5 mt-3 pt-md-3">
          <Col lg="8">
            <h1 className="display-4 mb-4">Involvement</h1>
            <hr className="t_border my-4 ml-0 text-left" />
          </Col>
        </Row>

        {extracurricular.map((item, i) => (
          <Row className="project-row" key={i}>
            <Col lg="5" md="5" sm="12">
              <img
                src={item.image}
                alt={item.title}
                className="project-image"
              />
            </Col>
            <Col lg="7" md="7" sm="12" className="d-flex align-items-center">
              <div className="project-text">
                <h5 className="service__title">{item.title}</h5>
                <p className="service_desc">{item.description}</p>
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    Learn More
                  </a>
                )}
              </div>
            </Col>
          </Row>
        ))}
      </Container>
    </HelmetProvider>
  );
};
