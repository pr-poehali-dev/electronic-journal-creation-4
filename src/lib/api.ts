const API_URL = 'https://functions.poehali.dev/fea1ff08-7639-40d7-8d7e-d8e20a6c97fe';

export interface Teacher {
  id: number;
  name: string;
  subject: string;
  classes: string;
  status: 'active' | 'vacation';
}

export interface Student {
  id: number;
  name: string;
  class: string;
  attendance: number;
  avg_grade: number;
}

export interface Grade {
  id: number;
  student_id: number;
  subject: string;
  grade: number;
  teacher_name: string;
  comment?: string;
  date: string;
  student_name?: string;
}

export interface ScheduleLesson {
  id: number;
  class_name: string;
  time_slot: string;
  subject: string;
  teacher_name: string;
  classroom: string;
}

export interface Analytics {
  total_students: number;
  total_teachers: number;
  avg_grade: number;
  avg_attendance: number;
  grades_by_subject: Array<{ subject: string; avg_grade: number }>;
}

export const api = {
  async getTeachers(): Promise<Teacher[]> {
    const res = await fetch(`${API_URL}?action=teachers`);
    const data = await res.json();
    return data.teachers;
  },

  async getStudents(): Promise<Student[]> {
    const res = await fetch(`${API_URL}?action=students`);
    const data = await res.json();
    return data.students;
  },

  async getGrades(studentId?: number): Promise<Grade[]> {
    const url = studentId 
      ? `${API_URL}?action=grades&student_id=${studentId}`
      : `${API_URL}?action=grades`;
    const res = await fetch(url);
    const data = await res.json();
    return data.grades;
  },

  async getSchedule(className?: string): Promise<ScheduleLesson[]> {
    const url = className
      ? `${API_URL}?action=schedule&class_name=${className}`
      : `${API_URL}?action=schedule`;
    const res = await fetch(url);
    const data = await res.json();
    return data.schedule;
  },

  async getAnalytics(): Promise<Analytics> {
    const res = await fetch(`${API_URL}?action=analytics`);
    return res.json();
  },

  async addTeacher(teacher: Omit<Teacher, 'id'>): Promise<{ success: boolean; id: number }> {
    const res = await fetch(`${API_URL}?action=teacher`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(teacher)
    });
    return res.json();
  },

  async updateTeacher(teacher: Teacher): Promise<{ success: boolean }> {
    const res = await fetch(`${API_URL}?action=teacher`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(teacher)
    });
    return res.json();
  },

  async deleteTeacher(id: number): Promise<{ success: boolean }> {
    const res = await fetch(`${API_URL}?action=teacher&id=${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  async addStudent(student: Omit<Student, 'id' | 'avg_grade'>): Promise<{ success: boolean; id: number }> {
    const res = await fetch(`${API_URL}?action=student`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student)
    });
    return res.json();
  },

  async updateStudent(student: Omit<Student, 'avg_grade'>): Promise<{ success: boolean }> {
    const res = await fetch(`${API_URL}?action=student`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student)
    });
    return res.json();
  },

  async deleteStudent(id: number): Promise<{ success: boolean }> {
    const res = await fetch(`${API_URL}?action=student&id=${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  async addGrade(grade: Omit<Grade, 'id'>): Promise<{ success: boolean; id: number }> {
    const res = await fetch(`${API_URL}?action=grade`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(grade)
    });
    return res.json();
  },

  async addScheduleLesson(lesson: Omit<ScheduleLesson, 'id'>): Promise<{ success: boolean; id: number }> {
    const res = await fetch(`${API_URL}?action=schedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lesson)
    });
    return res.json();
  }
};
