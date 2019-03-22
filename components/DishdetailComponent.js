import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList,
  StyleSheet,  
  Switch,
  Button,
  Modal, } from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { DISHES } from '../shared/dishes';
import { COMMENTS } from '../shared/comments';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postComment } from '../redux/ActionCreators';

const mapDispatchToProps = dispatch => ({
  postComment: (dishId, author, rating, comment) =>
  dispatch(postComment(dishId, author, rating, comment))
});

const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    comments: state.comments,
  };
};

function RenderDish(props) {
  const dish = props.dish;

  if (dish != null) {
    return (
      <Card featuredTitle={dish.name} image={{ uri: baseUrl + dish.image }}>
        <Text style={{ margin: 10 }}>{dish.description}</Text>
        <View style= {styles.formRow}>
          <Icon          
            raised
            reverse
            name={props.favorite ? 'heart' : 'heart-o'}
            type="font-awesome"
            color="#f50"
            onPress={() =>
              props.favorite ? console.log('Already favorite') : props.onPress()
            }
          />
          <Icon
            raised            
            reverse
            name={'edit'}
            type="font-awesome"
            color="#512DA8"
            onPress={() => props.toggleModal()}
          />
        </View>
      </Card>
    );
  } else {
    return <View />;
  }
}

function RenderComments(props) {
  const comments = props.comments;

  const renderCommentItem = ({ item, index }) => {
    return (
      <View key={index} style={{ margin: 12 }}>
        <Text style={{ fontSize: 14 }}>{item.comment}</Text>        
        <Rating          
          style = {{marginRight: 'auto'}}
          imageSize={10}
          readonly
          startingValue={item.rating}          
        />
        <Text style={{ fontSize: 12 }}>
          {'-- ' + item.author + ', ' + item.date}{' '}
        </Text>
      </View>
    );
  };

  return (
    <Card title="Comments">
      <FlatList
        data={comments}
        renderItem={renderCommentItem}
        keyExtractor={item => item.id.toString()}
      />
    </Card>
  );
}

class Dishdetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dishes: DISHES,
      comments: COMMENTS,
      showModal: false,
      favorites: [],
      feedback: "",
      author: "",
      rating: 3
    };
  }

  markFavorite(dishId) {
    this.setState({ favorites: this.state.favorites.concat(dishId) });
  }

  static navigationOptions = {
    title: 'Dish Details',
  };

  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  handleFeedback(dishId) {
    this.props.postComment(dishId, this.state.author, this.state.rating, this.state.feedback);
    console.log('HandleFeedbak values: ' + JSON.stringify(this.state));    
    this.setState({ showModal: !this.state.showModal });
  }  
  
  resetFeedback() {
    this.setState({
      feedback: "",
      author: "",
      rating: 3      
    });
    
  }

  render() {
    const dishId = this.props.navigation.getParam('dishId', '');
    return (
      <ScrollView>
        <RenderDish
          dish={this.props.dishes.dishes[+dishId]}
          favorite={this.state.favorites.some(el => el === dishId)}
          onPress={() => this.markFavorite(dishId)}
          handleFeedback={() => this.handleFeedback(dishId)}
          toggleModal={() => this.toggleModal()}
        />
        <RenderComments
          comments={this.props.comments.comments.filter(
            comment => comment.dishId === dishId
          )}
        />
        <Modal
          animationType={'slide'}
          transparent={false}
          visible={this.state.showModal}
          onDismiss={() => this.toggleModal()}
          onRequestClose={() => this.toggleModal()}>
          <View style={styles.modal}>            
            <Rating              
                ratingCount={5}
                imageSize={50}
                showRating
                onFinishRating={(e) => this.setState({ rating : e})}                
              />
              <Input
                placeholder='Author'
                leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                onChangeText={(author) => this.setState({author})}                
              />
              <Input
                placeholder='Feedback'
                leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
                onChangeText={(feedback) => this.setState({feedback})}
              /><Text>{'\n'}</Text>
              <Button
                onPress={() => {
                  this.handleFeedback(dishId);                   
                }}
                color="#512DA8"
                title="Submit"
              /><Text>{'\n'}</Text>
              <Button
                onPress={() => {                  
                  this.resetFeedback();
                  this.toggleModal();                  
                }}
                color="#A9A9A9"
                title="Cancel"
              />   
          </View>
        </Modal>
      </ScrollView>
    );
  } 
}

const styles = StyleSheet.create({
  formRow: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',
    margin: 20,
  },
  formLabel: {
    fontSize: 18,
    flex: 2,
  },
  formItem: {
    flex: 1,
  },
  modal: {
    justifyContent: 'center',
    margin: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: '#512DA8',
    textAlign: 'center',
    color: 'white',
    marginBottom: 20,
  },
  modalText: {
    fontSize: 18,
    margin: 10,
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);
