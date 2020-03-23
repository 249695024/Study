import React, { Component, useState } from 'react';

export interface TodoItem {
  id: number;
  title: string;
  finished: boolean;
}

export interface AddProps {
  handleChange: (value: string) => void;
}

export interface AddState {
  value: string;
}

export class Add extends Component<AddProps, AddState> {
  constructor(props: AddProps) {
    super(props);
    this.state = {
      value: '',
    };
  }

  addNewText = () => {
    let { value } = this.state;
    const { handleChange } = this.props;
    handleChange && handleChange(value);
    this.setState({ value: '' });
  };
  render() {
    return (
      <div>
        添 加 内 容：
        <input
          value={this.state.value}
          onChange={e => this.setState({ value: e.target.value })}
        />
        <button onClick={this.addNewText}>添 加</button>
      </div>
    );
  }
}

export interface ListProps {
  todo: TodoItem[];
  hidden: boolean;
  update: (id: number, title: string, hidden: boolean) => void;
  del: (id: number) => void;
  statusChange: (id: number, finished: boolean) => void;
  onHidden: (hidden: boolean) => void;
  up: (todo: TodoItem) => void;
  under: (todo: TodoItem) => void;
}

export interface ListState {
  id?: number;
  title?: string;
  finished?: boolean;
  hidden: boolean;
}

export class List extends Component<ListProps, ListState> {
  constructor(props: ListProps) {
    super(props);
    this.state = {
      hidden: props.hidden || true,
    };
  }

  statusChange(id: number, finished: boolean) {
    this.props.statusChange && this.props.statusChange(id, finished);
  }

  onUpdate(id1: number, title1: string, hidden1: boolean) {
    console.info(title1);
    const { update } = this.props;
    update && update(id1!, title1!, hidden1);
  }

  onHidden(hidden: boolean) {
    this.props.onHidden && this.props.onHidden(hidden);
  }

  del(id: number) {
    this.props.del && this.props.del(id);
  }

  onUp(todo: TodoItem) {
    this.props.up && this.props.up(todo);
  }

  onUnder(todo: TodoItem) {
    this.props.under && this.props.under(todo);
  }

  render() {
    return (
      <table>
        <thead>
          <tr>
            <th>完成</th>
            <th>待办事项</th>
            <th colSpan={4}>操作</th>
          </tr>
        </thead>
        <tbody>
          {this.props.todo && this.props.todo.length > 0
            ? this.props.todo.map(item => {
                return (
                  <tr key={item.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={item.finished}
                        onChange={e => {
                          this.statusChange(item.id, e.target.checked);
                        }}
                      />
                    </td>
                    <td>
                      <input
                        hidden={!this.props.hidden}
                        type="text"
                        value={item.title}
                        onChange={e => {
                          this.setState({ title: e.target.value });
                        }}
                      />
                      <Update
                        handleChange={(id, title, hidden) => {
                          this.onUpdate(id, title, hidden);
                        }}
                        hidden={this.props.hidden}
                        title={item.title}
                        id={item.id}
                      />
                    </td>
                    <td>
                      <button
                        hidden={!this.props.hidden}
                        onClick={() => {
                          this.onHidden(false);
                        }}
                      >
                        编辑
                      </button>
                    </td>
                    <td>
                      <button onClick={() => this.del(item.id)}>删除</button>
                    </td>
                    <td>
                      <button onClick={() => this.onUp(item)}>上</button>
                    </td>
                    <td>
                      <button onClick={() => this.onUnder(item)}>下</button>
                    </td>
                  </tr>
                );
              })
            : null}
        </tbody>
      </table>
    );
  }
}

export interface UpdateProps {
  handleChange: (id: number, title: string, hidden: boolean) => void;
  hidden: boolean;
  title: string;
  id: number;
}
export interface UpdateState {
  id: number;
  title: string;
  hidden: boolean;
}

export class Update extends Component<UpdateProps, UpdateState> {
  constructor(props: UpdateProps) {
    super(props);
    this.state = {
      id: props.id || 0,
      title: props.title || '',
      hidden: props.hidden || true,
    };
  }
  updateText = () => {
    let { id, title, hidden } = this.state;
    console.info(title);
    const { handleChange } = this.props;
    handleChange && handleChange(id, title, hidden);
  };

  render() {
    return (
      <div hidden={this.props.hidden}>
        <input
          type="text"
          value={this.state.title}
          onChange={e => this.setState({ title: e.target.value, hidden: true })}
        />
        <button onClick={this.updateText}>保 存</button>
      </div>
    );
  }
}

export interface FooterProps {
  onChange: (type: string) => void;
}

export interface FooterState {
  type: string;
}

export class Footer extends Component<FooterProps, FooterState> {
  handleChange(type: string) {
    this.props.onChange && this.props.onChange(type);
  }
  render() {
    return (
      <div>
        <button type="button" onClick={() => this.handleChange('1')}>
          全部
        </button>
        <button type="button" onClick={() => this.handleChange('2')}>
          未完成
        </button>
        <button type="button" onClick={() => this.handleChange('3')}>
          已完成
        </button>
      </div>
    );
  }
}

export interface AppProps {}

export interface AppState {
  todos: TodoItem[];
  type: string;
  hidden: boolean;
}

export class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      todos: [
        { id: 1, title: '面对', finished: false },
        { id: 2, title: '疾风', finished: false },
        { id: 3, title: '吧11', finished: false },
        { id: 4, title: '快乐', finished: false },
      ],
      type: '1',
      hidden: true,
    };
  }

  render() {
    const { todos, type, hidden } = this.state;
    return (
      <div>
        <Add
          handleChange={value =>
            this.setState({
              todos: todos.concat({
                id: todos.length + 1,
                title: value,
                finished: false,
              }),
            })
          }
        />
        <List
          statusChange={(id, finished) => {
            const index = todos.findIndex(it => it.id === id);
            todos[index].finished = finished;
            this.setState({
              todos: todos,
            });
          }}
          update={(id, title, hidden) => {
            const index = todos.findIndex(it => it.id === id);
            todos[index].title = title;
            console.info(title);
            this.setState({
              todos: todos,
              hidden: hidden,
            });
          }}
          del={id => {
            const index = todos.findIndex(it => it.id === id);
            todos.splice(index, 1);
            this.setState({
              todos,
            });
          }}
          hidden={hidden}
          onHidden={hidden => {
            this.setState({
              hidden: hidden,
            });
          }}
          todo={todos.filter(it =>
            type === '1' ? true : type === '2' ? !it.finished : it.finished,
          )}
          up={todo => {
            var arr = this.state.todos.slice();
            const index = todos.findIndex(it => it.id === todo.id);
            if (index != 0) {
              const title = arr[index - 1].title;
              const fin = arr[index - 1].finished;

              arr[index - 1].title = todo.title;
              arr[index - 1].finished = todo.finished;
              todo.title = title;
              todo.finished = fin;
              this.setState({
                todos: arr,
              });
            }
          }}
          under={todo => {
            var arr = this.state.todos.slice();
            const index = todos.findIndex(it => it.id === todo.id);
            if (index < this.state.todos.length - 1) {
              var title = arr[index + 1].title;
              var fin = arr[index + 1].finished;

              arr[index + 1].title = todo.title;
              arr[index + 1].finished = todo.finished;
              todo.title = title;
              todo.finished = fin;
              this.setState({
                todos: arr,
              });
            }
          }}
        />
        <Footer onChange={type => this.setState({ type })} />
      </div>
    );
  }
}
