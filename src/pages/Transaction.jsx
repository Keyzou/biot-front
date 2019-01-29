import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Form, Input, Row, Col } from 'reactstrap';

import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Marker,
  Markers,
} from 'react-simple-maps';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import './Transaction.scss';
import Map from '../assets/worldmap.json';

class Transaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txID: props.match.params.txid,
    };
  }

  render() {
    const { txID } = this.state;
    return (
      <>
        <Container className="transaction">
          <Form className="top-search">
            <Row>
              <Col lg="10">
                <div className="text-input">
                  <Input
                    onChange={this.handleChange}
                    className="transactionInput"
                    size="lg"
                    value={txID}
                    type="text"
                    required
                  />
                  <span className="floating-label">Enter transaction ID</span>
                </div>
              </Col>
              <Col lg="2">
                <Link
                  to={`/transaction/${txID}`}
                  className="btn btn-send"
                  color="primary"
                  size="lg"
                >
                  Consulter
                  <FontAwesomeIcon
                    icon="angle-double-right"
                    size="sm"
                    style={{ marginLeft: '0.5rem' }}
                  />
                </Link>
              </Col>
            </Row>
          </Form>
          <Row className="dashboard">
            <Col lg="3" className="category">
              <h2 className="text-center">Informations</h2>
              <Row>
                <Col lg="6" className="info d-flex flex-column">
                  <span className="name">Brewer</span>
                  <span className="value">IPA</span>
                </Col>
                <Col lg="6" className="info d-flex flex-column text-right">
                  <span className="name">Importer</span>
                  <span className="value">Carrefour</span>
                </Col>
              </Row>
              <Row>
                <Col lg="6" className="info info-loc d-flex flex-column">
                  <span className="name">From</span>
                  <span className="value">Boston, USA</span>
                </Col>
                <Col lg="6" className="info info-loc d-flex flex-column text-right">
                  <span className="name">To</span>
                  <span className="value">Paris, FRANCE</span>
                </Col>
              </Row>
              <Row>
                <Col lg="6" className="info d-flex flex-column">
                  <span className="name">Unit</span>
                  <span className="value">1200</span>
                </Col>
                <Col lg="6" className="info d-flex flex-column text-right">
                  <span className="name">Price</span>
                  <span className="value">1,70€</span>
                </Col>
              </Row>
              <Row>
                <Col lg="6" className="info d-flex flex-column">
                  <span className="name">Penality</span>
                  <span className="value">0.15€</span>
                </Col>
                <Col lg="6" className="info d-flex flex-column text-right">
                  <span className="name">Penality</span>
                  <span className="value">0.35€</span>
                </Col>
              </Row>
            </Col>
            <Col lg="5" className="category">
              <h2 className="text-center">Localisation</h2>
              <div id="mapContainer">
                <ComposableMap
                  className="map"
                  style={{ width: '100%', height: '100%' }}
                  projectionConfig={{ scale: 150 }}
                >
                  <ZoomableGroup>
                    <Geographies disableOptimization geography={Map}>
                      {(geographies, projection) =>
                        geographies.map(
                          (geography, i) =>
                            geography.properties.ISO_A3 !== 'ATA' && (
                              <Geography
                                key={i}
                                geography={geography}
                                className="country"
                                style={{
                                  default: { fill: '#009bf7' },
                                  hover: { fill: '#009bf7' },
                                  pressed: { fill: '#009bf7' },
                                }}
                                projection={projection}
                              />
                            ),
                        )
                      }
                    </Geographies>
                    <Markers>
                      <Marker
                        marker={{
                          markerOffset: 35,
                          name: 'Bogota',
                          coordinates: [-74.0721, 400.711],
                        }}
                      />
                      <circle
                        cx={404}
                        cy={110}
                        r={5}
                        style={{
                          fill: '#FF5722',
                          opacity: 0.9,
                        }}
                      />
                    </Markers>
                  </ZoomableGroup>
                </ComposableMap>
              </div>
            </Col>
            <Col lg="4" className="category">
              <h2 className="text-center">Temperature</h2>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

Transaction.propTypes = {
  txid: PropTypes.string,
};

Transaction.defaultProps = {
  txid: '',
};

export default Transaction;
