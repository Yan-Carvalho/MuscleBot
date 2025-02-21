export interface User {
  email: string;
  name: string;
}

export interface Student {
  id: string;
  name: string;
  age: number;
  weight: number;
  height: number;
  gender: 'M' | 'F';
  phone: string;
}

export type WorkoutGoal = 'hypertrophy' | 'weightLoss' | 'strength';

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  restTime: number;
}

export type WeekDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface DayWorkout {
  id: string;
  name: string;
  exercises: Exercise[];
}

export interface WorkoutPlanner {
  id: string;
  name: string;
  targetGender: 'M' | 'F' | 'all';
  goal: WorkoutGoal;
  schedule: {
    [key in WeekDay]?: DayWorkout;
  };
}