import { useState, useEffect } from 'react';
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
import { api, type Teacher, type Student, type Grade, type ScheduleLesson } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function DirectorDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('analytics');
  const [isGradeDialogOpen, setIsGradeDialogOpen] = useState(false);
  const [isEditStudentDialogOpen, setIsEditStudentDialogOpen] = useState(false);
  const [isAddStudentDialogOpen, setIsAddStudentDialogOpen] = useState(false);
  const [isEditTeacherDialogOpen, setIsEditTeacherDialogOpen] = useState(false);
  const [isAddTeacherDialogOpen, setIsAddTeacherDialogOpen] = useState(false);
  const [isEditScheduleDialogOpen, setIsEditScheduleDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedStudentGrades, setSelectedStudentGrades] = useState<Grade[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [newGrade, setNewGrade] = useState({ subject: '', grade: '5', teacher_name: '', comment: '' });
  const [newStudent, setNewStudent] = useState({ name: '', class: '9А', attendance: 100 });
  const [newTeacher, setNewTeacher] = useState({ name: '', subject: '', classes: '', status: 'active' as const });
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [editTeacher, setEditTeacher] = useState<Teacher | null>(null);

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [avgGrade, setAvgGrade] = useState(0);
  const [avgAttendance, setAvgAttendance] = useState(0);
  const [gradesBySubject, setGradesBySubject] = useState<Array<{ subject: string; avg_grade: number }>>([]);
  const [schedules, setSchedules] = useState<Record<string, ScheduleLesson[]>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [teachersData, studentsData, analyticsData] = await Promise.all([
        api.getTeachers(),
        api.getStudents(),
        api.getAnalytics()
      ]);
      
      setTeachers(teachersData.filter(t => t.status !== 'deleted'));
      setStudents(studentsData.filter(s => s.class !== 'Архив'));
      setTotalStudents(analyticsData.total_students);
      setTotalTeachers(analyticsData.total_teachers);
      setAvgGrade(analyticsData.avg_grade);
      setAvgAttendance(analyticsData.avg_attendance);
      setGradesBySubject(analyticsData.grades_by_subject);
    } catch (error) {
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить данные",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddGrade = async (studentId: number) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      setSelectedStudent(student);
      const grades = await api.getGrades(studentId);
      setSelectedStudentGrades(grades);
      setIsGradeDialogOpen(true);
    }
  };

  const handleSaveGrade = async () => {
    if (!selectedStudent || !newGrade.subject || !newGrade.grade) {
      toast({ title: "Ошибка", description: "Заполните все поля", variant: "destructive" });
      return;
    }

    try {
      await api.addGrade({
        student_id: selectedStudent.id,
        subject: newGrade.subject,
        grade: parseInt(newGrade.grade),
        teacher_name: newGrade.teacher_name,
        comment: newGrade.comment,
        date: new Date().toISOString().split('T')[0]
      });
      
      toast({ title: "Успех", description: "Оценка выставлена!" });
      setIsGradeDialogOpen(false);
      setNewGrade({ subject: '', grade: '5', teacher_name: '', comment: '' });
      loadData();
    } catch (error) {
      toast({ title: "Ошибка", description: "Не удалось выставить оценку", variant: "destructive" });
    }
  };

  const handleEditStudent = (studentId: number) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      setEditStudent(student);
      setIsEditStudentDialogOpen(true);
    }
  };

  const handleSaveStudent = async () => {
    if (!editStudent) return;

    try {
      await api.updateStudent({
        id: editStudent.id,
        name: editStudent.name,
        class: editStudent.class,
        attendance: editStudent.attendance
      });
      
      toast({ title: "Успех", description: "Данные ученика обновлены!" });
      setIsEditStudentDialogOpen(false);
      loadData();
    } catch (error) {
      toast({ title: "Ошибка", description: "Не удалось обновить данные", variant: "destructive" });
    }
  };

  const handleAddStudent = async () => {
    if (!newStudent.name || !newStudent.class) {
      toast({ title: "Ошибка", description: "Заполните все поля", variant: "destructive" });
      return;
    }

    try {
      await api.addStudent(newStudent);
      toast({ title: "Успех", description: "Ученик добавлен!" });
      setIsAddStudentDialogOpen(false);
      setNewStudent({ name: '', class: '9А', attendance: 100 });
      loadData();
    } catch (error) {
      toast({ title: "Ошибка", description: "Не удалось добавить ученика", variant: "destructive" });
    }
  };

  const handleDeleteStudent = async (studentId: number) => {
    if (!confirm('Вы уверены, что хотите удалить этого ученика?')) return;

    try {
      await api.deleteStudent(studentId);
      toast({ title: "Успех", description: "Ученик удален" });
      loadData();
    } catch (error) {
      toast({ title: "Ошибка", description: "Не удалось удалить ученика", variant: "destructive" });
    }
  };

  const handleEditTeacher = (teacherId: number) => {
    const teacher = teachers.find(t => t.id === teacherId);
    if (teacher) {
      setEditTeacher(teacher);
      setIsEditTeacherDialogOpen(true);
    }
  };

  const handleSaveTeacher = async () => {
    if (!editTeacher) return;

    try {
      await api.updateTeacher(editTeacher);
      toast({ title: "Успех", description: "Данные учителя обновлены!" });
      setIsEditTeacherDialogOpen(false);
      loadData();
    } catch (error) {
      toast({ title: "Ошибка", description: "Не удалось обновить данные", variant: "destructive" });
    }
  };

  const handleAddTeacher = async () => {
    if (!newTeacher.name || !newTeacher.subject) {
      toast({ title: "Ошибка", description: "Заполните все поля", variant: "destructive" });
      return;
    }

    try {
      await api.addTeacher(newTeacher);
      toast({ title: "Успех", description: "Учитель добавлен!" });
      setIsAddTeacherDialogOpen(false);
      setNewTeacher({ name: '', subject: '', classes: '', status: 'active' });
      loadData();
    } catch (error) {
      toast({ title: "Ошибка", description: "Не удалось добавить учителя", variant: "destructive" });
    }
  };

  const handleDeleteTeacher = async (teacherId: number) => {
    if (!confirm('Вы уверены, что хотите удалить этого учителя?')) return;

    try {
      await api.deleteTeacher(teacherId);
      toast({ title: "Успех", description: "Учитель удален" });
      loadData();
    } catch (error) {
      toast({ title: "Ошибка", description: "Не удалось удалить учителя", variant: "destructive" });
    }
  };

  const handleEditSchedule = async (className: string) => {
    setSelectedClass(className);
    try {
      const schedule = await api.getSchedule(className);
      setSchedules({ ...schedules, [className]: schedule });
      setIsEditScheduleDialogOpen(true);
    } catch (error) {
      toast({ title: "Ошибка", description: "Не удалось загрузить расписание", variant: "destructive" });
    }
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  if (loading && students.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" className="animate-spin mx-auto mb-4" size={48} />
          <p>Загрузка данных...</p>
        </div>
      </div>
    );
  }

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
              Учеников: {totalStudents}
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
                    <p className="text-2xl font-bold">{totalStudents}</p>
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
                    <p className="text-2xl font-bold">{totalTeachers}</p>
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
                    <p className="text-2xl font-bold">{avgGrade.toFixed(1)}</p>
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
                    <p className="text-2xl font-bold">{avgAttendance.toFixed(0)}%</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Средние оценки по предметам</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={gradesBySubject.map(g => ({ subject: g.subject, avgGrade: g.avg_grade }))}>
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
                          <Badge variant={student.avg_grade >= 4.5 ? 'default' : 'secondary'}>
                            {student.avg_grade.toFixed(1)}
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
              <Select value={newGrade.subject} onValueChange={(value) => setNewGrade({ ...newGrade, subject: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите предмет" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Математика">Математика</SelectItem>
                  <SelectItem value="Русский язык">Русский язык</SelectItem>
                  <SelectItem value="Физика">Физика</SelectItem>
                  <SelectItem value="История">История</SelectItem>
                  <SelectItem value="Английский язык">Английский язык</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Оценка</Label>
              <Select value={newGrade.grade} onValueChange={(value) => setNewGrade({ ...newGrade, grade: value })}>
                <SelectTrigger>
                  <SelectValue />
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
              <Label>Учитель</Label>
              <Input 
                value={newGrade.teacher_name}
                onChange={(e) => setNewGrade({ ...newGrade, teacher_name: e.target.value })}
                placeholder="ФИО учителя"
              />
            </div>
            <div className="space-y-2">
              <Label>Комментарий (необязательно)</Label>
              <Input 
                value={newGrade.comment}
                onChange={(e) => setNewGrade({ ...newGrade, comment: e.target.value })}
                placeholder="Комментарий к оценке"
              />
            </div>
            {selectedStudentGrades.length > 0 && (
              <div className="space-y-2">
                <Label>Последние оценки</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedStudentGrades.slice(0, 5).map((grade) => (
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
            <Button onClick={handleSaveGrade}>
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
              <Input 
                value={editStudent?.name || ''} 
                onChange={(e) => editStudent && setEditStudent({ ...editStudent, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Класс</Label>
              <Select 
                value={editStudent?.class || ''} 
                onValueChange={(value) => editStudent && setEditStudent({ ...editStudent, class: value })}
              >
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
              <Input 
                type="number" 
                value={editStudent?.attendance || 100} 
                onChange={(e) => editStudent && setEditStudent({ ...editStudent, attendance: parseInt(e.target.value) })}
                min="0" 
                max="100" 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditStudentDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleSaveStudent}>
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
              <Input 
                placeholder="Иванов Иван Иванович"
                value={newStudent.name}
                onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Класс</Label>
              <Select value={newStudent.class} onValueChange={(value) => setNewStudent({ ...newStudent, class: value })}>
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddStudentDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleAddStudent}>
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
              <Input 
                value={editTeacher?.name || ''} 
                onChange={(e) => editTeacher && setEditTeacher({ ...editTeacher, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Предмет</Label>
              <Input 
                value={editTeacher?.subject || ''}
                onChange={(e) => editTeacher && setEditTeacher({ ...editTeacher, subject: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Классы</Label>
              <Input 
                value={editTeacher?.classes || ''}
                onChange={(e) => editTeacher && setEditTeacher({ ...editTeacher, classes: e.target.value })}
                placeholder="9А, 9Б, 10А" 
              />
            </div>
            <div className="space-y-2">
              <Label>Статус</Label>
              <Select 
                value={editTeacher?.status || 'active'} 
                onValueChange={(value: 'active' | 'vacation') => editTeacher && setEditTeacher({ ...editTeacher, status: value })}
              >
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
            <Button onClick={handleSaveTeacher}>
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
              <Input 
                placeholder="Иванова Анна Петровна"
                value={newTeacher.name}
                onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Предмет</Label>
              <Input 
                placeholder="Математика"
                value={newTeacher.subject}
                onChange={(e) => setNewTeacher({ ...newTeacher, subject: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Классы</Label>
              <Input 
                placeholder="9А, 9Б, 10А"
                value={newTeacher.classes}
                onChange={(e) => setNewTeacher({ ...newTeacher, classes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTeacherDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleAddTeacher}>
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
            {schedules[selectedClass] && schedules[selectedClass].length > 0 ? (
              <div className="space-y-2">
                {schedules[selectedClass].map((lesson, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{lesson.time_slot}</div>
                      <div className="text-sm text-muted-foreground">{lesson.subject}</div>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm">{lesson.teacher_name}</div>
                      <div className="text-xs text-muted-foreground">Каб. {lesson.classroom}</div>
                    </div>
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
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
