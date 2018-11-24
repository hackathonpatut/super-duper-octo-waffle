import React, { Component } from 'react';
import { Flag, Button, Dimmer, Loader, Divider, Icon, Dropdown } from 'semantic-ui-react';
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
    isChoicesVisible: false,
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
            score: product.sustainability.score,
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
            score: product.health.score,
          })).filter(p => p.ean !== ean).slice(0, Math.min(matching.health.length, 3));

          this.setState({
            code: ean,
            name,
            price: price.value,
            image,
            sustainabilityChoices,
            healthChoices,
            country: {
              name: origin.country,
              id: origin.id,
            },
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

  toggleAlternatives = () => {
    this.setState({
      isChoicesVisible: !this.state.isChoicesVisible,
    })
  }

  render() {
    if (this.state.code === -1) return <p>Product not found</p>;
    if (this.state.code === null) return (
      <div className="loader">
        <Dimmer active inverted>
          <Loader>Loading...</Loader>
        </Dimmer>
      </div>
    );

    const ean = this.props.match.params.ean;

    return (
      <div className="product-info">
        <div className="product-header">
          <div className="image-wrapper">
            <img src={`${this.state.image || "http://placehold.it/200x200"}`} />
          </div>
          <div className="product-meta">
            <h3>{this.state.name}</h3>
            <span>Origin: <Flag name={this.state.country.id.toLowerCase()} />{this.state.country.name}</span>
          </div>
          <p className="product-price">{this.state.price}€</p>
        </div>
        <Divider />

        {
          /*
          <Dropdown text='See alternative products' icon='like' floating labeled button className='icon'>
            <Dropdown.Menu>
              <Dropdown.Header icon='tree' content='More sustainable' />
              <Dropdown.Item>Important</Dropdown.Item>
              <Dropdown.Item>Announcement</Dropdown.Item>
              <Dropdown.Item>Discussion</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Header icon='like' content='More healthy' />
              <Dropdown.Item>Important</Dropdown.Item>
              <Dropdown.Item>Announcement</Dropdown.Item>
              <Dropdown.Item>Discussion</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          */
        }

        <Button className="check-options" secondary onClick={() => this.toggleAlternatives()}>
          {`${this.state.isChoicesVisible ? 'Hide' : 'See'} alternative products`}
        </Button>
        {this.state.isChoicesVisible &&
          <React.Fragment>
            {this.state.sustainabilityChoices && this.state.sustainabilityChoices.length > 0 && 
              <SuggestionList
                title="Be more sustainable!"
                data={this.state.sustainabilityChoices}
                colorMapper={this.distanceToColor}
                handleItemClick={this.handleSuggestionClick}
              />
            }
            {this.state.healthChoices && this.state.healthChoices.length > 0 && 
              <SuggestionList
                title="Be more healthy!"
                data={this.state.healthChoices}
                colorMapper={this.healthToColor}
                handleItemClick={this.handleSuggestionClick}
              />
            }
          </React.Fragment>
        }
        <div className="product-button-row">
          <Button.Group>
            <Button icon>
              <Icon name='minus' />
            </Button>
            <Button disabled>1</Button>
            <Button icon>
              <Icon name='plus' />
            </Button>
          </Button.Group>
          <Button className="add-cart" primary icon labelPosition='right'>
            Add to cart
            <Icon name='cart plus' />
          </Button>
        </div>
        <Divider />
      </div>
    );
  }
}

export default withRouter(Product);