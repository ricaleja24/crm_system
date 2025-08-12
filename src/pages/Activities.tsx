import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Activity,
  Calendar,
  User,
  Phone,
  Mail,
  MessageSquare
} from 'lucide-react';
import { fetchActivities, deleteActivity } from '../store/slices/activitiesSlice';
import { RootState, AppDispatch } from '../store';
import Modal from '../components/Modal';

const Activities: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { activities, loading, pagination } = useSelector((state: RootState) => state.activities);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    dispatch(fetchActivities({ search: searchTerm, type: typeFilter }));
  }, [dispatch, searchTerm, typeFilter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleTypeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTypeFilter(e.target.value);
  };

  const handleEdit = (activity: any) => {
    setSelectedActivity(activity);
    setShowEditModal(true);
  };

  const handleDelete = (activity: any) => {
    setSelectedActivity(activity);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedActivity) {
      dispatch(deleteActivity(selectedActivity.id));
    }
    setShowDeleteModal(false);
    setSelectedActivity(null);
  };

  const getActivityIcon = (type: string) => {
    const icons = {
      'Call': Phone,
      'Email': Mail,
      'Meeting': Calendar,
      'Note': MessageSquare,
      'Task': Activity,
      'Deal Update': Activity,
      'Status Change': Activity
    };
    return icons[type as keyof typeof icons] || Activity;
  };

  const getActivityColor = (type: string) => {
    const colors = {
      'Call': 'bg-blue-100 text-blue-600',
      'Email': 'bg-green-100 text-green-600',
      'Meeting': 'bg-purple-100 text-purple-600',
      'Note': 'bg-yellow-100 text-yellow-600',
      'Task': 'bg-indigo-100 text-indigo-600',
      'Deal Update': 'bg-orange-100 text-orange-600',
      'Status Change': 'bg-red-100 text-red-600'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activities</h1>
          <p className="text-gray-600">Track all interactions and activities</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Activity
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={typeFilter}
              onChange={handleTypeFilter}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
              <option value="Call">Call</option>
              <option value="Email">Email</option>
              <option value="Meeting">Meeting</option>
              <option value="Note">Note</option>
              <option value="Task">Task</option>
              <option value="Deal Update">Deal Update</option>
              <option value="Status Change">Status Change</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activities List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="space-y-4">
            {activities.map((activity) => {
              const IconComponent = getActivityIcon(activity.type);
              return (
                <div key={activity.id} className="flex items-start space-x-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                  <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">{activity.subject}</h3>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(activity)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(activity)}
                          className="text-red-600 hover:text-red-900 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    {activity.description && (
                      <p className="mt-1 text-sm text-gray-600">{activity.description}</p>
                    )}
                    <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100">
                        {activity.type}
                      </span>
                      {activity.creator && (
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {activity.creator.firstName} {activity.creator.lastName}
                        </div>
                      )}
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </div>
                      {activity.duration && (
                        <span>{activity.duration} minutes</span>
                      )}
                    </div>
                    {(activity.contact || activity.lead || activity.opportunity) && (
                      <div className="mt-2 text-xs text-gray-500">
                        Related to:{' '}
                        {activity.contact && `${activity.contact.firstName} ${activity.contact.lastName}`}
                        {activity.lead && `${activity.lead.firstName} ${activity.lead.lastName}`}
                        {activity.opportunity && activity.opportunity.name}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {activities.length === 0 && (
          <div className="text-center py-12">
            <Activity className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No activities</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new activity.</p>
            <div className="mt-6">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Activity
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Activity"
      >
        <div className="space-y-4">
          <p>Are you sure you want to delete this activity? This action cannot be undone.</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Activities;