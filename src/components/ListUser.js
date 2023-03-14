import React, { Component } from "react";
import { Table, Modal, Form, Input, message, Button } from "antd";
import axios from "axios";

class ListUser extends Component {
    //Init
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.state = {
            data: [],
            loading: false,
            visible: false,
            confirmLoading: false,
            formType: "add",
            currentRecord: null,
        };
    }

    columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Phone",
            dataIndex: "phone",
            key: "phone",
        },
        {
            title: "Action",
            key: "action",
            render: (text, record) => (
                <span>
                    <Button
                        type="link"
                        onClick={() => this.handleEditUser(record)}
                    >
                        Edit
                    </Button>
                    <Button
                        type="link"
                        danger
                        onClick={() => this.handleDeleteUser(record)}
                    >
                        Delete
                    </Button>
                </span>
            ),
        },
    ];

    // Get User
    componentDidMount() {
        this.fetchData();
    }

    fetchData = () => {
        this.setState({ loading: true });
        axios
            .get("https://jsonplaceholder.typicode.com/users")
            .then((response) => {
                const data = response.data;
                this.setState({ data, loading: false });
            });
    };

    // handle CRUD
    handleAddUser = () => {
        this.setState({ visible: true, formType: "add", currentRecord: null });
    };

    handleEditUser = (record) => {
        this.setState({
            visible: true,
            formType: "edit",
            currentRecord: record,
        });

        setTimeout(() => {
            if (this.formRef.current) {
                this.formRef.current.setFieldsValue(record);
            }
        });
    };

    handleDeleteUser = (record) => {
        Modal.confirm({
            title: "Chắc chắn xóa",
            onOk: () => {
                axios
                    .delete(
                        `https://jsonplaceholder.typicode.com/users/${record.id}`,
                    )
                    .then(() => {
                        const data = [...this.state.data];
                        const index = data.findIndex((d) => d.id === record.id);
                        data.splice(index, 1);
                        this.setState({ data });
                        message.success("Đã xóa User");
                    });
            },
            onCancel() {},
        });
    };

    handleOk = () => {
        const form = this.formRef.current;
        form.validateFields().then((values) => {
            const { formType, currentRecord } = this.state;
            const data = {
                ...values,
                id: currentRecord ? currentRecord.id : null,
            };
            this.setState({ confirmLoading: true });
            if (formType === "add") {
                axios
                    .post("https://jsonplaceholder.typicode.com/users", data)
                    .then((response) => {
                        const { id } = response.data;
                        this.setState((prevState) => ({
                            data: [...prevState.data, { ...data, id }],
                            visible: false,
                            confirmLoading: false,
                        }));
                        message.success("Đã thêm User");
                    });
            } else {
                axios
                    .put(
                        `https://jsonplaceholder.typicode.com/users/${data.id}`,
                        data,
                    )
                    .then(() => {
                        const updatedData = this.state.data.map((d) =>
                            d.id === data.id ? data : d,
                        );
                        this.setState({
                            data: updatedData,
                            visible: false,
                            confirmLoading: false,
                        });
                        message.success("Đã update User");
                    });
            }
            form.resetFields();
        });
    };

    handleCancel = () => {
        this.setState({ visible: false });
    };

    render() {
        const { data, loading, visible, confirmLoading, formType } = this.state;
        return (
            <div>
                <h1 style={{ margin: "0 0 0 10px" }}>List User</h1>
                <Button
                    type="primary"
                    size="medium"
                    onClick={this.handleAddUser}
                    style={{
                        display: "flex",
                        marginBottom: "20px",
                    }}
                >
                    Add User
                </Button>
                <Table
                    dataSource={data}
                    columns={this.columns}
                    loading={loading}
                    pagination={{ pageSize: 6 }}
                    bordered
                />
                <Modal
                    title={formType === "add" ? "Add User" : "Edit User"}
                    open={visible}
                    onOk={this.handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                >
                    <Form
                        ref={this.formRef}
                        layout="horizontal"
                        labelCol={{ span: 4 }}
                    >
                        <Form.Item
                            name="name"
                            label="Name"
                            rules={[
                                {
                                    required: true,
                                    message: "Nhập name",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                {
                                    required: true,
                                    message: "Nhập email",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="phone"
                            label="Phone"
                            rules={[
                                {
                                    required: true,
                                    message: "Nhập phone number",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default ListUser;
