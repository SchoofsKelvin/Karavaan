import React from 'react';
import { connect } from 'react-redux';

import {
  Form,
  Item,
  Label,
  Input,
} from 'native-base';

import Prompt from './prompt';

const STYLE_RED = { color: 'red' };

class NewCurrencyPrompt extends Prompt {
  constructor(props) {
    super(props);
    this.props.onSubmit = () => this.close();
    this.props.onCancel = () => this.close();
    this.state = { tag: '', name: '' };
    this.input_tag = '';
  }
  componentDidMount() {
    if (this.props.onRef) this.props.onRef(this);
  }
  componentWillUnmount() {
    if (this.props.onRef) this.props.onRef(undefined);
  }
  get tag() {
    return this.state.tag.toUpperCase();
  }
  get name() {
    return this.state.name.trim();
  }
  renderContent() {
    const tagStyle = this.tag ? {} : STYLE_RED;
    const nameStyle = this.name ? {} : STYLE_RED;
    return (
      <Form>
        <Item floatingLabel error={tagStyle == STYLE_RED}>
          <Label>Tag</Label>
          <Input value={this.state.tag} onChangeText={tag => this.setState({ tag })} autoFocus />
        </Item>
        <Item floatingLabel error={nameStyle == STYLE_RED}>
          <Label>Name</Label>
          <Input value={this.state.name} onChangeText={name => this.setState({ name })} />
        </Item>
      </Form>);
  }
}

function mapStateToProps() {
  return {};
}
function mapDispatchToProps(dispatch) {
  return {
    pickExpenseEntry(index: number) {
      dispatch(SelectExpenseEntry(index));
    },
    deleteEntry(index: number) {
      dispatch(DeleteExpenseEntry(index));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewCurrencyPrompt);
