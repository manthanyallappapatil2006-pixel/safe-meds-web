import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  User,
  Heart,
  Plus,
  Trash2,
  Edit,
  Calendar,
  AlertCircle,
  Activity,
  Droplet,
  ArrowRight
} from 'lucide-react';
import { Modal } from '../components/Modal';
import { FormField } from '../components/FormField';
import { EmptyState } from '../components/EmptyState';
import { useApp } from '../context/AppContext';

export const FamilyProfiles = () => {
  const { familyMembers, addFamilyMember, updateFamilyMember, deleteFamilyMember } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    relationship: 'Parent',
    bloodGroup: 'B+',
    age: '',
    dateOfBirth: '',
    allergies: '',
    chronicConditions: ''
  });
  const [errors, setErrors] = useState({});

  const handleOpenAdd = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      relationship: 'Parent',
      bloodGroup: 'B+',
      age: '',
      dateOfBirth: '',
      allergies: '',
      chronicConditions: ''
    });
    setErrors({});
    setShowModal(true);
  };

  const handleOpenEdit = (member) => {
    setEditingMember(member);
    setFormData({ ...member });
    setErrors({});
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.relationship.trim()) errs.relationship = 'Relationship is required';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    if (editingMember) {
      updateFamilyMember({ ...formData, id: editingMember.id });
    } else {
      addFamilyMember(formData);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Family Member Health Profiles
            </h1>
            <span className="text-[11px] font-bold bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-full">
              Multi-Patient
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Manage profiles for parents, children, and dependents to book consultations and organize medical histories
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Family Member</span>
        </button>
      </div>

      {/* Family Cards Grid */}
      {familyMembers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No family profiles created"
          description="Create profiles for your family members to quickly book doctor visits in their name."
          actionText="Add Family Member"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {familyMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-teal-200 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-black text-base shrink-0 border border-teal-100">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">
                        {member.name}
                      </h3>
                      <span className="inline-block text-[11px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.2 rounded-md mt-0.5">
                        {member.relationship}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(member)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                      title="Edit profile"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    {member.relationship !== 'Self' && (
                      <button
                        type="button"
                        onClick={() => deleteFamilyMember(member.id)}
                        className="p-1.5 text-red-400 hover:text-red-700 cursor-pointer"
                        title="Delete profile"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Droplet className="w-3.5 h-3.5 text-red-500" />
                      Blood Group:
                    </span>
                    <span className="font-bold text-slate-900">
                      {member.bloodGroup || 'Not specified'}
                    </span>
                  </div>

                  {member.age && (
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="text-slate-500">Age:</span>
                      <span className="font-semibold text-slate-900">{member.age} yrs</span>
                    </div>
                  )}

                  {member.allergies && member.allergies !== 'None reported' && (
                    <div className="text-[11px] text-amber-800 pt-1 border-t border-slate-200">
                      <strong>Allergies: </strong> {member.allergies}
                    </div>
                  )}

                  {member.chronicConditions && member.chronicConditions !== 'None' && (
                    <div className="text-[11px] text-slate-600 pt-1 border-t border-slate-200">
                      <strong>Conditions: </strong> {member.chronicConditions}
                    </div>
                  )}
                </div>
              </div>

              <Link
                to="/doctors"
                className="w-full text-center py-2 px-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Consult for {member.name.split(' ')[0]}</span>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Family Member Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingMember ? 'Edit Family Profile' : 'Add Family Member Profile'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Sunita Sharma"
            required
            error={errors.name}
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Relationship <span className="text-red-500">*</span>
              </label>
              <select
                name="relationship"
                value={formData.relationship}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
              >
                <option value="Self">Self</option>
                <option value="Mother">Mother</option>
                <option value="Father">Father</option>
                <option value="Spouse">Spouse</option>
                <option value="Child / Son">Child / Son</option>
                <option value="Child / Daughter">Child / Daughter</option>
                <option value="Sibling">Sibling</option>
                <option value="Dependent">Dependent</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Blood Group
              </label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
              >
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', 'Unknown'].map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="Age (Years)"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              placeholder="e.g. 48"
            />

            <FormField
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
          </div>

          <FormField
            label="Known Drug or Food Allergies"
            name="allergies"
            value={formData.allergies}
            onChange={handleChange}
            placeholder="e.g. Penicillin, Sulfa, Peanuts"
          />

          <FormField
            label="Existing Chronic Conditions"
            name="chronicConditions"
            value={formData.chronicConditions}
            onChange={handleChange}
            placeholder="e.g. Hypertension, Diabetes, Asthma"
          />

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold cursor-pointer"
            >
              {editingMember ? 'Save Changes' : 'Add Member'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
