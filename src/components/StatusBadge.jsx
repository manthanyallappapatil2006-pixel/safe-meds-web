import React from 'react';

export const StatusBadge = ({ status, className = '' }) => {
  let colorStyles = 'bg-slate-100 text-slate-700 border-slate-200';

  switch (status) {
    // Appointment & Order & Prescriptions positive states
    case 'Upcoming':
    case 'Open Now':
    case 'Open 24/7':
    case 'In Stock':
    case 'Available Today':
      colorStyles = 'bg-teal-50 text-teal-800 border-teal-200';
      break;

    case 'Approved in Demo':
    case 'Delivered in Demo':
    case 'Completed':
    case 'Demo Completed':
      colorStyles = 'bg-emerald-50 text-emerald-800 border-emerald-200';
      break;

    // In progress states
    case 'Out for Delivery':
    case 'Preparing Order':
    case 'Pharmacy Reviewing':
    case 'Demo Request Created':
    case 'Awaiting Demo Confirmation':
    case 'Available Tomorrow':
      colorStyles = 'bg-blue-50 text-blue-800 border-blue-200';
      break;

    case 'Pending Review':
    case 'Limited Stock':
    case 'Closing at 8:30 PM':
    case 'Closing at 10 PM':
      colorStyles = 'bg-amber-50 text-amber-800 border-amber-200';
      break;

    // Emergency or Cancelled states
    case 'Cancelled':
    case 'Rejected in Demo':
    case 'Emergency':
      colorStyles = 'bg-red-50 text-red-800 border-red-200';
      break;

    case 'Prescription Required':
    case 'In Stock (Prescription Required)':
      colorStyles = 'bg-purple-50 text-purple-800 border-purple-200';
      break;

    default:
      colorStyles = 'bg-slate-100 text-slate-700 border-slate-200';
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorStyles} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70"></span>
      {status}
    </span>
  );
};
