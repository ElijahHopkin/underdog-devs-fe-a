import React, { useEffect, useState } from 'react';
import useAxiosWithAuth0 from '../../../hooks/useAxiosWithAuth0';
import ApplicationModal from './ApplicationModal';
import { Table, Button, Tag } from 'antd';

// Filter by status
const statusFilter = (value, record) => {
  if (Array.isArray(value)) {
    return (
      record.status.props.children === value[0] ||
      record.status.props.children === value[1] ||
      record.status.props.children === value[2]
    );
  } else {
    return record.status.props.children === value;
  }
};

const columns = [
  // Names sorting by alphabetical order
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name),
    sortDirections: ['descend', 'ascend'],
  },
  {
    // Add in functionality for filter button for roles
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
    filters: [
      {
        text: 'mentor',
        value: 'mentor',
      },
      {
        text: 'mentee',
        value: 'mentee',
      },
    ],
    onFilter: (value, record) => record.role.props.children === value,
  },
  {
    title: 'Date Updated',
    dataIndex: 'date',
    key: 'date',
    sorter: (a, b) => a.date.localeCompare(b.date),
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    filters: [
      {
        text: 'pending',
        value: 'pending',
      },
      {
        text: 'approved',
        value: 'approved',
      },
      {
        text: 'rejected',
        value: 'rejected',
      },
      {
        text: 'show all',
        value: ['pending', 'approved', 'rejected'],
      },
    ],
    defaultFilteredValue: ['pending'],
    onFilter: (value, record) => statusFilter(value, record),
  },
  {
    title: 'Application',
    dataIndex: 'button',
    key: 'button',
  },
];

const PendingApplications = () => {
  const [applications, setApplications] = useState([]);
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [profileId, setProfileId] = useState('');
  const { axiosWithAuth } = useAxiosWithAuth0();

  const showModal = profile_id => {
    setProfileId(profile_id);
    setModalIsVisible(true);
  };

  const getPendingApps = async () => {
    try {
      const api = await axiosWithAuth().post(`/application`);
      api.data.forEach(row => {
        row.hasOwnProperty('accepting_new_mentees')
          ? (row.role_name = 'mentor')
          : (row.role_name = 'mentee');
      });
      setApplications(
        Object.values(api.data).map(row => ({
          key: row.profile_id,
          name: row.first_name + ' ' + row.last_name,
          role: (
            <Tag color={row.role_name === 'mentor' ? 'blue' : 'purple'}>
              {row.role_name}
            </Tag>
          ),
          date: (row.updated_at ? row.updated_at : row.created_at).slice(0, 10),
          status: (
            <Tag
              color={
                row.validate_status === 'approved'
                  ? 'green'
                  : row.validate_status === 'pending'
                  ? 'orange'
                  : 'red'
              }
            >
              {row.validate_status}
            </Tag>
          ),
          button: (
            <Button
              style={{
                backgroundImage:
                  'linear-gradient(-180deg, #37AEE2 0%, #1E96C8 100%)',
                borderRadius: '.5rem',
                boxSizing: 'border-box',
                color: '#FFFFFF',
                display: 'flex',
                fontSize: '16px',
                justifyContent: 'center',
                cursor: 'pointer',
                touchAction: 'manipulation',
              }}
              type="primary"
              id={row.profile_id}
              onClick={() => showModal(row.profile_id)}
            >
              Review Application
            </Button>
          ),
        }))
      );
    } catch (err) {
      // needs proper error handling
      console.error(err);
    }
  };

  useEffect(() => {
    getPendingApps();
  }, []);

  return (
    <>
      <h2>Applications</h2>
      <ApplicationModal
        displayModal={modalIsVisible}
        setDisplayModal={setModalIsVisible}
        profileId={profileId}
        setProfileId={setProfileId}
        applicationProfile={applications}
        getPendingApps={getPendingApps}
      />
      <Table columns={columns} dataSource={applications} />;
    </>
  );
};

export default PendingApplications;
