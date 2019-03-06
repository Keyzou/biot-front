import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Form, Input, Row, Col, Button } from 'reactstrap';
import axios from 'axios';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';

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
    this.validateTransaction = this.validateTransaction.bind(this);
    this.state = { txID: props.match.params.txid, shipment: null };
    this.getShipmentInfo(props.match.params.txid, props.match.params.email);
  }

  async getShipmentInfo(txid, email) {
    const promise = [];
    promise.push(
      axios.get('http://localhost:3001/api/org.acme.beer.Contract'),
      axios.get('http://localhost:3001/api/org.acme.beer.Brewer'),
      axios.get('http://localhost:3001/api/org.acme.beer.Shipment'),
      axios.get('http://localhost:3001/api/org.acme.beer.Importer'),
    );
    let state = {};
    const results = await axios.all(promise);
    let data = results[0].data.filter(
      c =>
        c.shipment === `resource:org.acme.beer.Shipment#${txid}` &&
        (c.importer === `resource:org.acme.beer.Importer#${email}` ||
          c.shipper === `resource:org.acme.beer.Shipper#${email}`),
    );

    state = { ...state, contracts: data };
    console.log(state);

    data = results[1].data.filter(
      b => b.email === state.contracts[state.contracts.length - 1].brewer.split('#')[1],
    );

    state = { ...state, brewers: data };

    data = results[2].data.filter(b => b.shipmentId === txid);

    state = { ...state, infos: data[0] };

    data = results[3].data.filter(b => b.email === email);

    state = { ...state, importer: data[0] };
    this.setState({ shipment: state });
    console.log(this.state);
    return results;
  }

  validateTransaction() {
    const { shipment } = this.state;
    const data = {
      $class: 'org.acme.beer.ShipmentRecu',
      contract: `resource:org.acme.beer.Contract#${
        shipment.contracts[shipment.contracts.length - 1].contratId
      }`,
      id_credite: shipment.contracts[shipment.contracts.length - 1].shipper.split('#')[1],
      timestamp: moment().format(),
    };

    console.log(data);
    axios
      .post('http://localhost:3001/api/org.acme.beer.ShipmentRecu', data)
      .then(r => {
        if (r.status === 200) {
          toast.success('La réception a bien été validée !', {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
          this.setState({
            ...this.state,
            shipment: { ...shipment, infos: { ...shipment.infos, statut: 'ARRIVED' } },
          });
        } else {
          console.log(r);
          toast.error('Une erreur est survenue !', {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
        }
      })
      .catch(error => {
        toast.error('Une erreur est survenue !', {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        console.log(error.data);
      });
  }

  render() {
    const colorMap = {
      CREATED: '#777',
      IN_TRANSIT: '#ed7d31',
      ARRIVED: '#218838',
      DELAYED: '#dc3545',
    };
    const humidity = [{ name: 'Humidity', value: 59.5 }, { name: '', value: 100 - 59.5 }];
    const { txID, shipment } = this.state;
    const oldData = [];
    let data = [];
    let diff = 0;
    if (shipment) {
      shipment.infos.lectureTemperature.forEach((t, i) => {
        const date = new Date(t.timestamp);
        oldData.push({
          name: `${i}`,
          temperature: t.celsius,
          date: date.getTime(),
        });
      });
      data = oldData.sort((a, b) => {
        console.log(a.date > b.date);
        return a.temperature < b.temperature;
      });
      diff = moment.duration(
        moment(shipment.contracts[shipment.contracts.length - 1].arriverDateTime).diff(
          moment('2019-02-11T00:00:00.641Z'),
        ),
      );
    }
    const panel = !shipment ? (
      <Container>
        <div className="text-center">
          <FontAwesomeIcon icon="spinner" spin />
        </div>
      </Container>
    ) : (
      <Container className="transaction">
        <ToastContainer />
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
              <Link to={`/transaction/${txID}`} className="btn btn-send" color="primary" size="lg">
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
                <span className="value">{shipment.brewers[0].libelle}</span>
              </Col>
              <Col lg="6" className="info d-flex flex-column text-right">
                <span className="name">Importer</span>
                <span className="value">{shipment.importer.libelle}</span>
              </Col>
            </Row>
            <Row>
              <Col lg="6" className="info info-loc d-flex flex-column">
                <span className="name">From</span>
                <span className="value">{shipment.contracts[0].depart}</span>
              </Col>
              <Col lg="6" className="info info-loc d-flex flex-column text-right">
                <span className="name">To</span>
                <span className="value">{shipment.contracts[0].arrive}</span>
              </Col>
            </Row>
            <Row>
              <Col lg="6" className="info d-flex flex-column">
                <span className="name">Unit</span>
                <span className="value">{shipment.infos.unitCount}</span>
              </Col>
              <Col lg="6" className="info d-flex flex-column text-right">
                <span className="name">Price</span>
                <span className="value">
                  {shipment.contracts[0].unitPrice * shipment.infos.unitCount}€
                </span>
              </Col>
            </Row>
            <Row>
              <Col lg="6" className="info d-flex flex-column">
                <span className="name">Penality</span>
                <span className="value">0€</span>
              </Col>
              <Col lg="6" className="info d-flex flex-column text-right">
                <span className="name">Penality</span>
                <span className="value">0€</span>
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
              <CartesianGrid stroke="rgba(255,255,255,0.2)" />
              <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
            </LineChart>
          </Col>
        </Row>
        <Row className="dashboard">
          <Col lg={{ offset: 3, size: 5 }} className="category">
            <h2 className="text-center">
              Status step &#34;{shipment.contracts[shipment.contracts.length - 1].etape}&#34;
            </h2>
            <Row className="status">
              <Col lg="5" className="status-info">
                <div className="entry">
                  <FontAwesomeIcon icon="flag" size="2x" style={{ color: '#256637' }} />
                  <div className="entry-info">
                    <span className="value">{moment(new Date('02/11/2019')).format('MMM DD')}</span>
                  </div>
                </div>
                <div className="entry">
                  <FontAwesomeIcon icon="flag-checkered" size="2x" />
                  <div className="entry-info">
                    <span className="value">
                      {moment(
                        shipment.contracts[shipment.contracts.length - 1].arriverDateTime,
                      ).format('MMM DD')}
                    </span>
                  </div>
                </div>

                <div className="entry">
                  <FontAwesomeIcon
                    icon="circle"
                    size="2x"
                    style={{ color: colorMap[shipment.infos.statut] }}
                  />
                  <div className="entry-info">
                    <span className="value">{shipment.infos.statut.replace('_', ' ')}</span>
                  </div>
                </div>
              </Col>
              <Col lg="4" className="delay-container">
                <div className="duration">
                  {moment.utc(diff.asMilliseconds()).format('HH:mm:ss')}
                </div>
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
            <Button
              onClick={this.validateTransaction}
              color="success"
              bsSize="lg"
              className="btn-validate"
            >
              Validate
            </Button>
          </Col>
        </Row>
      </Container>
    );
    return <>{panel}</>;
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
      {`${percent * 100}`}
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
