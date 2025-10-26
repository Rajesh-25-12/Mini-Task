import React, { useEffect, useState, useMemo, lazy, Suspense } from 'react';
import {
  Table,
  Card,
  Input,
  Button,
  Space,
  Typography,
  Row,
  Col,
  Avatar,
  Spin,
  Alert,
  Pagination,
  Radio,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchUsers,
  setSearchQuery,
  setViewMode,
  setPagination,
  clearUsersError,
  deleteUser,
} from '../store/slices';
const UserModal = lazy(() => import('../components/UserModal'));

const { Title, Text } = Typography;
const { Search } = Input;


const UserList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, loading, error, pagination, searchQuery, viewMode } =
    useAppSelector((state) => state.users);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [searchValue, setSearchValue] = useState(searchQuery);

  useEffect(() => {
    dispatch(fetchUsers({ page: pagination.page, perPage: 5 }));
  }, [dispatch, pagination.page]);

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;

    return users.filter(
      (user) =>
        user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const handleSearch = (value: string) => {
    dispatch(setSearchQuery(value));
  };

  const handlePageChange = (page: number, pageSize?: number) => {
    dispatch(setPagination({ page, perPage: pageSize || pagination.perPage }));
  };

  const handleViewModeChange = (key: string) => {
    dispatch(setViewMode(key as 'list' | 'card'));
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setIsModalVisible(true);
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setEditingUser(null);
  };

  const columns = [
    {
      title: 'Avatar',
      key: 'avatar',
      width: 150,
      render: (record: any) => (
        <Avatar
          src={record.avatar}
          style={{}}
          icon={<UserOutlined />}
          size={40}
        />
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => (
        <a href={`mailto:${email}`} style={{ color: '#1677ff' }}>
          {email}
        </a>
      ),
    },
    {
      title: 'First Name',
      dataIndex: 'first_name',
      key: 'first_name',
    },
    {
      title: 'Last Name',
      dataIndex: 'last_name',
      key: 'last_name',
    },
    {
      title: 'Action',
      key: 'action',
      render: (record: any) => (
        <Space>
          <Button
            type='primary'
            size='large'
            onClick={() => handleEditUser(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title='Delete User'
            description='Are you sure you want to delete this user?'
            onConfirm={() => dispatch(deleteUser(record.id))}
            okText='Yes'
            cancelText='No'
            okButtonProps={{ danger: true }}
          >
            <Button danger type='primary' size='large'>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const renderCardView = () => (
    <Row gutter={[16, 16]}>
      {filteredUsers.map((user) => (
        <Col xs={24} sm={12} md={8} lg={8} key={user.id}>
          <Card
            hoverable
            className='user-card'
            bodyStyle={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
            style={{
              textAlign: 'center',
            }}
          >
            <Avatar
              src={user.avatar}
              icon={<UserOutlined />}
              size={80}
              className='user-avatar'
              style={{
                marginBottom: '16px',
                border: '2px solid #f0f0f0',
              }}
            />
            <Title
              level={4}
              style={{
                margin: '0',
                fontSize: '20px',
                fontWeight: '600',
              }}
            >
              {`${user.first_name} ${user.last_name}`}
            </Title>
            <Text
              style={{
                color: '#666',
                fontSize: '14px',
              }}
            >
              {user.email}
            </Text>
            <div className='action-buttons'>
              <Button
                type='primary'
                icon={<EditOutlined />}
                size='large'
                style={{
                  borderRadius: '50%',
                  width: '56px',
                  height: '56px',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#1677ff',
                  border: 'none',
                  fontSize: '24px',
                }}
                onClick={() => handleEditUser(user)}
              />
              <Popconfirm
                title='Delete User'
                description='Are you sure you want to delete this user?'
                onConfirm={() => dispatch(deleteUser(user.id))}
                okText='Yes'
                cancelText='No'
                okButtonProps={{ danger: true }}
              >
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  size='large'
                  style={{
                    borderRadius: '50%',
                    width: '56px',
                    height: '56px',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#ff4d4f',
                    color: '#fff',
                    border: 'none',
                    fontSize: '24px',
                  }}
                />
              </Popconfirm>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );

  return (
    <div>
      <Card>
        <Space direction='vertical' size='large' style={{ width: '100%' }}>
          {/* Header */}
          <Row justify='space-between' align='middle'>
            {/* Left side: Title */}
            <Col>
              <Title level={2} style={{ margin: 0 }}>
                User
              </Title>
            </Col>

            {/* Right side: Search + Add button in same row */}
            <Col>
              <Row gutter={16} align='middle'>
                <Col>
                  <Search
                    placeholder='input search text'
                    allowClear
                    size='large'
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onSearch={handleSearch}
                  />
                </Col>
                <Col>
                  <Button
                    type='primary'
                    icon={<PlusOutlined />}
                    onClick={handleCreateUser}
                    size='large'
                  >
                    Create User
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>

          {/* View Mode Switch */}
          <Radio.Group
            optionType='button'
            // buttonStyle='solid'
            size='large'
            value={viewMode}
            onChange={(e) => handleViewModeChange(e.target.value)}
            style={{ marginTop: 8 }}
          >
            <Radio.Button value='list'>
              <Space>
                <UnorderedListOutlined />
                Table
              </Space>
            </Radio.Button>
            <Radio.Button value='card'>
              <Space>
                <AppstoreOutlined />
                Card
              </Space>
            </Radio.Button>
          </Radio.Group>
          {/* Error Alert */}
          {error && (
            <Alert
              message='Error'
              description={error}
              type='error'
              showIcon
              closable
              onClose={() => dispatch(clearUsersError())}
            />
          )}

          {/* Content */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <Spin size='large' />
              <div style={{ marginTop: '16px' }}>
                <Text>Loading users...</Text>
              </div>
            </div>
          ) : (
            <>
              {viewMode === 'list' ? (
                <div>
                  <Table
                    columns={columns}
                    dataSource={filteredUsers}
                    rowKey='id'
                    pagination={false}
                    size='middle'
                    style={{ width: '100%' }}
                  />
                </div>
              ) : (
                renderCardView()
              )}

              {/* Pagination */}
              <Row justify='end' style={{ marginTop: '16px' }}>
                <Col>
                  <Pagination
                    current={pagination.page}
                    total={pagination.total}
                    pageSize={5}
                    onChange={(page) => handlePageChange(page, 5)}
                    size='small'
                    showSizeChanger={false}
                  />
                </Col>
              </Row>
            </>
          )}
        </Space>
      </Card>

      {/* User Modal */}
      <Suspense fallback={<div />}>
        <UserModal
          visible={isModalVisible}
          user={editingUser}
          onClose={handleModalClose}
        />
      </Suspense>
    </div>
  );
};

export default UserList;
