import React, { Component } from "react";
import { Button, Input, Menu, Dropdown, Icon, List, Collapse } from "antd";
import "./styles/Module.css";
import { connect } from "react-redux";
import { saveHashtags } from "../actions/hashtags_actions";

const Panel = Collapse.Panel;

class Module extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "#",
      combos: [],
      comboValue: "Выбрать комбо",
      newComboValue: "",
      edit: false,
      editHashtags: []
    };
  }

  count = 0;

  componentWillMount = () => {
    this.createCombosList(this.props.hashtagsList);
  };

  createCombosList = list => {
    const combos = Object.keys(list);
    this.setState({ combos });
  };

  renderDropdownItem = (item, index) => {
    this.count++;
    if (item !== "") {
      return (
        <Menu.Item
          onClick={this.addWithCombo.bind(this, index)}
          key={this.count}
        >
          {this.state.combos[index]}
        </Menu.Item>
      );
    }
  };

  renderTreeItem = comboTitle => {
    this.count++;
    const title = (
      <div className="comboTitle">
        {comboTitle}
        <Icon
          type="edit"
          className="comboEditIcon"
          onClick={this.editCombo.bind(this, comboTitle)}
        />
        <Icon
          type="delete"
          className="comboDeleteIcon"
          onClick={this.deleteCombo.bind(this, comboTitle)}
        />
      </div>
    );
    if (comboTitle === "") return;
    return (
      <Panel header={title} key={this.count}>
        <List
          className="smallList"
          size="small"
          bordered
          dataSource={this.props.hashtagsList[comboTitle]}
          renderItem={item => (
            <List.Item className="listItem">
              {item}
              <Icon
                className="editIcon"
                type="edit"
                theme="outlined"
                onClick={this.editItem.bind(this, item, comboTitle)}
              />
              <Icon
                className="deleteIcon"
                type="delete"
                theme="outlined"
                onClick={this.deleteItem.bind(this, item, comboTitle)}
              />
            </List.Item>
          )}
        />
      </Panel>
    );
  };

  addWithCombo = index => {
    this.setState({ comboValue: this.state.combos[index] });
  };

  addWithoutCombo = () => {
    this.setState({ comboValue: "Выбрать комбо" });
  };

  addHashtag = () => {
    if (this.state.inputValue === "#") return;
    else if (this.state.comboValue === "Выбрать комбо") {
      this.props.hashtagsList[""].push(this.state.inputValue);
    } else {
      this.props.hashtagsList[this.state.comboValue].push(
        this.state.inputValue
      );
    }

    this.setState({ inputValue: "#" });
    this.setState({ comboValue: "Выбрать комбо" });
  };

  addCombo = e => {
    if (e.key === "Enter" || e.which === 13) {
      let hashtagsList = Object.assign({}, this.props.hashtagsList);
      if (this.state.edit === false) {
        hashtagsList[this.state.newComboValue] = [];
      } else {
        hashtagsList[this.state.newComboValue] = this.state.editHashtags;
        this.setState({comboHashtags: []})
      }
      this.props.saveHashtags(hashtagsList);
      this.setState({ newComboValue: "" }, () => {
        this.createCombosList(hashtagsList);
      });
    }
  };

  handleHashtagChange = e => {
    this.setState({ inputValue: e.target.value });
    if (e.target.value[0] !== "#") {
      this.setState({ inputValue: "#" });
    }
  };

  handleComboChange = e => {
    this.setState({ newComboValue: e.target.value });
  };

  deleteItem = (item, comboTitle) => {
    let hashtagsList = Object.assign({}, this.props.hashtagsList);
    hashtagsList[comboTitle].splice(hashtagsList[comboTitle].indexOf(item), 1);
    this.props.saveHashtags(hashtagsList);
  };

  deleteCombo = comboTitle => {
    let hashtagsList = Object.assign({}, this.props.hashtagsList);
    delete hashtagsList[comboTitle];
    this.props.saveHashtags(hashtagsList);
    this.createCombosList(hashtagsList);
  };

  editItem = (item, comboTitle) => {
    this.deleteItem(item, comboTitle);
    this.setState({ inputValue: item, comboValue: comboTitle });
    if (comboTitle === "") this.setState({ comboValue: "Выбрать комбо" });
  };

  editCombo = comboTitle => {
    this.setState({ edit: true });
    let comboHashtags = [...this.props.hashtagsList[comboTitle]];
    this.setState({
      newComboValue: comboTitle,
      editHashtags: comboHashtags
    });
    this.deleteCombo(comboTitle);
  };

  render() {
    const menu = (
      <Menu>
        {this.state.combos.map(this.renderDropdownItem)}
        <Menu.Item key={this.count} onClick={this.addWithoutCombo}>
          Добавить без комбо
        </Menu.Item>
      </Menu>
    );

    const data = this.props.hashtagsList[""];

    return (
      <div className="Module">
        <Input
          className="input"
          value={this.state.inputValue}
          onChange={this.handleHashtagChange}
        />

        <Dropdown overlay={menu} className="dropdown">
          <a className="ant-dropdown-link">
            {this.state.comboValue} <Icon type="down" />
          </a>
        </Dropdown>

        <Button type="primary" className="button" onClick={this.addHashtag}>
          Добавить
        </Button>
        <Input
          placeholder="Создать новое комбо"
          value={this.state.newComboValue}
          onChange={this.handleComboChange}
          onKeyDown={this.addCombo}
          className="comboInput"
        />
        <div className="box">
          <List
            className="list"
            size="small"
            header={<div>Хештеги без комбо</div>}
            bordered
            dataSource={data}
            renderItem={item => (
              <List.Item className="listItem">
                {item}
                <Icon
                  className="editIcon"
                  type="edit"
                  theme="outlined"
                  onClick={this.editItem.bind(this, item, "")}
                />
                <Icon
                  className="deleteIcon"
                  type="delete"
                  theme="outlined"
                  onClick={this.deleteItem.bind(this, item, "")}
                />
              </List.Item>
            )}
          />

          <Collapse accordion className="collapse">
            {this.state.combos.map(this.renderTreeItem)}
          </Collapse>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  hashtagsList: state.hashtags.hashtagsList
});

const mapDispatchToProps = {
  saveHashtags
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Module);
