import React, { Component } from 'react';
import { List, Divider, Button, Label, Icon, Popup, Loader } from 'semantic-ui-react';
import Progress from '../Progress';
import axios from 'axios';

export default class Review extends Component {

  state = {
    comparisons: {
      health: 0,
      sustainability: 0,
    },
    isMobilePay: true,
  }

  getData = () => {
    const { items } = this.props;
    const totalInCart = items.reduce((p, v) => p + v.amount, 0);
    const totalHealth = totalInCart !== 0 ? (items.reduce((p, v) => p + v.amount * v.health, 0)) / totalInCart : 0;
    const totalSustainability = totalInCart !== 0 ? (items.reduce((p, v) => p + v.amount * v.sustainability, 0)) / totalInCart : 0;

    axios
    .post(`/cart-comparison`, {
      data: {
        health: totalHealth,
        sustainability: totalSustainability,
      }
    })
    .then(response => {
      if (response.data.code === -1) {
        console.log('Request failed');
      } else {
        console.log(response);
        this.setState({
          totalHealth,
          totalSustainability,
          comparisons: {
            health: response.data.health,
            sustainability: response.data.sustainability,
          }
        });
      }
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.getData();
    }
  }

  componentDidMount() {
    this.getData();
    window.setTimeout(() => this.setState({ isMobilePay: false }), 5000);
  }

  render() {

    if (this.state.isMobilePay) {
      return <div style={{ background: '#5b7cf7', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, fontSize: 24, color: '#fff', paddingTop: '45%', fontWeight: 'bold', textAlign: 'center', lineHeight: 1.618 }}>
        MobilePay<br/>payment going...
        <Loader active inverted size='large' />
      </div>;
    }

    return (
      <div className="review-info page">
        <h2>HEALTH</h2>
        <div style={{ width: '35%', margin: '1em auto' }}>
          <Progress value={Math.round(this.state.totalHealth * 100)} type="health" />
        </div>
        <Divider />
        <List>
          <List.Item>
            <List.Icon name='close' />
            <List.Content>
              <List.Header>Sustainability info</List.Header>
              <List.Description>
                {Math.round(((1-this.state.comparisons.sustainability) * 100))}% of others were more sustainable than you!
              </List.Description>
            </List.Content>
          </List.Item>
          <Divider />
          <List.Item>
            <List.Icon name='close' />
            <List.Content>
              <List.Header>Quite much sugar</List.Header>
              <List.Description>
                You can choose similar products that would have <strong>44 % less</strong> sugar.
              </List.Description>
            </List.Content>
          </List.Item>
        </List>
        <Divider />
        <Popup trigger={
          <Button as='div' labelPosition='right' className="info-button">
            <Button color='blue'>
              Learn more about healthy choices
            </Button>
            <Label as='a' basic color='blue' pointing='left'>
            <Icon name='heart'/>
            </Label>
          </Button>
        } content="How about buying less soft drinks?" />
        <Divider />
        <h2>SUSTAINABILITY</h2>
        <div style={{ width: '35%', margin: '1em auto' }}>
          <Progress value={Math.round(this.state.totalSustainability * 100)} />
        </div>
        <Divider />
        <List>
          <List.Item>
            <List.Icon name='check' />
            <List.Content>
              <List.Header>Health info</List.Header>
              <List.Description>
                {Math.round(((1 - this.state.comparisons.health) * 100))}% made healthier choices than you!
              </List.Description>
            </List.Content>
          </List.Item>
          <Divider />
          <List.Item>
            <List.Icon name='close' />
            <List.Content>
              <List.Header>Long distance</List.Header>
              <List.Description>
                Average item in your shopping basket was produced <strong>over 2 400 km away</strong>. Try prefering some local food!
              </List.Description>
            </List.Content>
          </List.Item>
        </List>
        <Divider />
        <Popup trigger={
          <Button as='div' labelPosition='right' className="info-button">
            <Button color='green'>
              Learn more about sustainable choices
            </Button>
            <Label as='a' basic color='green' pointing='left'>
            <Icon name='tree'/>
            </Label>
          </Button>
        } content="Buy locally produced goods!" />
      </div>
    );
  }
}
