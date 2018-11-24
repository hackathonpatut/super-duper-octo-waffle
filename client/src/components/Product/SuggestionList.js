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
              <List.Header as='a' style={{ display: 'flex', justifyContent: 'space-between'}}>
                <span>{choice.name}</span>
                <span style={{ paddingLeft: 10, width: 30, float: 'right' }}>
                  <Progress value={Math.round(choice.score * 100)} hideText={true} type={type} />
                </span>
              </List.Header>
              <List.Description>
                <span className="choiceInfo">
                    <Flag name={choice.country.id.toLowerCase()} />
                    {`${choice.country.name}, price: ${choice.price} €`}
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
