import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import "./HomeTodo.scss";
import { getAllTodo, addTodo, editTodo, deleteTodo } from "../../services/todoServices";
import { toast } from 'react-toastify';

class HomeTodo extends Component {

    OK = 'OK'

    constructor(props) {
        super(props);
        this.state = {
            todoList: [],
            content: '',
            date: '',
            edit: false,
            idTodo: ''
        }
    }

    async componentDidMount() {
        await this.getAllTodos();
    }

    getAllTodos = async () => {
        try {
            let response = await getAllTodo(this.props.userInfo.id);
            if (response.message == this.OK) {
                this.setState({
                    todoList: response.data.items
                })
            }

        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data.message);
            }
            else {
                toast.error("Network error!");
            }
        }
    }

    handleOnChange = (event, id) => {
        const oldState = { ...this.state };
        oldState[id] = event.target.value;
        this.setState({
            ...oldState
        });
    }

    handleCallApi = async () => {
        if (!this.state.edit) {
            // Add
            await this.handleAddTodo();
        }
        else {
            // Edit
            await this.handleEditTodo();
        }
    }

    handleAddTodo = async () => {

        if (this.state.content == '') {
            toast.error("You have to type something!");
        }
        else if (this.state.date == '') {
            toast.error("You have to choose date!");
        }
        else {
            const todo = {
                app_user_id: this.props.userInfo.id,
                content: this.state.content,
                date: this.state.date,
            }

            try {
                const response = await addTodo(todo);
                if (response) {
                    if (response.message == this.OK) {
                        await this.getAllTodos();
                        this.setState({
                            content: '',
                            date: ''
                        })
                    }
                }

            } catch (error) {
                if (error.response && error.response.data) {
                    toast.error(error.response.data.message);
                }
                else {
                    toast.error("Network error!");
                }
            }
        }
    }

    handleEditBtn = async (item) => {
        const date = new Date(item.date);
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        this.setState({
            edit: true,
            content: item.content,
            date: date.toISOString().slice(0, 16),
            idTodo: item.id
        });
    }

    handleEditTodo = async () => {
        let { idTodo, content, date } = this.state;
        const todo = {
            id: idTodo,
            content,
            date
        }

        try {
            const response = await editTodo(idTodo, todo);
            if (response) {
                if (response.message == this.OK) {
                    toast.success("Update success!");
                    await this.getAllTodos();
                    this.setState({
                        edit: false,
                        content: '',
                        date: ''
                    })
                }
                else {
                    toast.error(response.message);
                }
            }
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data.message);
            }
            else {
                toast.error("Network error!");
            }
        }
    }

    handleDelete = async (id) => {
        try {
            const response = await deleteTodo(id);
            if (response) {
                if (response.message == this.OK) {
                    toast.success("Delete success!");
                    await this.getAllTodos();
                }
                else {
                    toast.error(response.message);
                }
            }
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data.message);
            }
            else {
                toast.error("Network error!");
            }
        }
    }


    render() {
        let todoList = this.state.todoList;
        return (
            <>
                <div>
                    <div className="cnt">
                        <div className="wrapper align-items-center justify-content-between wm-100">
                            <div className="info d-flex flex-column wm-100">
                                <div className="ip rounded" style={{ marginBottom: '32px' }}>
                                    <div className="form-group mb-16">
                                        <label className='titleInput' htmlFor="content"><FormattedMessage id="table.content" /></label>
                                        <input
                                            type="text"
                                            value={this.state.content}
                                            className="form-control text-muted"
                                            id="content"
                                            placeholder="Nội Dung"
                                            name="content"
                                            onChange={(event) => this.handleOnChange(event, "content")}
                                        />
                                    </div>
                                    <div className="form-group ">
                                        <label className='titleInput' htmlFor="time"><FormattedMessage id="table.deadline" /></label>
                                        <input
                                            type="datetime-local"
                                            value={this.state.date}
                                            className="form-control text-muted"
                                            id="time"
                                            name="time"
                                            onChange={(event) => this.handleOnChange(event, "date")}
                                        />
                                    </div>
                                </div>
                                <div className="bt">
                                    <button onClick={() => this.handleCallApi()} id="submitbtn" type="submit" className="form-control btn-color" >{this.state.edit ? "Sửa" : "Thêm"}</button>
                                </div>
                            </div>
                            <div className="todo d-flex flex-column justify-content-between">
                                <div className="tbl table-responsive">
                                    <table className="table">
                                        <thead className="title">
                                            <tr>
                                                <th><FormattedMessage id="table.id" /></th>
                                                <th><FormattedMessage id="table.content" /></th>
                                                <th><FormattedMessage id="table.deadline" /></th>
                                                <th style={{ borderTopRightRadius: '18px' }}><FormattedMessage id="table.actions" /></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                todoList && todoList.map((item, index) => {
                                                    const d = new Date(item.date);
                                                    return (
                                                        <tr key={`${index}-${item.id}`}>
                                                            <td>{index + 1}</td>
                                                            <td>{item.content}</td>
                                                            <td>{d.toLocaleDateString() + " " + d.toLocaleTimeString()}</td>
                                                            <td className="tdbtn">
                                                                <button onClick={() => this.handleEditBtn(item)} className="btnfix"><i className="far fa-edit"></i></button>
                                                                <button onClick={() => this.handleDelete(item.id)}><i className="fas fa-trash-alt"></i></button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </>

        )
    }

}

const mapStateToProps = state => {
    return {
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeTodo);
