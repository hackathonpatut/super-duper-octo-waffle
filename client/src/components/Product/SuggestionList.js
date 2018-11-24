import React from 'react';
import { Flag, List } from 'semantic-ui-react';
import Progress from '../Progress';

const SuggestionList = ({
  title,
  data,
  handleItemClick,
  type,
}) => (
  <React.Fragment>
    <h4 className="suggestion-title">{title}</h4>
    <List>
      {data.map((choice, ind) => (
        <React.Fragment key={choice.name}>
          <List.Item onClick={() => handleItemClick(choice.ean)} className="suggestion-list-item">
            <div className="suggestion-image">
              <img style={{ width: 'auto', height: '100%' }} src={`${choice.image || "http://placehold.it/200x200"}`} alt='' />
            </div>
            <List.Content style={{ flexGrow: 1, alignSelf: 'center' }}>
              <List.Header as='a' style={{ display: 'block' }}>
                <span>{choice.name}</span>
                <span style={{ paddingLeft: 10, width: 30, float: 'right' }}>
                  <Progress value={Math.round(choice.sustainabilityScore * 100)} hideText={true} type='sustainability' />
                </span>
                <span style={{ paddingLeft: 10, width: 30, float: 'right' }}>
                  <Progress value={Math.round(choice.healthScore * 100)} hideText={true} type='health' />
                </span>
              </List.Header>
              <List.Description>
                <span className="choiceInfo">
                    {`${choice.price} € `}
                    <Flag name={choice.country.id.toLowerCase()} />
                    {`${choice.country.name}`}
                </span>
              </List.Description>
            </List.Content>
          </List.Item>
        </React.Fragment>
      ))}
    </List>
  </React.Fragment>
);

export default SuggestionList;
