import React, { Component } from 'react';
import { Button, Card, Image, Dimmer, Loader, Statistic, Divider } from 'semantic-ui-react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import SuggestionList from './SuggestionList';

class Product extends Component {
  state = {
    code: null,
    name: null,
    price: null,
    segment: null,
    sustainability: null,
    health: null,
    country: {
      name: null,
      id: null,
    },
    sustainabilityChoices: [],
    healthChoices: [],
  };

  getData = (ean) => {
    axios
      .get(`/product/${ean}`)
      .then(response => {
        if (response.data.code === -1) {
          // 404
          this.setState({ code: -1 });
        } else {
          console.log(response);
          const { name, price, image, matching, origin, sustainability, health } = response.data;

          const sustainabilityChoices = matching.sustainability.map(product => ({
            ean: product.ean,
            name: product.name,
            image: product.image,
            country: {
              name: product.origin.country,
              id: product.origin.id,
            },
            price: product.price.value,
            score: product.distance, // FIXME:
          })).filter(p => p.ean !== ean).slice(0, Math.min(matching.sustainability.length, 3));

          const healthChoices = matching.health.map(product => ({
            ean: product.ean,
            name: product.name,
            image: product.image,
            country: {
              name: product.origin.country,
              id: product.origin.id,
            },
            price: product.price.value,
            score: product.health.score, // FIXME:
          })).filter(p => p.ean !== ean).slice(0, Math.min(matching.health.length, 3));

          this.setState({
            code: ean,
            name,
            price: price.value,
            image,
            sustainabilityChoices,
            healthChoices,
            country: origin.country,
            sustainability: sustainability.score,
            health: health.score,
          });
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({ code: null });
      });
  }

  componentDidMount() {
    const ean = this.props.match.params.ean;
    if (ean) this.getData(ean);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.ean && nextProps.match.params.ean && 
      nextProps.match.params.ean !== this.props.match.params.ean) {
      this.setState({ code: null });
      this.getData(nextProps.match.params.ean);
    }
  }

  addToCart = () => {
    this.props.addToCart({
      name: this.state.name,
      price: this.state.price,
    });
  }

  healthToColor = (score) => {
    if (score < -100) return 'red';
    if (score < -50) return 'orange';
    return 'green';
  }

  distanceToColor = (score) => {
    if (score < 300) return 'green';
    if (score < 1000) return 'orange';
    return 'red';
  }

  handleSuggestionClick = (ean) => {
    this.props.handleSuggestionClick(ean);
  }

  render() {
    if (this.state.code === -1) return <p>Product not found</p>;
    if (this.state.code === null) return (
      <div className="product-card">
        <Card>
          <div style={{minHeight: '300px'}}>
            <Dimmer active inverted>
              <Loader>Loading...</Loader>
            </Dimmer>
          </div>
          <Card.Content>
            <Card.Header>Loading...</Card.Header>
          </Card.Content>
        </Card>
      </div>
    );

    const ean = this.props.match.params.ean;

    return (
      <div className="product-card">
        <Card>
          <Image size="small" centered src={`${this.state.image || "http://placehold.it/200x200"}`} />
          <Card.Content>
            <Card.Header>{this.state.name}</Card.Header>
            <Card.Meta className="infotext">
              <span>{`EAN: ${ean}` || 'EAN: XXX'}</span>
              <span>{this.state.price} €</span>
            </Card.Meta>
            <Card.Meta>
              <span>{`Origin: ${this.state.country}`}</span>
            </Card.Meta>
            <Card.Description>
              <Statistic.Group size="small">
                <Statistic color={this.distanceToColor(this.state.sustainability)}>
                  <Statistic.Value>{this.state.sustainability}</Statistic.Value>
                  <Statistic.Label>Sustainability</Statistic.Label>
                </Statistic>
                <Statistic color={this.healthToColor(this.state.health)}>
                  <Statistic.Value>{this.state.health}</Statistic.Value>
                  <Statistic.Label>Health</Statistic.Label>
                </Statistic>
              </Statistic.Group>
              <Divider />
              <SuggestionList
                title="Be more sustainable!"
                data={this.state.sustainabilityChoices}
                colorMapper={this.distanceToColor}
                handleItemClick={this.handleSuggestionClick}
              />
              <Divider />
              <SuggestionList
                title="Be more healthy!"
                data={this.state.healthChoices}
                colorMapper={this.healthToColor}
                handleItemClick={this.handleSuggestionClick}
              />
            </Card.Description>
          </Card.Content>
        </Card>
        <Button onClick={this.addToCart}>Lisää koriin</Button>
      </div>
    );
  }
}

export default withRouter(Product);