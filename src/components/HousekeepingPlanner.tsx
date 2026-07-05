import React, { useState } from 'react';
import { HousekeepingTask, Room } from '../types';
import { Sparkles, Check, CheckCircle2, AlertTriangle, Plus, PlusCircle, Trash, RefreshCw, Layers, ClipboardList, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HousekeepingPlannerProps {
  tasks: HousekeepingTask[];
  rooms: Room[];
  onUpdateTaskStatus: (taskId: string, status: 'Pending' | 'In Progress' | 'Completed') => void;
  onAddTask: (task: Omit<HousekeepingTask, 'id'>) => void;
}

export default function HousekeepingPlanner({
  tasks,
  rooms,
  onUpdateTaskStatus,
  onAddTask
}: HousekeepingPlannerProps) {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [selectedRoomNumber, setSelectedRoomNumber] = useState('');
  const [taskType, setTaskType] = useState<'Full Clean' | 'Express Clean' | 'Maintenance Repair' | 'Turndown Service'>('Full Clean');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [notes, setNotes] = useState('');

  const handleSubmitTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoomNumber) {
      alert('Please select a room to assign this task.');
      return;
    }

    onAddTask({
      roomNumber: selectedRoomNumber,
      taskType,
      assignedTo: assignedTo || 'Staff On Duty',
      priority,
      status: 'Pending',
      notes
    });

    // Reset Form
    setSelectedRoomNumber('');
    setAssignedTo('');
    setNotes('');
    setIsAddingTask(false);
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-rose-50 border-rose-200 text-rose-700 font-bold';
      case 'Medium': return 'bg-amber-50 border-amber-200 text-amber-700';
      default: return 'bg-slate-100 border-slate-200 text-slate-700';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'In Progress': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default: return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Overview stats header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
            <ClipboardList size={18} className="text-slate-500" /> Housekeeping & Maintenance Dashboard
          </h3>
          <p className="text-xs text-slate-500">Coordinate and check-off rooms before new customer arrivals</p>
        </div>

        <button
          onClick={() => setIsAddingTask(true)}
          className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow-sm"
        >
          <PlusCircle size={14} /> Dispatch Task
        </button>
      </div>

      {/* Task dispatch Dialog modal */}
      <AnimatePresence>
        {isAddingTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden"
            >
              <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
                <div>
                  <h3 className="font-serif text-lg font-bold">Assign Maintenance Task</h3>
                  <p className="text-[10px] text-slate-400">Directly syncs to room status upon completion</p>
                </div>
                <button onClick={() => setIsAddingTask(false)} className="text-slate-400 hover:text-white">
                  <X size={15} />
                </button>
              </div>

              <form onSubmit={handleSubmitTask} className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  {/* Room selection */}
                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Target Room Number</label>
                    <select
                      value={selectedRoomNumber}
                      onChange={(e) => setSelectedRoomNumber(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                      required
                    >
                      <option value="">Choose Room...</option>
                      {rooms.map(room => (
                        <option key={room.id} value={room.number}>
                          Room {room.number} ({room.status})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Task Type */}
                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Service Required</label>
                    <select
                      value={taskType}
                      onChange={(e) => setTaskType(e.target.value as any)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                    >
                      <option value="Full Clean">Full Clean (Check-Out)</option>
                      <option value="Express Clean">Express Clean (In-House)</option>
                      <option value="Maintenance Repair">Maintenance Repair</option>
                      <option value="Turndown Service">Turndown Service</option>
                    </select>
                  </div>

                  {/* Assigned staff */}
                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Assigned Personnel</label>
                    <input
                      type="text"
                      placeholder="e.g. David Miller"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                    />
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Urgency Priority</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High Urgency</option>
                    </select>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Task Details / Instructions</label>
                  <textarea
                    rows={3}
                    placeholder="Enter instructions, e.g. Fix lightbulb, replenish minibar..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none resize-none"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="submit" className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg">
                    Dispatch Order
                  </button>
                  <button type="button" onClick={() => setIsAddingTask(false)} className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Housekeeping list view */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* ID & priority Header */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-800 font-mono text-[10px] font-bold rounded">
                      Room {task.roomNumber}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">Task: {task.id}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 text-[9px] rounded-full border ${getPriorityBadgeClass(task.priority)}`}>
                      {task.priority} Priority
                    </span>
                    <span className={`px-2 py-0.5 text-[9px] rounded-full border ${getStatusBadgeClass(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                </div>

                {/* Task Type */}
                <div>
                  <h4 className="font-serif text-base font-bold text-slate-900">{task.taskType}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {task.notes || 'No special requirements listed.'}
                  </p>
                </div>
              </div>

              {/* Actions & Assignee row */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-100/60 mt-4">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">ASSIGNED TO</span>
                  <span className="text-xs font-semibold text-slate-700">{task.assignedTo}</span>
                </div>

                <div className="flex gap-1.5">
                  {task.status === 'Pending' && (
                    <button
                      onClick={() => onUpdateTaskStatus(task.id, 'In Progress')}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 font-semibold rounded text-[10px] border border-slate-200 hover:border-indigo-200 transition-colors"
                    >
                      Start Task
                    </button>
                  )}
                  {task.status === 'In Progress' && (
                    <button
                      onClick={() => onUpdateTaskStatus(task.id, 'Completed')}
                      className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded text-[10px] transition-colors flex items-center gap-1"
                    >
                      <Check size={11} /> Mark Completed
                    </button>
                  )}
                  {task.status === 'Completed' && (
                    <span className="text-[10px] font-mono text-emerald-600 font-bold flex items-center gap-1 uppercase bg-emerald-50 px-2 py-1 rounded">
                      <CheckCircle2 size={11} /> Done
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
