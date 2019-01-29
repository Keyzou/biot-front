import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Form, Input, Row, Col } from 'reactstrap';
import {
  LineChart,
  PieChart,
  Cell,
  Pie,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
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
    const humidity = [{ name: 'Humidity', value: 59.5 }, { name: '', value: 100 - 59.5 }];
    const data = [
      { name: '0', temperature: 12.2 },
      { name: '1', temperature: 13.1 },
      { name: '2', temperature: 13.3 },
      { name: '3', temperature: 13.0 },
      { name: '4', temperature: 12.9 },
      { name: '5', temperature: 12.7 },
      { name: '6', temperature: 18.5 },
      { name: '7', temperature: 18.9 },
      { name: '8', temperature: 19.2 },
      { name: '9', temperature: 19.0 },
      { name: '10', temperature: 18.5 },
    ];
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
                      <circle cx={404} cy={110} r={5} style={{ fill: '#FF5722', opacity: 0.9 }} />
                    </Markers>
                  </ZoomableGroup>
                </ComposableMap>
              </div>
            </Col>
            <Col lg="4" className="category">
              <h2 className="text-center">Temperature</h2>
              <LineChart data={data} height={300} width={380} margin={{ left: -25 }}>
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip />
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
              </LineChart>
            </Col>
          </Row>
          <Row className="dashboard">
            <Col lg={{ offset: 3, size: 5 }} className="category">
              <h2 className="text-center">Status step n</h2>
              <Row className="status">
                <Col lg="5" className="status-info">
                  <div className="entry">
                    <FontAwesomeIcon icon="flag" size="2x" style={{ color: '#256637' }} />
                    <div className="entry-info">
                      <span className="value">01/12/2018</span>
                    </div>
                  </div>
                  <div className="entry">
                    <FontAwesomeIcon icon="flag-checkered" size="2x" />
                    <div className="entry-info">
                      <span className="value">02/12/2018</span>
                    </div>
                  </div>

                  <div className="entry">
                    <FontAwesomeIcon icon="circle" size="2x" style={{ color: '#ed7d31' }} />
                    <div className="entry-info">
                      <span className="value">IN TRANSIT</span>
                    </div>
                  </div>
                </Col>
                <Col lg="4" className="delay-container">
                  <div className="duration">18:03:33</div>
                  DURATION
                </Col>
                <Col lg="3" className="delay-container">
                  <div className="delay">0</div>
                  DAYS OF DELAY
                </Col>
              </Row>
            </Col>
            <Col lg="4" className="category">
              <h2 className="text-center">Humidity</h2>
              <PieChart width={380} height={200} className="pie-chart">
                <Pie
                  data={humidity}
                  cx={190}
                  cy={100}
                  label={renderCustomizedLabel}
                  labelLine={false}
                  outerRadius={80}
                >
                  {data.map((entry, index) => (
                    <Cell fill={index !== 0 ? 'transparent' : '#0088fe'} />
                  ))}
                </Pie>
              </PieChart>
            </Col>
          </Row>
          <Row className="validate">
            <Col lg="10">
              <h2 className="text-success">Validation de la cargaison</h2>
              <p className="text-light mb-0">
                En pressant ce bouton, vous validez la réception et le bon état de la transaction.
              </p>
              <span className="font-italic text-muted">
                Les informations seront ensuite enregistrées dans la blockchain pour assurer leur
                authenticité.
              </span>
            </Col>
            <Col lg="2">
              <Link to="/" className="btn btn-lg btn-success btn-validate">
                Validate
              </Link>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  if (index !== 0) {
    return <text />;
  }
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

Transaction.propTypes = {
  txid: PropTypes.string,
};

Transaction.defaultProps = {
  txid: '',
};

export default Transaction;
