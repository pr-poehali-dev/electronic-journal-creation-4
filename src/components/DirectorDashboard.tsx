import { useState } from 'react';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import Icon from './ui/icon';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface Teacher {
  id: number;
  name: string;
  subject: string;
  classes: string;
  status: 'active' | 'vacation';
}

interface Student {
  id: number;
  name: string;
  class: string;
  avgGrade: number;
  attendance: number;
  grades: Grade[];
}

interface Grade {
  id: number;
  subject: string;
  grade: number;
  date: string;
  teacher: string;
}

interface ScheduleLesson {
  time: string;
  subject: string;
  teacher: string;
  classroom: string;
}

export default function DirectorDashboard() {
  const [activeTab, setActiveTab] = useState('analytics');
  const [isGradeDialogOpen, setIsGradeDialogOpen] = useState(false);
  const [isEditStudentDialogOpen, setIsEditStudentDialogOpen] = useState(false);
  const [isAddStudentDialogOpen, setIsAddStudentDialogOpen] = useState(false);
  const [isEditTeacherDialogOpen, setIsEditTeacherDialogOpen] = useState(false);
  const [isAddTeacherDialogOpen, setIsAddTeacherDialogOpen] = useState(false);
  const [isEditScheduleDialogOpen, setIsEditScheduleDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  const [teachers, setTeachers] = useState<Teacher[]>([
    { id: 1, name: 'Иванова Анна Петровна', subject: 'Математика', classes: '9А, 9Б, 10А', status: 'active' },
    { id: 2, name: 'Петрова Мария Сергеевна', subject: 'Русский язык', classes: '8А, 9А, 11Б', status: 'active' },
    { id: 3, name: 'Сидоров Иван Константинович', subject: 'Физика', classes: '9А, 10Б, 11А', status: 'vacation' },
    { id: 4, name: 'Коваленко Наталья Викторовна', subject: 'История', classes: '7А, 8Б, 9А', status: 'active' },
    { id: 5, name: 'Смирнова Ольга Дмитриевна', subject: 'Английский язык', classes: '5А, 6А, 9А', status: 'active' },
  ]);

  const [students, setStudents] = useState<Student[]>([
    { 
      id: 1, 
      name: 'Петров Иван', 
      class: '9А', 
      avgGrade: 4.8, 
      attendance: 98,
      grades: [
        { id: 1, subject: 'Математика', grade: 5, date: '2026-01-15', teacher: 'Иванова А.П.' },
        { id: 2, subject: 'Физика', grade: 5, date: '2026-01-14', teacher: 'Сидоров И.К.' },
        { id: 3, subject: 'История', grade: 4, date: '2026-01-13', teacher: 'Коваленко Н.В.' },
      ]
    },
    { 
      id: 2, 
      name: 'Сидорова Мария', 
      class: '9А', 
      avgGrade: 4.6, 
      attendance: 95,
      grades: [
        { id: 4, subject: 'Математика', grade: 5, date: '2026-01-15', teacher: 'Иванова А.П.' },
        { id: 5, subject: 'Русский язык', grade: 4, date: '2026-01-14', teacher: 'Петрова М.С.' },
      ]
    },
    { 
      id: 3, 
      name: 'Иванов Алексей', 
      class: '9Б', 
      avgGrade: 4.2, 
      attendance: 92,
      grades: [
        { id: 6, subject: 'Физика', grade: 4, date: '2026-01-15', teacher: 'Сидоров И.К.' },
      ]
    },
    { 
      id: 4, 
      name: 'Козлова Екатерина', 
      class: '10А', 
      avgGrade: 4.9, 
      attendance: 99,
      grades: [
        { id: 7, subject: 'Математика', grade: 5, date: '2026-01-15', teacher: 'Иванова А.П.' },
        { id: 8, subject: 'Английский язык', grade: 5, date: '2026-01-14', teacher: 'Смирнова О.Д.' },
      ]
    },
    { 
      id: 5, 
      name: 'Новиков Дмитрий', 
      class: '10А', 
      avgGrade: 4.1, 
      attendance: 88,
      grades: [
        { id: 9, subject: 'История', grade: 4, date: '2026-01-13', teacher: 'Коваленко Н.В.' },
      ]
    },
  ]);

  const [schedules, setSchedules] = useState<Record<string, ScheduleLesson[]>>({
    '9А': [
      { time: '8:00-8:45', subject: 'Математика', teacher: 'Иванова А.П.', classroom: '205' },
      { time: '9:00-9:45', subject: 'Русский язык', teacher: 'Петрова М.С.', classroom: '301' },
      { time: '10:00-10:45', subject: 'Физика', teacher: 'Сидоров И.К.', classroom: '402' },
      { time: '11:00-11:45', subject: 'История', teacher: 'Коваленко Н.В.', classroom: '203' },
      { time: '12:00-12:45', subject: 'Английский язык', teacher: 'Смирнова О.Д.', classroom: '104' },
      { time: '13:00-13:45', subject: 'Физкультура', teacher: 'Петров В.И.', classroom: 'Спортзал' },
    ],
  });

  const gradeData = [
    { subject: 'Математика', avgGrade: 4.2 },
    { subject: 'Русский', avgGrade: 4.5 },
    { subject: 'Физика', avgGrade: 4.1 },
    { subject: 'История', avgGrade: 4.4 },
    { subject: 'Английский', avgGrade: 4.3 },
    { subject: 'Химия', avgGrade: 4.0 },
  ];

  const attendanceData = [
    { month: 'Сен', value: 96 },
    { month: 'Окт', value: 94 },
    { month: 'Ноя', value: 95 },
    { month: 'Дек', value: 97 },
  ];

  const classDistribution = [
    { name: '5-6 классы', value: 120, color: '#4F46E5' },
    { name: '7-8 классы', value: 150, color: '#8B5CF6' },
    { name: '9-11 классы', value: 110, color: '#0EA5E9' },
  ];

  const handleAddGrade = (studentId: number) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      setSelectedStudent(student);
      setIsGradeDialogOpen(true);
    }
  };

  const handleEditStudent = (studentId: number) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      setSelectedStudent(student);
      setIsEditStudentDialogOpen(true);
    }
  };

  const handleDeleteStudent = (studentId: number) => {
    if (confirm('Вы уверены, что хотите удалить этого ученика?')) {
      setStudents(students.filter(s => s.id !== studentId));
    }
  };

  const handleEditTeacher = (teacherId: number) => {
    const teacher = teachers.find(t => t.id === teacherId);
    if (teacher) {
      setSelectedTeacher(teacher);
      setIsEditTeacherDialogOpen(true);
    }
  };

  const handleDeleteTeacher = (teacherId: number) => {
    if (confirm('Вы уверены, что хотите удалить этого учителя?')) {
      setTeachers(teachers.filter(t => t.id !== teacherId));
    }
  };

  const handleEditSchedule = (className: string) => {
    setSelectedClass(className);
    setIsEditScheduleDialogOpen(true);
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <header className="bg-card/50 backdrop-blur-xl border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                <Icon name="Shield" className="text-white" size={20} />
              </div>
              <div>
                <h2 className="font-semibold">Панель директора</h2>
                <p className="text-sm text-muted-foreground">Управление школой</p>
              </div>
            </div>
            <Badge variant="secondary" className="hidden sm:flex">
              Учеников: {students.length}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-2">
            <TabsTrigger value="analytics" className="gap-2">
              <Icon name="BarChart3" size={16} />
              <span className="hidden sm:inline">Аналитика</span>
            </TabsTrigger>
            <TabsTrigger value="teachers" className="gap-2">
              <Icon name="Users" size={16} />
              <span className="hidden sm:inline">Учителя</span>
            </TabsTrigger>
            <TabsTrigger value="students" className="gap-2">
              <Icon name="GraduationCap" size={16} />
              <span className="hidden sm:inline">Ученики</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="gap-2">
              <Icon name="Calendar" size={16} />
              <span className="hidden sm:inline">Расписание</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6 animate-fade-in">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon name="Users" className="text-primary" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Всего учеников</p>
                    <p className="text-2xl font-bold">{students.length}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Icon name="BookOpen" className="text-accent" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Учителей</p>
                    <p className="text-2xl font-bold">{teachers.length}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <Icon name="TrendingUp" className="text-green-500" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Средний балл</p>
                    <p className="text-2xl font-bold">4.3</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Icon name="CheckCircle" className="text-blue-500" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Посещаемость</p>
                    <p className="text-2xl font-bold">95%</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Средние оценки по предметам</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={gradeData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="subject" className="text-xs" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Bar dataKey="avgGrade" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Посещаемость по месяцам</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[90, 100]} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--accent))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--accent))', r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <Card className="p-6">
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Распределение учеников по классам</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={classDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {classDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col justify-center space-y-4">
                  {classDistribution.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <span className="text-2xl font-bold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="teachers" className="animate-fade-in">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Управление учителями</h3>
                <Button className="gap-2" onClick={() => setIsAddTeacherDialogOpen(true)}>
                  <Icon name="UserPlus" size={16} />
                  Добавить учителя
                </Button>
              </div>
              <div className="mb-4">
                <Input 
                  placeholder="Поиск учителей..." 
                  className="max-w-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ФИО</TableHead>
                      <TableHead>Предмет</TableHead>
                      <TableHead>Классы</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeachers.map((teacher) => (
                      <TableRow key={teacher.id}>
                        <TableCell className="font-medium">{teacher.name}</TableCell>
                        <TableCell>{teacher.subject}</TableCell>
                        <TableCell>{teacher.classes}</TableCell>
                        <TableCell>
                          <Badge variant={teacher.status === 'active' ? 'default' : 'secondary'}>
                            {teacher.status === 'active' ? 'Активен' : 'В отпуске'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditTeacher(teacher.id)}
                            >
                              <Icon name="Edit" size={16} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteTeacher(teacher.id)}
                            >
                              <Icon name="Trash2" size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="animate-fade-in">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Список учеников</h3>
                <Button className="gap-2" onClick={() => setIsAddStudentDialogOpen(true)}>
                  <Icon name="UserPlus" size={16} />
                  Добавить ученика
                </Button>
              </div>
              <div className="mb-4">
                <Input 
                  placeholder="Поиск учеников..." 
                  className="max-w-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ФИО</TableHead>
                      <TableHead>Класс</TableHead>
                      <TableHead>Средний балл</TableHead>
                      <TableHead>Посещаемость</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.class}</TableCell>
                        <TableCell>
                          <Badge variant={student.avgGrade >= 4.5 ? 'default' : 'secondary'}>
                            {student.avgGrade.toFixed(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{student.attendance}%</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleAddGrade(student.id)}
                              title="Выставить оценку"
                            >
                              <Icon name="Plus" size={16} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditStudent(student.id)}
                              title="Редактировать"
                            >
                              <Icon name="Edit" size={16} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteStudent(student.id)}
                              title="Удалить"
                            >
                              <Icon name="Trash2" size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="animate-fade-in">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Управление расписанием</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {['9А', '9Б', '10А', '10Б', '11А', '11Б'].map((className) => (
                  <Card key={className} className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold">Класс {className}</h4>
                      <Icon name="Calendar" size={20} className="text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {schedules[className] ? `${schedules[className].length} уроков` : '6 уроков в день'}
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleEditSchedule(className)}
                      >
                        <Icon name="Eye" size={14} className="mr-1" />
                        Просмотр
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleEditSchedule(className)}
                      >
                        <Icon name="Edit" size={14} className="mr-1" />
                        Редактировать
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isGradeDialogOpen} onOpenChange={setIsGradeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Выставить оценку</DialogTitle>
            <DialogDescription>
              Ученик: {selectedStudent?.name} ({selectedStudent?.class})
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Предмет</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите предмет" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="math">Математика</SelectItem>
                  <SelectItem value="russian">Русский язык</SelectItem>
                  <SelectItem value="physics">Физика</SelectItem>
                  <SelectItem value="history">История</SelectItem>
                  <SelectItem value="english">Английский язык</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Оценка</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите оценку" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 (Отлично)</SelectItem>
                  <SelectItem value="4">4 (Хорошо)</SelectItem>
                  <SelectItem value="3">3 (Удовлетворительно)</SelectItem>
                  <SelectItem value="2">2 (Неудовлетворительно)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Комментарий (необязательно)</Label>
              <Input placeholder="Комментарий к оценке" />
            </div>
            {selectedStudent && selectedStudent.grades.length > 0 && (
              <div className="space-y-2">
                <Label>Последние оценки</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedStudent.grades.map((grade) => (
                    <div key={grade.id} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm">{grade.subject}</span>
                      <Badge variant={grade.grade >= 4 ? 'default' : 'secondary'}>{grade.grade}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGradeDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={() => {
              setIsGradeDialogOpen(false);
              alert('Оценка выставлена!');
            }}>
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditStudentDialogOpen} onOpenChange={setIsEditStudentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать ученика</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>ФИО</Label>
              <Input defaultValue={selectedStudent?.name} />
            </div>
            <div className="space-y-2">
              <Label>Класс</Label>
              <Select defaultValue={selectedStudent?.class}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['5А', '6А', '7А', '8А', '9А', '9Б', '10А', '10Б', '11А', '11Б'].map((cls) => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Посещаемость (%)</Label>
              <Input type="number" defaultValue={selectedStudent?.attendance} min="0" max="100" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditStudentDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={() => {
              setIsEditStudentDialogOpen(false);
              alert('Данные ученика обновлены!');
            }}>
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddStudentDialogOpen} onOpenChange={setIsAddStudentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить ученика</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>ФИО</Label>
              <Input placeholder="Иванов Иван Иванович" />
            </div>
            <div className="space-y-2">
              <Label>Класс</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите класс" />
                </SelectTrigger>
                <SelectContent>
                  {['5А', '6А', '7А', '8А', '9А', '9Б', '10А', '10Б', '11А', '11Б'].map((cls) => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Дата рождения</Label>
              <Input type="date" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddStudentDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={() => {
              setIsAddStudentDialogOpen(false);
              alert('Ученик добавлен!');
            }}>
              Добавить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditTeacherDialogOpen} onOpenChange={setIsEditTeacherDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать учителя</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>ФИО</Label>
              <Input defaultValue={selectedTeacher?.name} />
            </div>
            <div className="space-y-2">
              <Label>Предмет</Label>
              <Input defaultValue={selectedTeacher?.subject} />
            </div>
            <div className="space-y-2">
              <Label>Классы</Label>
              <Input defaultValue={selectedTeacher?.classes} placeholder="9А, 9Б, 10А" />
            </div>
            <div className="space-y-2">
              <Label>Статус</Label>
              <Select defaultValue={selectedTeacher?.status}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Активен</SelectItem>
                  <SelectItem value="vacation">В отпуске</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditTeacherDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={() => {
              setIsEditTeacherDialogOpen(false);
              alert('Данные учителя обновлены!');
            }}>
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddTeacherDialogOpen} onOpenChange={setIsAddTeacherDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить учителя</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>ФИО</Label>
              <Input placeholder="Иванова Анна Петровна" />
            </div>
            <div className="space-y-2">
              <Label>Предмет</Label>
              <Input placeholder="Математика" />
            </div>
            <div className="space-y-2">
              <Label>Классы</Label>
              <Input placeholder="9А, 9Б, 10А" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTeacherDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={() => {
              setIsAddTeacherDialogOpen(false);
              alert('Учитель добавлен!');
            }}>
              Добавить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditScheduleDialogOpen} onOpenChange={setIsEditScheduleDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Расписание класса {selectedClass}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {schedules[selectedClass] ? (
              <div className="space-y-2">
                {schedules[selectedClass].map((lesson, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{lesson.time}</div>
                      <div className="text-sm text-muted-foreground">{lesson.subject}</div>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm">{lesson.teacher}</div>
                      <div className="text-xs text-muted-foreground">Каб. {lesson.classroom}</div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Icon name="Edit" size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Расписание не создано
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditScheduleDialogOpen(false)}>
              Закрыть
            </Button>
            <Button>
              Сохранить изменения
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
