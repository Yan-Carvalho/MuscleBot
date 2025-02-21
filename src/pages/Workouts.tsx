import React, { useState } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { Exercise, WorkoutPlanner, WorkoutGoal, WeekDay, DayWorkout } from '../types';

const WEEK_DAYS: WeekDay[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const WEEK_DAY_NAMES: Record<WeekDay, string> = {
  monday: 'Segunda',
  tuesday: 'Terça',
  wednesday: 'Quarta',
  thursday: 'Quinta',
  friday: 'Sexta',
  saturday: 'Sábado',
  sunday: 'Domingo'
};

export default function Workouts() {
  const [planners, setPlanners] = useState<WorkoutPlanner[]>([]);
  const [isPlannerModalOpen, setIsPlannerModalOpen] = useState(false);
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  const [selectedPlanner, setSelectedPlanner] = useState<WorkoutPlanner | null>(null);
  const [selectedDay, setSelectedDay] = useState<WeekDay | null>(null);
  
  const [plannerForm, setPlannerForm] = useState({
    name: '',
    targetGender: 'all' as const,
    goal: 'hypertrophy' as WorkoutGoal
  });

  const [dayForm, setDayForm] = useState({
    name: '',
    exercises: [] as Exercise[]
  });

  const handlePlannerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPlanner: WorkoutPlanner = {
      id: selectedPlanner?.id || Date.now().toString(),
      name: plannerForm.name,
      targetGender: plannerForm.targetGender,
      goal: plannerForm.goal,
      schedule: selectedPlanner?.schedule || {}
    };

    if (selectedPlanner) {
      setPlanners(planners.map(p => p.id === selectedPlanner.id ? newPlanner : p));
    } else {
      setPlanners([...planners, newPlanner]);
    }

    setIsPlannerModalOpen(false);
    setSelectedPlanner(null);
    setPlannerForm({
      name: '',
      targetGender: 'all',
      goal: 'hypertrophy'
    });
  };

  const handleDaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanner || !selectedDay) return;

    const newDay: DayWorkout = {
      id: selectedPlanner.schedule[selectedDay]?.id || Date.now().toString(),
      name: dayForm.name,
      exercises: dayForm.exercises
    };

    const updatedPlanner = {
      ...selectedPlanner,
      schedule: {
        ...selectedPlanner.schedule,
        [selectedDay]: newDay
      }
    };

    setPlanners(planners.map(p => p.id === selectedPlanner.id ? updatedPlanner : p));
    setIsDayModalOpen(false);
    setSelectedDay(null);
    setDayForm({
      name: '',
      exercises: []
    });
  };

  const handleAddExercise = () => {
    setDayForm({
      ...dayForm,
      exercises: [...dayForm.exercises, { name: '', sets: 3, reps: 12, restTime: 60 }]
    });
  };

  const handleRemoveExercise = (index: number) => {
    setDayForm({
      ...dayForm,
      exercises: dayForm.exercises.filter((_, i) => i !== index)
    });
  };

  const handleExerciseChange = (index: number, field: keyof Exercise, value: string | number) => {
    setDayForm({
      ...dayForm,
      exercises: dayForm.exercises.map((exercise, i) =>
        i === index ? { ...exercise, [field]: value } : exercise
      )
    });
  };

  const handleEditPlanner = (planner: WorkoutPlanner) => {
    setSelectedPlanner(planner);
    setPlannerForm({
      name: planner.name,
      targetGender: planner.targetGender,
      goal: planner.goal
    });
    setIsPlannerModalOpen(true);
  };

  const handleEditDay = (planner: WorkoutPlanner, day: WeekDay) => {
    setSelectedPlanner(planner);
    setSelectedDay(day);
    const dayWorkout = planner.schedule[day];
    setDayForm({
      name: dayWorkout?.name || '',
      exercises: dayWorkout?.exercises || []
    });
    setIsDayModalOpen(true);
  };

  const handleDeletePlanner = (id: string) => {
    if (confirm('Are you sure you want to delete this planner?')) {
      setPlanners(planners.filter(p => p.id !== id));
    }
  };

  const handleDeleteDay = (planner: WorkoutPlanner, day: WeekDay) => {
    if (confirm('Are you sure you want to delete this day\'s workout?')) {
      const updatedSchedule = { ...planner.schedule };
      delete updatedSchedule[day];
      
      setPlanners(planners.map(p => p.id === planner.id ? {
        ...planner,
        schedule: updatedSchedule
      } : p));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Training Planners</h2>
        <button
          onClick={() => setIsPlannerModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Planner
        </button>
      </div>

      <div className="space-y-8">
        {planners.map((planner) => (
          <div key={planner.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {planner.name}
                  </h3>
                  <div className="mt-1 space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {planner.targetGender === 'all' ? 'All Genders' : planner.targetGender === 'M' ? 'Male' : 'Female'}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {planner.goal.charAt(0).toUpperCase() + planner.goal.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditPlanner(planner)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeletePlanner(planner.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
              {WEEK_DAYS.map((day) => (
                <div key={day} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-900">{WEEK_DAY_NAMES[day]}</h4>
                    {planner.schedule[day] ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditDay(planner, day)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDay(planner, day)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedPlanner(planner);
                          setSelectedDay(day);
                          setIsDayModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {planner.schedule[day] && (
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">
                        {planner.schedule[day]?.name}
                      </h5>
                      <div className="space-y-2">
                        {planner.schedule[day]?.exercises.map((exercise, index) => (
                          <div
                            key={index}
                            className="text-sm bg-gray-50 rounded p-2"
                          >
                            <div className="font-medium text-gray-900">
                              {exercise.name}
                            </div>
                            <div className="text-gray-500">
                              {exercise.sets}×{exercise.reps} • {exercise.restTime}s
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Planner Modal */}
      {isPlannerModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">
              {selectedPlanner ? 'Edit Planner' : 'Create New Planner'}
            </h3>
            <form onSubmit={handlePlannerSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Planner Name
                </label>
                <input
                  type="text"
                  value={plannerForm.name}
                  onChange={(e) =>
                    setPlannerForm({ ...plannerForm, name: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Target Gender
                </label>
                <select
                  value={plannerForm.targetGender}
                  onChange={(e) =>
                    setPlannerForm({ ...plannerForm, targetGender: e.target.value as 'M' | 'F' | 'all' })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="all">All</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Goal
                </label>
                <select
                  value={plannerForm.goal}
                  onChange={(e) =>
                    setPlannerForm({ ...plannerForm, goal: e.target.value as WorkoutGoal })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="hypertrophy">Hypertrophy</option>
                  <option value="weightLoss">Weight Loss</option>
                  <option value="strength">Strength</option>
                </select>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsPlannerModalOpen(false);
                    setSelectedPlanner(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {selectedPlanner ? 'Save Changes' : 'Create Planner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Day Modal */}
      {isDayModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">
              {selectedDay && `${WEEK_DAY_NAMES[selectedDay]} - ${selectedPlanner?.schedule[selectedDay] ? 'Edit Workout' : 'Add Workout'}`}
            </h3>
            <form onSubmit={handleDaySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Workout Name
                </label>
                <input
                  type="text"
                  value={dayForm.name}
                  onChange={(e) =>
                    setDayForm({ ...dayForm, name: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Exercises
                  </label>
                  <button
                    type="button"
                    onClick={handleAddExercise}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Exercise
                  </button>
                </div>

                <div className="space-y-4">
                  {dayForm.exercises.map((exercise, index) => (
                    <div
                      key={index}
                      className="border rounded-md p-4 relative"
                    >
                      <button
                        type="button"
                        onClick={() => handleRemoveExercise(index)}
                        className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Exercise Name
                          </label>
                          <input
                            type="text"
                            value={exercise.name}
                            onChange={(e) =>
                              handleExerciseChange(index, 'name', e.target.value)
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Sets
                          </label>
                          <input
                            type="number"
                            value={exercise.sets}
                            onChange={(e) =>
                              handleExerciseChange(index, 'sets', parseInt(e.target.value))
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                            min="1"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Reps
                          </label>
                          <input
                            type="number"
                            value={exercise.reps}
                            onChange={(e) =>
                              handleExerciseChange(index, 'reps', parseInt(e.target.value))
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                            min="1"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Rest Time (seconds)
                          </label>
                          <input
                            type="number"
                            value={exercise.restTime}
                            onChange={(e) =>
                              handleExerciseChange(index, 'restTime', parseInt(e.target.value))
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                            min="0"
                            step="5"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsDayModalOpen(false);
                    setSelectedDay(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {selectedPlanner?.schedule[selectedDay || ''] ? 'Save Changes' : 'Add Workout'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}